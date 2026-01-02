# Guía de Configuración Supabase

Esta guía te ayudará a configurar tu base de datos en Supabase para la aplicación KlimRod CFO.

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Sign up/Login con tu cuenta
3. Crea un nuevo proyecto:
   - Nombre: `klimrod-cfo`
   - Database Password: Guarda en lugar seguro
   - Región: Elige la más cercana a ti
   - Espera a que se complete la creación (~2 minutos)

## 2. Obtener Credenciales

Una vez creado el proyecto:
1. Ve a **Settings** → **API**
2. Copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Pega en tu archivo `.env.local`

## 3. Crear Tablas

### Tabla: `events`

```sql
create table events (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  day text not null check (day in ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
  year integer not null,
  event_name text not null,
  shift text not null check (shift in ('LUNCH', 'BRUNCH', 'DINNER', 'NIGHT')),
  manager text not null,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- Índices
create index events_user_id_idx on events(user_id);
create index events_date_idx on events(date);
```

### Tabla: `sales_reports`

```sql
create table sales_reports (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid not null references events(id) on delete cascade,
  employee text not null,
  position text not null,
  net_sales numeric(10, 2) default 0,
  cash_sales numeric(10, 2) default 0,
  cc_sales numeric(10, 2) default 0,
  cc_gratuity numeric(10, 2) default 0,
  cash_gratuity numeric(10, 2) default 0,
  points integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Índices
create index sales_reports_event_id_idx on sales_reports(event_id);
```

## 4. Configurar Row Level Security (RLS)

### Para tabla `events`:

```sql
-- Habilitar RLS
alter table events enable row level security;

-- Policy: Los usuarios pueden ver solo sus propios eventos
create policy "Users can view own events"
  on events
  for select
  using (auth.uid() = user_id);

-- Policy: Los usuarios pueden insertar sus propios eventos
create policy "Users can insert own events"
  on events
  for insert
  with check (auth.uid() = user_id);

-- Policy: Los usuarios pueden actualizar sus propios eventos
create policy "Users can update own events"
  on events
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: Los usuarios pueden eliminar sus propios eventos
create policy "Users can delete own events"
  on events
  for delete
  using (auth.uid() = user_id);
```

### Para tabla `sales_reports`:

```sql
-- Habilitar RLS
alter table sales_reports enable row level security;

-- Policy: Acceso a través de eventos del usuario
create policy "Users can view sales of their events"
  on sales_reports
  for select
  using (event_id in (select id from events where user_id = auth.uid()));

create policy "Users can insert sales to their events"
  on sales_reports
  for insert
  with check (event_id in (select id from events where user_id = auth.uid()));

create policy "Users can update sales of their events"
  on sales_reports
  for update
  using (event_id in (select id from events where user_id = auth.uid()))
  with check (event_id in (select id from events where user_id = auth.uid()));

create policy "Users can delete sales of their events"
  on sales_reports
  for delete
  using (event_id in (select id from events where user_id = auth.uid()));
```

## 5. Ejecutar SQL en Supabase

1. En Supabase Dashboard, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el SQL de las tablas arriba
4. Haz clic en **Run** ✓
5. Repite para el SQL de RLS

## 6. Actualizar tu Aplicación

Una vez configurado Supabase, necesitarás actualizar:

### `app/lib/events.ts` (nuevo archivo)

```typescript
import { supabase } from './supabase'
import { Event } from './types'

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data as Event[]
}

export async function createEvent(event: Omit<Event, 'id'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()

  if (error) throw error
  return data[0] as Event
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0] as Event
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

### `app/lib/sales.ts` (nuevo archivo)

```typescript
import { supabase } from './supabase'
import { SalesRow } from './types'

export async function fetchSales(eventId: string) {
  const { data, error } = await supabase
    .from('sales_reports')
    .select('*')
    .eq('event_id', eventId)

  if (error) throw error
  return data as SalesRow[]
}

export async function createSales(eventId: string, sales: SalesRow[]) {
  const payload = sales.map((s) => ({
    ...s,
    event_id: eventId,
  }))

  const { error } = await supabase
    .from('sales_reports')
    .insert(payload)

  if (error) throw error
}

export async function updateSales(id: string, sales: Partial<SalesRow>) {
  const { error } = await supabase
    .from('sales_reports')
    .update(sales)
    .eq('id', id)

  if (error) throw error
}

export async function deleteSales(id: string) {
  const { error } = await supabase
    .from('sales_reports')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

## 7. Próximos Pasos

- [ ] Configurar autenticación (Email/Password o Google)
- [ ] Actualizar componentes para usar funciones de Supabase
- [ ] Implementar hooks personalizados (useEvents, useSales)
- [ ] Agregar manejo de errores y loading states

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
