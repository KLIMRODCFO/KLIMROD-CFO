-- ============================================
-- TEST DE SEGURIDAD DE DATOS
-- ============================================
-- Este test verifica que supabase_schema_SAFE.sql NO borra datos
-- ============================================

-- ============================================
-- PASO 1: AGREGAR DATO DE PRUEBA
-- ============================================
-- Ejecuta esto primero para crear un registro de prueba

INSERT INTO employees (
  name,
  email,
  phone,
  position,
  start_date,
  status,
  hourly_rate,
  restaurant_id,
  user_id
) VALUES (
  '🧪 TEST EMPLEADO - NO BORRAR',
  'test@klimrod.com',
  '555-TEST',
  'Test Position',
  CURRENT_DATE,
  'active',
  99.99,
  'default',
  '00000000-0000-0000-0000-000000000000'
);

-- Verifica que se creó
SELECT * FROM employees WHERE name LIKE '%TEST EMPLEADO%';

-- ============================================
-- PASO 2: CONTAR REGISTROS ANTES
-- ============================================
-- Guarda estos números ANTES de ejecutar el script SAFE

SELECT 
  'ANTES DE EJECUTAR SCRIPT SAFE' as momento,
  (SELECT COUNT(*) FROM employees) as total_employees,
  (SELECT COUNT(*) FROM ingredients) as total_ingredients,
  (SELECT COUNT(*) FROM recipes) as total_recipes;

-- ============================================
-- PASO 3: AHORA EJECUTA supabase_schema_SAFE.sql
-- ============================================
-- Ve al archivo supabase_schema_SAFE.sql
-- Copia TODO el contenido
-- Pégalo en una nueva pestaña del SQL Editor
-- Click "Run"

-- ============================================
-- PASO 4: CONTAR REGISTROS DESPUÉS
-- ============================================
-- Ejecuta esto DESPUÉS de correr supabase_schema_SAFE.sql

SELECT 
  'DESPUÉS DE EJECUTAR SCRIPT SAFE' as momento,
  (SELECT COUNT(*) FROM employees) as total_employees,
  (SELECT COUNT(*) FROM ingredients) as total_ingredients,
  (SELECT COUNT(*) FROM recipes) as total_recipes;

-- Verifica que el empleado de prueba sigue ahí
SELECT * FROM employees WHERE name LIKE '%TEST EMPLEADO%';

-- ============================================
-- PASO 5: LIMPIAR TEST
-- ============================================
-- Si todo salió bien, borra el registro de prueba

DELETE FROM employees WHERE name LIKE '%TEST EMPLEADO%';

-- Verifica que se borró
SELECT COUNT(*) as test_empleado_borrado FROM employees WHERE name LIKE '%TEST EMPLEADO%';
-- Debe mostrar: 0

-- ============================================
-- ✅ RESULTADO ESPERADO:
-- ============================================
-- - Los conteos ANTES y DESPUÉS deben ser IGUALES
-- - El empleado TEST debe aparecer en el PASO 4
-- - Si esto funciona, supabase_schema_SAFE.sql es SEGURO
-- ============================================
