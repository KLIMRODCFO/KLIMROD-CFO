-- ============================================
-- KLIMROD CFO - SCHEMA SEGURO (NO BORRA DATOS)
-- ============================================
-- ⚠️ USA ESTE SCRIPT PARA ACTUALIZACIONES
-- ⚠️ NO BORRA TABLAS NI DATOS EXISTENTES
-- ============================================

-- ============================================
-- CREAR TABLA INGREDIENTS (Si no existe)
-- ============================================
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

-- Índices (solo se crean si no existen)
CREATE INDEX IF NOT EXISTS ingredients_restaurant_id_idx ON ingredients(restaurant_id);
CREATE INDEX IF NOT EXISTS ingredients_user_id_idx ON ingredients(user_id);
CREATE INDEX IF NOT EXISTS ingredients_name_idx ON ingredients(name);

-- ============================================
-- CREAR TABLA RECIPES (Si no existe)
-- ============================================
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

-- ============================================
-- CREAR TABLA EVENTS (Si no existe)
-- ============================================
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

-- ============================================
-- CREAR TABLA SALES_REPORTS (Si no existe)
-- ============================================
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

-- ============================================
-- CREAR TABLA USER_SETTINGS (Si no existe)
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  hourly_labor_rate NUMERIC(10, 2) DEFAULT 20,
  default_restaurant TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);

-- ============================================
-- CREAR TABLA EMPLOYEES (Si no existe)
-- ============================================
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
-- DESACTIVAR RLS (para pruebas)
-- ============================================
ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ✅ SCRIPT COMPLETADO
-- ============================================
-- Este script es SEGURO de ejecutar múltiples veces
-- NO borrará datos existentes
