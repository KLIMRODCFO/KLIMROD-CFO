-- ============================================
-- EVENTS COMPLETO - TODOS LOS CAMPOS PARA PAYROLL
-- ============================================
-- Este script agrega TODOS los campos necesarios
-- ============================================

-- PASO 1: Agregar columnas de totales y distribución a EVENTS
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

-- CAMPO CRÍTICO: Distribución completa como JSON
ALTER TABLE events ADD COLUMN IF NOT EXISTS tip_distribution JSONB;

-- Metadata del evento
ALTER TABLE events ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE events ADD COLUMN IF NOT EXISTS closed_by TEXT;

-- PASO 2: Crear tabla TIP_DISTRIBUTIONS (detalle por empleado)
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

ALTER TABLE tip_distributions DISABLE ROW LEVEL SECURITY;

-- PASO 3: Verificación
SELECT 
  'EVENTS' as tabla,
  COUNT(*) as total_columnas
FROM information_schema.columns 
WHERE table_name = 'events'
UNION ALL
SELECT 'TIP_DISTRIBUTIONS', COUNT(*) FROM information_schema.columns WHERE table_name = 'tip_distributions'
UNION ALL
SELECT 'SALES_REPORTS', COUNT(*) FROM information_schema.columns WHERE table_name = 'sales_reports'
UNION ALL
SELECT 'EXPENSES', COUNT(*) FROM information_schema.columns WHERE table_name = 'expenses'
UNION ALL
SELECT 'EMPLOYEES', COUNT(*) FROM information_schema.columns WHERE table_name = 'employees';

-- ============================================
-- ESTRUCTURA FINAL PARA PAYROLL:
-- ============================================
-- - SALES REPORT COMPLETO:
-- ============================================
-- 
-- EVENTS (tabla principal) ⭐ LA MÁS IMPORTANTE
--   ├── Info del evento: fecha, día, shift, manager
--   ├── Totales de ventas: net sales, cc sales, cash sales
--   ├── Totales de gratuities: cc gratuity, cash gratuity
--   ├── Totales de expenses: total, cash, check, business, employee
--   ├── House cash calculado automáticamente
--   ├── Other fee
--   ├── tip_distribution (JSONB) → Distribución COMPLETA
--   └── Metadata: notes, distribution method, closed_at, closed_by
--
-- TIP_DISTRIBUTIONS (detalle por empleado)
--   ├── Cuánto recibe CADA empleado en propinas
--   ├── Percentage y points usados
--   ├── Ventas individuales (net sales, cc gratuity, cash gratuity)
--   ├── Other fee por persona
--   └── Total earned = tips + other fee
--
-- SALES_REPORTS (ventas individuales)
--   └── Ventas y gratuities por empleado (raw data)
--
-- EXPENSES (gastos del evento)
--   └── Todos los expenses con categorización
--
-- OTHER_FEES (distribución de other fee)
--   └── Empleados que reciben other fee
-- 
-- ============================================
-- Con esta estructura puedes:
-- ✅ Ver resumen completo del evento (EVENTS)
-- ✅ Ver cuánto ganó cada empleado (TIP_DISTRIBUTIONS)
-- ✅ Calcular payroll
-- ✅ Generar reportes financieros
-- ✅ Auditar ventas y gastos