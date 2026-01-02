# KlimRod CFO - Sales Management System

Una aplicación completa para gestionar reportes de ventas de eventos, exportar datos a Excel y distribuir propinas a empleados.

## 🚀 Características

- **Gestión de Eventos**: Crear y organizar eventos con información de fecha, turno y manager
- **Reportes de Ventas**: Registrar ventas por empleado con múltiples categorías (cash, tarjeta, propinas)
- **Exportación a Excel**: Descargar reportes en formato Excel con toda la información del evento
- **Cálculo Automático**: Totales y sumas automáticas para todas las métricas
- **Almacenamiento Local**: Actualmente usa localStorage (preparado para Supabase)

## 📋 Estructura de Datos

### Evento (Event)
- Fecha (DATE)
- Día de la semana (DAY)
- Año (YEAR)
- Nombre del evento (EVENT)
- Turno (SHIFT): LUNCH, BRUNCH, DINNER, NIGHT
- Manager asignado (MANAGER)

### Reporte de Ventas (Sales)
- Empleado (EMPLOYEE)
- Posición (POSITION)
- Ventas netas (NET SALES)
- Ventas en efectivo (CASH SALES)
- Ventas con tarjeta (CREDIT CARD SALES)
- Propina tarjeta (CREDIT CARD GRATUITY)
- Propina efectivo (CASH GRATUITY)
- Puntos (POINTS)

## 🛠️ Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   \`\`\`bash
   git clone <repo-url>
   cd klimrod-cfo
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar variables de entorno**
   \`\`\`bash
   cp .env.local.example .env.local
   # Editar .env.local con tus credenciales
   \`\`\`

4. **Ejecutar en desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Abrir en navegador**
   - Visita: http://localhost:3000

## 📱 Uso

### 1. Crear un Evento
- Ve a la página **Events** (Eventos)
- Haz clic en **"+ Create New Event"**
- Completa los datos: fecha, día, año, nombre del evento, turno y manager
- Guarda el evento

### 2. Agregar Datos de Ventas
- Desde la tarjeta del evento, haz clic en **"Add Sales"**
- Completa la tabla con información de cada empleado:
  - Nombre y posición
  - Montos de ventas (neto, efectivo, tarjeta)
  - Propinas (efectivo y tarjeta)
  - Puntos
- Los totales se calculan automáticamente

### 3. Guardar y Exportar
- Haz clic en **"Save Report"** para guardar los cambios
- Haz clic en **"📥 Export to Excel"** para descargar el archivo
- El archivo se descargará con el nombre: \`EVENT_X_YYYY-MM-DD_MANAGER.xlsx\`

## 🔌 Integraciones Futuras

### Supabase
- [ ] Crear tabla \`events\`
- [ ] Crear tabla \`sales_reports\`
- [ ] Configurar RLS policies
- [ ] Reemplazar localStorage con Supabase queries

### Stripe
- [ ] Integración para procesos de pago
- [ ] Webhooks para registrar transacciones

### OpenAI
- [ ] Análisis automático de reportes
- [ ] Recomendaciones de distribución de propinas
- [ ] Insights de ventas

### Vercel
- [ ] Conectar repositorio GitHub
- [ ] Deploy automático en cada push
- [ ] Preview en PRs

## 📁 Estructura de Carpetas

\`\`\`
├── app/
│   ├── components/        # Componentes reutilizables
│   │   ├── EventForm.tsx  # Formulario de eventos
│   │   └── SalesTable.tsx # Tabla de ventas
│   ├── events/            # Página de eventos
│   │   └── page.tsx
│   ├── lib/               # Funciones utilitarias
│   │   ├── types.ts       # Tipos TypeScript
│   │   ├── excel.ts       # Lógica de exportación
│   │   └── supabase.ts    # Cliente Supabase
│   ├── sales/             # Página de reportes
│   │   └── page.tsx
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Home / Dashboard
│   └── globals.css        # Estilos globales
├── package.json
├── tsconfig.json
└── .env.local.example
\`\`\`

## 🎨 Tecnologías Utilizadas

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **XLSX** - Exportación a Excel
- **Supabase** - Base de datos (preparado)

## 🔐 Seguridad

Actualmente la app usa localStorage. Cuando integres Supabase:
1. Implementa autenticación con Supabase Auth
2. Configura RLS policies en las tablas
3. Restringe acceso por rol (manager, owner, employee)

## 📊 Variables de Entorno

\`\`\`
NEXT_PUBLIC_SUPABASE_URL       # URL de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Key pública de Supabase
\`\`\`

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

## 📝 Notas

- Los datos actualmente se guardan en localStorage del navegador
- La próxima versión usará Supabase para almacenamiento persistente
- Los reportes exportados incluyen información del evento y totales
- Compatible con Excel 2010+ y Google Sheets
