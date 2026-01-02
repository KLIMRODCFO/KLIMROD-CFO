-- ============================================
-- AGREGAR CAMPOS DE TOTALES A TABLA EVENTS
-- ============================================
-- Ejecuta esto para agregar columnas de resumen/totales
-- ============================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS total_net_sales NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cash_sales NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cc_sales NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cc_gratuity NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_cash_gratuity NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_gratuity NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS total_expenses NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS house_cash NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS other_fee NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS distribution_method TEXT DEFAULT 'percentage';
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'closed';

-- Verificar columnas agregadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;
