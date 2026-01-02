-- ============================================
-- KLIMROD CFO - DATABASE SCHEMA
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. TABLA: INGREDIENTS (Directorio maestro)
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX ingredients_restaurant_id_idx ON ingredients(restaurant_id);
CREATE INDEX ingredients_user_id_idx ON ingredients(user_id);
CREATE INDEX ingredients_name_idx ON ingredients(name);


-- 2. TABLA: RECIPES (Recetas con cálculos)
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX recipes_restaurant_id_idx ON recipes(restaurant_id);
CREATE INDEX recipes_user_id_idx ON recipes(user_id);
CREATE INDEX recipes_active_idx ON recipes(active);


-- 3. TABLA: EVENTS (Eventos/turnos)
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX events_restaurant_id_idx ON events(restaurant_id);
CREATE INDEX events_user_id_idx ON events(user_id);
CREATE INDEX events_date_idx ON events(date);


-- 4. TABLA: SALES_REPORTS (Ventas por empleado)
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


-- 5. TABLA: USER_SETTINGS (Configuración por usuario)
-- ============================================
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  hourly_labor_rate NUMERIC(10, 2) DEFAULT 20,
  default_restaurant TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX user_settings_user_id_idx ON user_settings(user_id);


-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- INGREDIENTS: Solo ver/editar los propios
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ingredients"
  ON ingredients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ingredients"
  ON ingredients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ingredients"
  ON ingredients FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ingredients"
  ON ingredients FOR DELETE
  USING (auth.uid() = user_id);


-- RECIPES: Solo ver/editar las propias
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipes"
  ON recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);


-- EVENTS: Solo ver/editar los propios
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);


-- SALES_REPORTS: Ver si eres dueño del evento
ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sales reports for own events"
  ON sales_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sales_reports.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert sales reports for own events"
  ON sales_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update sales reports for own events"
  ON sales_reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sales_reports.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete sales reports for own events"
  ON sales_reports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sales_reports.event_id
      AND events.user_id = auth.uid()
    )
  );


-- USER_SETTINGS: Solo ver/editar los propios
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
