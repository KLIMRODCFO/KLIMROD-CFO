# 🗄️ Supabase Database Scripts

## 📁 Archivos y Uso

### ✅ `supabase_schema_SAFE.sql` - **USA ESTE NORMALMENTE**
**Cuándo usarlo:**
- Actualizaciones de schema
- Agregar nuevas columnas o índices
- Ejecutar múltiples veces sin peligro
- Cuando tienes datos que NO quieres perder

**Qué hace:**
- ✅ Crea tablas solo si NO existen (`CREATE TABLE IF NOT EXISTS`)
- ✅ Crea índices solo si NO existen
- ✅ NO borra ningún dato existente
- ✅ Seguro de ejecutar repetidamente

**Cómo ejecutar:**
1. Ve a [Supabase SQL Editor](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/sql/new)
2. Copia y pega `supabase_schema_SAFE.sql`
3. Click "Run"
4. ✅ Listo - tus datos están seguros

---

### ⚠️ `supabase_BACKUP.sql` - **EJECUTA ANTES DE CAMBIOS GRANDES**
**Cuándo usarlo:**
- ANTES de ejecutar `supabase_schema_clean.sql`
- Antes de hacer cambios estructurales grandes
- Una vez por semana como backup rutinario
- Antes de modificar columnas o eliminar tablas

**Qué hace:**
- 📊 Lee TODOS los datos de TODAS las tablas
- 📋 Muestra conteo de registros
- 💾 Te da una copia visual de tus datos

**Cómo ejecutar:**
1. Ve a [Supabase SQL Editor](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/sql/new)
2. Copia y pega `supabase_BACKUP.sql`
3. Click "Run"
4. **GUARDA los resultados** (copia todo el output a un archivo .txt)
5. Ahora puedes hacer cambios con tranquilidad

---

### 🔴 `supabase_schema_clean.sql` - **PELIGRO: BORRA TODO**
**⚠️ SOLO usarlo para:**
- Primera instalación (base de datos completamente vacía)
- Empezar de cero INTENCIONALMENTE
- Resetear todo el proyecto

**🚨 NUNCA usarlo si:**
- Tienes datos en producción
- Tienes clientes usando el sistema
- No estás 100% seguro

**Qué hace:**
- 💣 `DROP TABLE` = BORRA todas las tablas
- ❌ Elimina TODOS los datos permanentemente
- 🗑️ No hay "deshacer"

**Cómo ejecutar (solo si estás SEGURO):**
1. ✅ Primero ejecuta `supabase_BACKUP.sql` y GUARDA los resultados
2. ✅ Confirma que quieres BORRAR TODO
3. Ve a [Supabase SQL Editor](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/sql/new)
4. Copia y pega `supabase_schema_clean.sql`
5. Respira profundo
6. Click "Run"
7. 💀 Todos los datos se han borrado

---

## 🔄 Workflow Recomendado

### Para actualizaciones normales:
```
1. Ejecuta: supabase_schema_SAFE.sql
2. ✅ Listo
```

### Para cambios grandes:
```
1. Ejecuta: supabase_BACKUP.sql → GUARDA resultados
2. Ejecuta: supabase_schema_SAFE.sql o los cambios que necesites
3. Verifica que todo funciona
4. ✅ Listo
```

### Para empezar de cero (SOLO en desarrollo):
```
1. Ejecuta: supabase_BACKUP.sql → GUARDA resultados
2. Confirma que quieres BORRAR TODO
3. Ejecuta: supabase_schema_clean.sql
4. Vuelve a cargar datos manualmente o desde la app
```

---

## 🛡️ Protección de Datos

### ✅ Para prevenir pérdida de datos:

1. **Backups automáticos de Supabase:**
   - Plan Free: Backups diarios por 7 días
   - Recupera en: [Database → Backups](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/database/backups)

2. **Backups manuales frecuentes:**
   - Ejecuta `supabase_BACKUP.sql` semanalmente
   - Guarda el output en: `backups/backup_YYYY-MM-DD.txt`

3. **Git commits regulares:**
   - Commit tus cambios de código frecuentemente
   - Incluye notas sobre cambios de schema

4. **Testing en desarrollo:**
   - Usa una segunda base de datos para pruebas
   - NO pruebes en producción

---

## 📞 Contacto de Emergencia

**Si perdiste datos accidentalmente:**
1. NO ejecutes más scripts SQL
2. Ve a [Database → Backups](https://supabase.com/dashboard/project/jpwdqdxpoxhiivskmikb/database/backups)
3. Restaura el backup más reciente
4. Si no hay backups, revisa el código - puede tener datos hardcoded (como TUCCI Brigade)

---

## 🎯 Regla de Oro

**🔴 Si el script tiene `DROP TABLE` → PELIGRO**
**✅ Si el script tiene `CREATE TABLE IF NOT EXISTS` → SEGURO**

**Cuando tengas duda, usa siempre `supabase_schema_SAFE.sql`**
