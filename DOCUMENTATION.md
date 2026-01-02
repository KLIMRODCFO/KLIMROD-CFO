# KlimRod CFO - Documentación Técnica

## 📊 Resumen del Proyecto

Sistema completo de gestión de reportes de ventas para eventos, con capacidad de exportación a Excel y distribución de propinas entre empleados.

**Stack Tecnológico:**
- Frontend: Next.js 16 + React 19 + TypeScript
- Estilos: Tailwind CSS
- Base de datos: Supabase (PostgreSQL)
- Exportación: XLSX (Excel)
- Deploy: Vercel + GitHub
- Pagos: Stripe (futuro)
- IA: OpenAI (futuro)

---

## 🎯 Funcionalidades Principales

### 1. Gestión de Eventos ✅
- Crear eventos con: fecha, día, año, nombre, turno, manager
- Editar información del evento
- Eliminar eventos
- Listar todos los eventos
- Filtrar y buscar eventos

### 2. Reportes de Ventas ✅
- Registrar ventas por empleado:
  - Nombre y posición
  - Ventas netas
  - Ventas en efectivo
  - Ventas con tarjeta
  - Propinas (efectivo y tarjeta)
  - Puntos
- Tabla editable en tiempo real
- Cálculo automático de totales
- Agregar/eliminar filas dinámicamente

### 3. Distribución de Propinas ✅
- Dos métodos:
  - **Por Porcentaje**: Distribuir según % de ventas de cada empleado
  - **Partes Iguales**: Distribuir equitativamente
- Vista de propinas por empleado
- Cálculo automático

### 4. Exportación a Excel ✅
- Exportar evento + reportes de ventas
- Hoja de información del evento
- Hoja de detalles de ventas
- Totales automáticos
- Nombrado automáticamente: `EVENT_X_YYYY-MM-DD_MANAGER.xlsx`

### 5. Navegación e Interfaz ✅
- Navbar con navegación entre secciones
- Home con quick start
- Página de eventos
- Página de detalles del evento
- Página de ventas rápidas
- Interfaz responsive (mobile + desktop)

---

## 📁 Estructura del Proyecto

```
klimrod-cfo/
├── app/
│   ├── components/
│   │   ├── EventForm.tsx       # Formulario para crear/editar eventos
│   │   ├── SalesTable.tsx      # Tabla editable de ventas
│   │   ├── TipReport.tsx       # Reporte de distribución de propinas
│   │   └── Navbar.tsx          # Barra de navegación
│   │
│   ├── events/
│   │   ├── page.tsx            # Página principal de eventos
│   │   └── details/
│   │       └── page.tsx        # Detalles del evento (ventas + propinas)
│   │
│   ├── sales/
│   │   └── page.tsx            # Página rápida de ventas
│   │
│   ├── lib/
│   │   ├── types.ts            # Interfaces TypeScript
│   │   ├── supabase.ts         # Cliente Supabase
│   │   ├── excel.ts            # Lógica de exportación Excel
│   │   ├── tips.ts             # Cálculo de distribución de propinas
│   │   ├── events.ts           # (futuro) Funciones de eventos en Supabase
│   │   └── sales.ts            # (futuro) Funciones de ventas en Supabase
│   │
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Home page
│
├── public/
│   └── (archivos estáticos)
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.mjs
├── eslint.config.mjs
├── next.config.ts
│
├── .env.local.example          # Ejemplo de variables de entorno
├── SETUP.md                    # Guía de instalación
├── SUPABASE_SETUP.md           # Guía de configuración Supabase
└── README.md
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│        PÁGINA HOME (Dashboard)                  │
│   - Links a Events y Sales Reports              │
└──────────┬────────────────────────────────────┬─┘
           │                                    │
           ▼                                    ▼
    ┌─────────────────┐              ┌──────────────────┐
    │  Events Page    │              │  Sales Page      │
    │                 │              │  (Quick Add)     │
    │ - List Events   │              │                  │
    │ - Create Event  │              │ - Quick entry    │
    │ - View Details  │              │ - Export Excel   │
    └────────┬────────┘              └──────────────────┘
             │
             ▼
    ┌─────────────────────┐
    │ Event Details Page  │
    │                     │
    │ Tabs:               │
    │ - Sales Report      │
    │ - Tip Distribution  │
    │                     │
    │ Actions:            │
    │ - Save Report       │
    │ - Export Excel      │
    │ - Edit Event        │
    └─────────────────────┘
```

---

## 📊 Modelos de Datos

