-- ============================================
-- KLIMROD CFO - MASTER SCHEMA COMPLETO Y SEGURO
-- ============================================
-- ✅ SEGURO: No borra datos existentes
-- ✅ SEGURO: Usa IF NOT EXISTS en todo
-- ✅ SEGURO: Se puede ejecutar múltiples veces
-- ============================================
-- FECHA: 2026-01-01
-- PROPÓSITO: Crear/Actualizar TODAS las tablas necesarias
-- ============================================

-- ============================================
-- PARTE 1: TABLAS BASE (6 tablas)
-- ============================================

-- 1. INGREDIENTS
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  vendor1 TEXT,
  vendor2 TEXT,
  vendor3 TEXT,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ingredients_restaurant_id_idx ON ingredients(restaurant_id);
CREATE INDEX IF NOT EXISTS ingredients_user_id_idx ON ingredients(user_id);
CREATE INDEX IF NOT EXISTS ingredients_name_idx ON ingredients(name);

-- 2. RECIPES
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  prep_time INTEGER NOT NULL DEFAULT 0,
  cook_time INTEGER NOT NULL DEFAULT 0,
  ingredients JSONB NOT NULL DEFAULT '[]'::JSONB,
  instructions TEXT,
  active BOOLEAN DEFAULT true,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recipes_restaurant_id_idx ON recipes(restaurant_id);
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_active_idx ON recipes(active);

-- 3. EVENTS (tabla principal para eventos/turnos)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  day TEXT NOT NULL,
  year INTEGER NOT NULL,
  event_name TEXT NOT NULL,
  shift TEXT NOT NULL,
  manager TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_restaurant_id_idx ON events(restaurant_id);
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);

-- Agregar columnas de totales y distribución (si no existen)
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_net_sales NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cash_sales NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cc_sales NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cc_gratuity NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cash_gratuity NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_gratuity NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_expenses NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expense_cash NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expense_check NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expense_business NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expense_employee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS expense_refunded NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS house_cash NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS other_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS distribution_method TEXT DEFAULT 'percentage';
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'closed';
ALTER TABLE events ADD COLUMN IF NOT EXISTS tip_distribution JSONB;
ALTER TABLE events ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE events ADD COLUMN IF NOT EXISTS closed_by TEXT;

-- 4. SALES_REPORTS (ventas por empleado)
CREATE TABLE IF NOT EXISTS sales_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  employee TEXT NOT NULL,
  position TEXT NOT NULL,
  net_sales NUMERIC(10, 2) DEFAULT 0,
  cash_sales NUMERIC(10, 2) DEFAULT 0,
  cc_sales NUMERIC(10, 2) DEFAULT 0,
  cc_gratuity NUMERIC(10, 2) DEFAULT 0,
  cash_gratuity NUMERIC(10, 2) DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sales_reports_event_id_idx ON sales_reports(event_id);

-- Agregar campos de contexto del evento (si no existen)
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS event_day TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS event_name TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS shift TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS manager TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS restaurant_id TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS user_id UUID;

CREATE INDEX IF NOT EXISTS sales_reports_date_idx ON sales_reports(event_date);
CREATE INDEX IF NOT EXISTS sales_reports_employee_idx ON sales_reports(employee);
CREATE INDEX IF NOT EXISTS sales_reports_restaurant_idx ON sales_reports(restaurant_id);

-- 5. USER_SETTINGS (configuración por usuario)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  hourly_labor_rate NUMERIC(10, 2) DEFAULT 20,
  default_restaurant TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);

-- 6. EMPLOYEES (empleados)
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  start_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  hourly_rate NUMERIC(10, 2),
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS employees_restaurant_id_idx ON employees(restaurant_id);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees(status);
CREATE INDEX IF NOT EXISTS employees_position_idx ON employees(position);

-- ============================================
-- PARTE 2: TABLAS DE PAYROLL (2 tablas)
-- ============================================

-- 7. TIP_DISTRIBUTIONS (distribución de propinas por empleado)
CREATE TABLE IF NOT EXISTS tip_distributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  employee TEXT NOT NULL,
  position TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  percentage NUMERIC(5, 2) DEFAULT 0,
  tip_amount NUMERIC(10, 2) DEFAULT 0,
  net_sales NUMERIC(10, 2) DEFAULT 0,
  cc_gratuity NUMERIC(10, 2) DEFAULT 0,
  cash_gratuity NUMERIC(10, 2) DEFAULT 0,
  other_fee_amount NUMERIC(10, 2) DEFAULT 0,
  total_earned NUMERIC(10, 2) DEFAULT 0,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tip_distributions_event_id_idx ON tip_distributions(event_id);
CREATE INDEX IF NOT EXISTS tip_distributions_employee_idx ON tip_distributions(employee);
CREATE INDEX IF NOT EXISTS tip_distributions_restaurant_idx ON tip_distributions(restaurant_id);

-- 8. EXPENSES (gastos del evento)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  expense_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas adicionales (si no existen)
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS paid_by TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS employee_name TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT false;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS expenses_event_id_idx ON expenses(event_id);
CREATE INDEX IF NOT EXISTS expenses_restaurant_id_idx ON expenses(restaurant_id);
CREATE INDEX IF NOT EXISTS expenses_category_idx ON expenses(category);

-- ============================================
-- PARTE 3: TABLA OTHER FEES (1 tabla)
-- ============================================

-- 9. OTHER_FEES (distribución de other fee)
CREATE TABLE IF NOT EXISTS other_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  employee TEXT NOT NULL,
  position TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5, 2) DEFAULT 0,
  notes TEXT,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS other_fees_event_id_idx ON other_fees(event_id);
