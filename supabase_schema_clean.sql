-- ============================================
-- KLIMROD CFO - SCHEMA COMPLETO Y LIMPIO
-- ============================================
-- ⚠️⚠️⚠️ PELIGRO: ESTE SCRIPT BORRA TODOS LOS DATOS ⚠️⚠️⚠️
-- 
-- SOLO USA ESTE SCRIPT PARA:
-- - Primera instalación (base de datos vacía)
-- - Empezar completamente de cero
-- 
-- ANTES DE EJECUTAR:
-- 1. Ejecuta supabase_BACKUP.sql y guarda los resultados
-- 2. Confirma que quieres BORRAR TODOS LOS DATOS
-- 3. Si tienes dudas, usa supabase_schema_SAFE.sql en su lugar
-- 
-- ============================================

-- ============================================
-- PASO 1: BORRAR POLÍTICAS RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own ingredients" ON ingredients;
DROP POLICY IF EXISTS "Users can insert own ingredients" ON ingredients;
DROP POLICY IF EXISTS "Users can update own ingredients" ON ingredients;
DROP POLICY IF EXISTS "Users can delete own ingredients" ON ingredients;

DROP POLICY IF EXISTS "Users can view own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can insert own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete own recipes" ON recipes;

DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can insert own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

DROP POLICY IF EXISTS "Users can view sales reports for own events" ON sales_reports;
DROP POLICY IF EXISTS "Users can insert sales reports for own events" ON sales_reports;
DROP POLICY IF EXISTS "Users can update sales reports for own events" ON sales_reports;
DROP POLICY IF EXISTS "Users can delete sales reports for own events" ON sales_reports;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

-- ============================================
-- PASO 2: BORRAR TODAS LAS TABLAS
-- ============================================
DROP TABLE IF EXISTS sales_reports CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- ============================================
-- PASO 3: CREAR TABLA INGREDIENTS
-- ============================================
CREATE TABLE ingredients (
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

CREATE INDEX ingredients_restaurant_id_idx ON ingredients(restaurant_id);
CREATE INDEX ingredients_user_id_idx ON ingredients(user_id);
CREATE INDEX ingredients_name_idx ON ingredients(name);

-- ============================================
-- PASO 4: CREAR TABLA RECIPES
-- ============================================
CREATE TABLE recipes (
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

CREATE INDEX recipes_restaurant_id_idx ON recipes(restaurant_id);
CREATE INDEX recipes_user_id_idx ON recipes(user_id);
CREATE INDEX recipes_active_idx ON recipes(active);

-- ============================================
-- PASO 5: CREAR TABLA EVENTS
-- ============================================
CREATE TABLE events (
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

CREATE INDEX events_restaurant_id_idx ON events(restaurant_id);
CREATE INDEX events_user_id_idx ON events(user_id);
CREATE INDEX events_date_idx ON events(date);

-- ============================================
-- PASO 6: CREAR TABLA SALES_REPORTS
-- ============================================
CREATE TABLE sales_reports (
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

CREATE INDEX sales_reports_event_id_idx ON sales_reports(event_id);

-- ============================================
-- PASO 7: CREAR TABLA USER_SETTINGS
-- ============================================
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  hourly_labor_rate NUMERIC(10, 2) DEFAULT 20,
  default_restaurant TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX user_settings_user_id_idx ON user_settings(user_id);

-- ============================================
-- PASO 8: CREAR TABLA EMPLOYEES
-- ============================================
CREATE TABLE employees (
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

CREATE INDEX employees_restaurant_id_idx ON employees(restaurant_id);
CREATE INDEX employees_status_idx ON employees(status);
CREATE INDEX employees_position_idx ON employees(position);

-- ============================================
-- PASO 9: CONFIGURAR RLS (Deshabilitado para pruebas)
-- ============================================
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Políticas para INGREDIENTS
CREATE POLICY "Users can view own ingredients" ON ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ingredients" ON ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ingredients" ON ingredients FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ingredients" ON ingredients FOR DELETE USING (auth.uid() = user_id);

-- Políticas para RECIPES
CREATE POLICY "Users can view own recipes" ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid() = user_id);

-- Políticas para EVENTS
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Políticas para SALES_REPORTS
CREATE POLICY "Users can view sales reports for own events" ON sales_reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = sales_reports.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can insert sales reports for own events" ON sales_reports FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can update sales reports for own events" ON sales_reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = sales_reports.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete sales reports for own events" ON sales_reports FOR DELETE
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = sales_reports.event_id AND events.user_id = auth.uid()));

-- Políticas para USER_SETTINGS
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Políticas para EMPLOYEES
CREATE POLICY "Users can view own employees" ON employees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own employees" ON employees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own employees" ON employees FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own employees" ON employees FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PASO 10: DESACTIVAR RLS TEMPORALMENTE
-- ============================================
ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================
-- Ejecuta esto después para verificar que todas las tablas existen:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