### Event
```typescript
{
  id?: string
  date: string              // YYYY-MM-DD
  day: DayOfWeek           // MONDAY | TUESDAY | ... | SUNDAY
  year: number
  eventName: string        // EVENT 1, EVENT 2, etc
  shift: Shift             // LUNCH | BRUNCH | DINNER | NIGHT
  manager: string          // Nombre del manager
  created_at?: string      // ISO timestamp
  updated_at?: string      // ISO timestamp
}
```

### SalesRow
```typescript
{
  id?: string
  event_id?: string
  employee: string         // Nombre del empleado
  position: string         // Puesto (mesero, bartender, etc)
  netSales: number         // Ventas netas
  cashSales: number        // Ventas en efectivo
  ccSales: number          // Ventas con tarjeta (Credit Card)
  ccGratuity: number       // Propina de tarjeta
  cashGratuity: number     // Propina en efectivo
  points: number           // Puntos/frecuencia
  created_at?: string
  updated_at?: string
}
```

### SalesTotals
```typescript
{
  totalNetSales: number
  totalCashSales: number
  totalCcSales: number
  totalCcGratuity: number
  totalCashGratuity: number
  totalPoints: number
  totalGratuity: number
}
```

---

## 🔐 Seguridad y Autenticación

### Actual (Desarrollo)
- Datos en localStorage
- Sin autenticación

### A Futuro (Producción)
- Autenticación con Supabase Auth
- Row Level Security (RLS) policies
- Permisos por rol:
  - **Manager**: Ver y editar propios eventos
  - **Owner**: Ver todos los eventos
  - **Employee**: Ver solo sus propias propinas

---

## 📝 Guía de Uso

### Para Managers

1. **Crear Evento**
   - Home → Events → "+ Create New Event"
   - Completa: Fecha, Día, Año, Nombre, Turno, Manager
   - Guarda

2. **Registrar Ventas**
   - Desde evento: "Quick Add Sales"
   - O: "View Details" → "Sales Report"
   - Completa tabla con empleados y ventas
   - Guarda

3. **Ver Distribución de Propinas**
   - "View Details" → "Tip Distribution"
   - Selecciona método: % de ventas o partes iguales
   - Ve cuánto corresponde a cada empleado

4. **Exportar Reporte**
   - Sales Report → "📥 Export to Excel"
   - O: Tip Distribution → exportar desde ahí
   - Archivo se descarga automáticamente

### Para Dueños
- Ver eventos y reportes (futuro con autenticación)
- Analizar tendencias de ventas

### Para Empleados
- Ver sus propinas (futuro con dashboard de empleados)

---

## 🔧 Configuración de Supabase

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Tablas Necesarias
1. `events` - Información de eventos
2. `sales_reports` - Reportes de ventas

Ver [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para instrucciones completas.

---

## 🚀 Integraciones Futuras

### 1. Stripe (Pagos)
- Procesar pagos de catering
- Webhooks para registrar transacciones
- Balance de cuenta

### 2. OpenAI (IA)
- Análisis automático de reportes
- Recomendaciones de propinas
- Insights de patrones de ventas
- Chat assistant para preguntas

### 3. Vercel (Deploy)
- CI/CD automático
- Preview en PRs
- Monitoring y logs
- Dominio custom

### 4. GitHub (Versionamiento)
- Sincronización con repositorio
- CI/CD pipeline
- Colaboración en equipo

---

## 📈 Funcionalidades Futuras

- [ ] Dashboard de dueños con gráficos
- [ ] Dashboard de empleados
- [ ] Histórico de eventos y reportes
- [ ] Análisis de tendencias
- [ ] Reportes automáticos por período
- [ ] Integración con calendarios
- [ ] Notificaciones
- [ ] Auditoría de cambios
- [ ] Búsqueda avanzada
- [ ] Exportación a múltiples formatos (PDF, CSV, Google Sheets)

---

## 🐛 Troubleshooting

### Datos no se guardan
- Verifica que localStorage esté habilitado
- Abre DevTools → Application → Local Storage
- Busca datos bajo `events` y `sales_*`

### Excel no se descarga
- Verifica que `xlsx` esté instalado: `npm list xlsx`
- Intenta en incógnita si el navegador bloquea descargas
- Comprueba permisos de carpeta de descargas

### Eventos no aparecen después de recargar
- localStorage solo persiste en el mismo dominio/navegador
- Usa Supabase para persistencia real

---

## 📚 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/docs)
- [XLSX.js](https://github.com/SheetJS/sheetjs)

---

## 📧 Contacto y Soporte

Para preguntas o reportar bugs, contacta al equipo de desarrollo.

---

**Última actualización**: Diciembre 2025
**Versión**: 0.1.0 (Beta)