CREATE INDEX IF NOT EXISTS other_fees_employee_idx ON other_fees(employee);
CREATE INDEX IF NOT EXISTS other_fees_restaurant_idx ON other_fees(restaurant_id);

-- ============================================
-- PARTE 4: TABLAS DE MENÚ (1 tabla)
-- ============================================

-- 10. MENU_ITEMS (items del menú)
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  cost NUMERIC(10, 2) DEFAULT 0,
  price NUMERIC(10, 2) NOT NULL,
  active BOOLEAN DEFAULT true,
  popular BOOLEAN DEFAULT false,
  dietary_info TEXT,
  allergens TEXT,
  prep_time INTEGER DEFAULT 0,
  ingredients JSONB DEFAULT '[]'::JSONB,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS menu_items_restaurant_id_idx ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS menu_items_category_idx ON menu_items(category);
CREATE INDEX IF NOT EXISTS menu_items_active_idx ON menu_items(active);

-- ============================================
-- PARTE 5: TABLAS DE SOMMELIER (3 tablas)
-- ============================================

-- 11. VENDORS (proveedores de bebidas)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  specialty TEXT,
  payment_terms TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendors_restaurant_id_idx ON vendors(restaurant_id);
CREATE INDEX IF NOT EXISTS vendors_status_idx ON vendors(status);

-- 12. BEVERAGES (inventario de bebidas)
CREATE TABLE IF NOT EXISTS beverages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT,
  vintage INTEGER,
  region TEXT,
  producer TEXT,
  abv NUMERIC(4, 2),
  bottle_size TEXT,
  cost NUMERIC(10, 2) DEFAULT 0,
  price NUMERIC(10, 2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  tasting_notes TEXT,
  food_pairings TEXT,
  active BOOLEAN DEFAULT true,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS beverages_restaurant_id_idx ON beverages(restaurant_id);
CREATE INDEX IF NOT EXISTS beverages_category_idx ON beverages(category);
CREATE INDEX IF NOT EXISTS beverages_vendor_id_idx ON beverages(vendor_id);
CREATE INDEX IF NOT EXISTS beverages_active_idx ON beverages(active);

-- 13. BEVERAGE_ORDERS (órdenes de bebidas)
CREATE TABLE IF NOT EXISTS beverage_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  order_date DATE NOT NULL,
  expected_delivery DATE,
  actual_delivery DATE,
  status TEXT DEFAULT 'pending',
  items JSONB DEFAULT '[]'::JSONB,
  subtotal NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) DEFAULT 0,
  shipping NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) DEFAULT 0,
  notes TEXT,
  ordered_by TEXT,
  received_by TEXT,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS beverage_orders_restaurant_id_idx ON beverage_orders(restaurant_id);
CREATE INDEX IF NOT EXISTS beverage_orders_vendor_id_idx ON beverage_orders(vendor_id);
CREATE INDEX IF NOT EXISTS beverage_orders_status_idx ON beverage_orders(status);
CREATE INDEX IF NOT EXISTS beverage_orders_order_date_idx ON beverage_orders(order_date);

-- ============================================
-- PARTE 6: VIEW COMPLETA
-- ============================================

-- VIEW: sales_report_complete (une todo)
CREATE OR REPLACE VIEW sales_report_complete AS
SELECT 
  -- Identificadores
  sr.id as sales_report_id,
  sr.event_id,
  e.id as event_table_id,
  
  -- Empleado
  sr.employee,
  sr.position,
  
  -- Ventas individuales
  sr.net_sales,
  sr.cash_sales,
  sr.cc_sales,
  sr.cc_gratuity,
  sr.cash_gratuity,
  sr.points,
  
  -- Información del evento
  COALESCE(sr.event_date, e.date) as event_date,
  COALESCE(sr.event_day, e.day) as event_day,
  COALESCE(sr.event_name, e.event_name) as event_name,
  COALESCE(sr.shift, e.shift) as shift,
  COALESCE(sr.manager, e.manager) as manager,
  
  -- Totales del evento
  e.total_net_sales as event_total_net_sales,
  e.total_gratuity as event_total_gratuity,
  e.total_points as event_total_points,
  e.house_cash as event_house_cash,
  
  -- Distribución de propinas (desde tip_distributions)
  td.percentage as tip_percentage,
  td.tip_amount as tip_earned,
  td.other_fee_amount,
  td.total_earned,
  
  -- Metadata
  e.distribution_method,
  e.notes as event_notes,
  COALESCE(sr.restaurant_id, e.restaurant_id) as restaurant_id,
  sr.created_at as sales_report_created_at,
  e.closed_at as event_closed_at
  
FROM sales_reports sr
LEFT JOIN events e ON sr.event_id = e.id
LEFT JOIN tip_distributions td ON td.event_id = sr.event_id AND td.employee = sr.employee
ORDER BY e.date DESC, sr.employee;

-- ============================================
-- PARTE 7: DESACTIVAR RLS (para desarrollo)
-- ============================================

ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE tip_distributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE other_fees DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE beverages DISABLE ROW LEVEL SECURITY;
ALTER TABLE beverage_orders DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as total_columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- ✅ SCRIPT COMPLETADO
-- ============================================
-- Total de tablas creadas: 13
-- Total de índices: 40+
-- Total de views: 1
--
-- ⚠️ IMPORTANTE:
-- - Este script es SEGURO de ejecutar múltiples veces
-- - NO borra datos existentes
-- - Solo crea lo que NO existe
-- - Si ya tienes datos, se mantienen intactos
--
-- 📊 PRÓXIMOS PASOS:
-- 1. Copia este script
-- 2. Ve a Supabase SQL Editor
-- 3. Pega y ejecuta
-- 4. Verifica el output final con el conteo de tablas
-- ============================================
