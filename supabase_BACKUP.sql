-- ============================================
-- KLIMROD CFO - SCRIPT DE BACKUP
-- ============================================
-- ⚠️ EJECUTA ESTE SCRIPT ANTES DE HACER CAMBIOS GRANDES
-- ⚠️ Guarda una copia de todos tus datos
-- ============================================

-- Instrucciones:
-- 1. Copia este script completo
-- 2. Pégalo en Supabase SQL Editor
-- 3. Ejecuta y GUARDA los resultados antes de hacer cambios

-- ============================================
-- BACKUP: INGREDIENTS
-- ============================================
SELECT 'INGREDIENTS BACKUP' as table_name, NOW() as backup_date;
SELECT * FROM ingredients ORDER BY created_at;

-- ============================================
-- BACKUP: RECIPES
-- ============================================
SELECT 'RECIPES BACKUP' as table_name, NOW() as backup_date;
SELECT * FROM recipes ORDER BY created_at;

-- ============================================
-- BACKUP: EMPLOYEES
-- ============================================
SELECT 'EMPLOYEES BACKUP' as table_name, NOW() as backup_date;
SELECT * FROM employees ORDER BY created_at;

-- ============================================
-- BACKUP: EVENTS
-- ============================================
SELECT 'EVENTS BACKUP' as table_name, NOW() as backup_date;
SELECT * FROM events ORDER BY date;

-- ============================================
-- BACKUP: SALES_REPORTS
-- ============================================
SELECT 'SALES_REPORTS BACKUP' as table_name, NOW() as backup_date;
SELECT * FROM sales_reports ORDER BY created_at;

-- ============================================
-- BACKUP: USER_SETTINGS
-- ============================================
SELECT 'USER_SETTINGS BACKUP' as table_name, NOW() as backup_date;
SELECT * FROM user_settings;

-- ============================================
-- CONTEO TOTAL
-- ============================================
SELECT 
  'TOTAL RECORDS' as summary,
  (SELECT COUNT(*) FROM ingredients) as ingredients_count,
  (SELECT COUNT(*) FROM recipes) as recipes_count,
  (SELECT COUNT(*) FROM employees) as employees_count,
  (SELECT COUNT(*) FROM events) as events_count,
  (SELECT COUNT(*) FROM sales_reports) as sales_reports_count,
  (SELECT COUNT(*) FROM user_settings) as settings_count;
