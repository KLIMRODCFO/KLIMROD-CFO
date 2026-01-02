-- ============================================
-- SALES REPORTS - TABLAS ADICIONALES
-- ============================================
-- Ejecuta esto en Supabase para agregar tablas de expenses y other_fees
-- ============================================

-- ============================================
-- TABLA: EXPENSES (Gastos del evento)
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  expense_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT, -- CHECK, CASH
  paid_by TEXT, -- BUSINESS, EMPLOYEE
  employee_name TEXT,
  refunded BOOLEAN DEFAULT false,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS expenses_event_id_idx ON expenses(event_id);
CREATE INDEX IF NOT EXISTS expenses_restaurant_id_idx ON expenses(restaurant_id);

-- ============================================
-- TABLA: OTHER_FEES (Otras propinas/fees)
-- ============================================
CREATE TABLE IF NOT EXISTS other_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  employee TEXT NOT NULL,
  position TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS other_fees_event_id_idx ON other_fees(event_id);
CREATE INDEX IF NOT EXISTS other_fees_restaurant_id_idx ON other_fees(restaurant_id);

-- ============================================
-- DESACTIVAR RLS (para pruebas)
-- ============================================
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE other_fees DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ejecuta esto para verificar que se crearon:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('expenses', 'other_fees');
