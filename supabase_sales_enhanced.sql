-- ============================================
-- MEJORAR SALES_REPORTS - Agregar contexto del evento
-- ============================================
-- Esto agrega campos del evento directamente a sales_reports
-- Para saber CUÁNDO trabajó cada empleado sin hacer JOIN
-- ============================================

-- Agregar campos de contexto del evento
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS event_day TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS event_name TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS shift TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS manager TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS restaurant_id TEXT;
ALTER TABLE sales_reports ADD COLUMN IF NOT EXISTS user_id UUID;

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS sales_reports_date_idx ON sales_reports(event_date);
CREATE INDEX IF NOT EXISTS sales_reports_employee_idx ON sales_reports(employee);
CREATE INDEX IF NOT EXISTS sales_reports_restaurant_idx ON sales_reports(restaurant_id);

-- ============================================
-- CREAR VIEW: sales_report_complete
-- ============================================
-- Esta VIEW une automáticamente sales_reports + events + tip_distributions
-- Para ver TODO de un empleado en un vistazo
-- ============================================

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
-- VERIFICACIÓN
-- ============================================
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'sales_reports' 
ORDER BY ordinal_position;

-- ============================================
-- EJEMPLO DE USO:
-- ============================================
-- 
-- Ver cuándo trabajó un empleado:
-- SELECT * FROM sales_report_complete WHERE employee = 'JOHN DOE';
--
-- Ver todos los empleados de un día:
-- SELECT * FROM sales_report_complete WHERE event_date = '2026-01-01';
--
-- Ver cuánto ganó cada empleado en un evento:
-- SELECT employee, net_sales, tip_earned, other_fee_amount, total_earned
-- FROM sales_report_complete WHERE event_name = 'EVENT 1';
--
-- ============================================
