# 🧪 TEST DE SEGURIDAD DE DATOS - GUÍA PASO A PASO

## Objetivo
Verificar que `supabase_schema_SAFE.sql` NO borra datos existentes cuando se ejecuta.

---

## 📋 PROCEDIMIENTO DE TEST

### ✅ PASO 1: Agregar Empleado de Prueba

1. Ve a [Supabase SQL Editor](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/sql/new)

2. Copia y pega este código:
```sql
INSERT INTO employees (
  name, email, phone, position, start_date, status, 
  hourly_rate, restaurant_id, user_id
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

SELECT * FROM employees WHERE name LIKE '%TEST EMPLEADO%';
```

3. Click **"Run"**

4. ✅ **Verifica:** Debes ver el empleado "🧪 TEST EMPLEADO" en los resultados

---

### 📊 PASO 2: Contar Registros ANTES

1. En la misma ventana SQL, ejecuta:
```sql
SELECT 
  'ANTES' as momento,
  (SELECT COUNT(*) FROM employees) as employees,
  (SELECT COUNT(*) FROM ingredients) as ingredients,
  (SELECT COUNT(*) FROM recipes) as recipes;
```

2. **ANOTA estos números:**
   - Employees: ______
   - Ingredients: ______
   - Recipes: ______

---

### 🔧 PASO 3: Ejecutar Script SAFE

1. Abre el archivo [`supabase_schema_SAFE.sql`](supabase_schema_SAFE.sql)

2. Copia **TODO** el contenido (Ctrl+A, Ctrl+C)

3. Ve a [Nueva pestaña SQL Editor](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/sql/new)

4. Pega el código

5. 🫣 **Respira profundo**

6. Click **"Run"**

7. Espera a que termine (debería decir "Success")

---

### 📊 PASO 4: Contar Registros DESPUÉS

1. Ejecuta el mismo conteo:
```sql
SELECT 
  'DESPUÉS' as momento,
  (SELECT COUNT(*) FROM employees) as employees,
  (SELECT COUNT(*) FROM ingredients) as ingredients,
  (SELECT COUNT(*) FROM recipes) as recipes;
```

2. **Compara con los números del PASO 2:**
   - ¿Son IGUALES? ✅ **ÉXITO - El script es seguro**
   - ¿Son DIFERENTES? ❌ **ERROR - Hay un problema**

3. Verifica que el empleado de prueba sigue ahí:
```sql
SELECT * FROM employees WHERE name LIKE '%TEST EMPLEADO%';
```

4. ✅ **Debe aparecer el empleado con 🧪**

---

### 🧹 PASO 5: Limpiar Test

Si todo salió bien, borra el registro de prueba:

```sql
DELETE FROM employees WHERE name LIKE '%TEST EMPLEADO%';

-- Verifica que se borró (debe mostrar 0)
SELECT COUNT(*) FROM employees WHERE name LIKE '%TEST EMPLEADO%';
```

---

## ✅ RESULTADO ESPERADO

### Si el test fue EXITOSO:
- ✅ Los conteos ANTES y DESPUÉS son **IGUALES**
- ✅ El empleado TEST apareció en el PASO 4
- ✅ El script `supabase_schema_SAFE.sql` es **SEGURO** de usar
- ✅ Puedes ejecutarlo cuantas veces quieras sin miedo

### Si el test FALLÓ:
- ❌ Los números cambiaron
- ❌ El empleado TEST desapareció
- ❌ NO uses ese script
- ❌ Contacta soporte o revisa el código

---

## 🔄 TEST DEL SCRIPT PELIGROSO (Opcional)

**⚠️ SOLO hazlo si quieres ver la diferencia entre SAFE y CLEAN**

### Para probar `supabase_schema_clean.sql`:

1. Haz BACKUP primero: ejecuta `supabase_BACKUP.sql` y GUARDA los resultados

2. Agrega un empleado de prueba (PASO 1 de arriba)

3. Cuenta registros (PASO 2)

4. Ejecuta `supabase_schema_clean.sql`

5. Cuenta registros de nuevo

6. **Resultado esperado:** 
   - ❌ Todos los conteos = 0
   - ❌ El empleado TEST desapareció
   - 💀 Todas las tablas están vacías

**Esto demuestra la diferencia entre SAFE y CLEAN**

---

## 📚 RESUMEN

| Script | Comando | Borra Datos | Seguro |
|--------|---------|-------------|--------|
| `supabase_schema_SAFE.sql` | `CREATE TABLE IF NOT EXISTS` | ❌ NO | ✅ SÍ |
| `supabase_schema_clean.sql` | `DROP TABLE` | ✅ SÍ | ❌ NO |

**Regla de oro:** Si tienes datos importantes, usa siempre **SAFE**.

---

## 🆘 ¿Necesitas ayuda?

Si algo salió mal durante el test:
1. Ve a [Database → Backups](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/database/backups)
2. Restaura el backup más reciente
3. Los datos volverán al estado anterior
