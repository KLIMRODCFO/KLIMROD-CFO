# KlimRod CFO - Sales Management & Reporting System

**Aplicación completa para gestionar reportes de ventas, propinas y exportación a Excel.**

![Status](https://img.shields.io/badge/status-beta-yellow)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Descripción

KlimRod CFO es un sistema de gestión de reportes de ventas diseñado para managers y dueños de eventos/restaurantes. Permite:

- 📅 **Crear eventos** con información completa
- 📊 **Registrar ventas** por empleado en tiempo real
- 💰 **Calcular propinas** automáticamente
- 📥 **Exportar a Excel** para registros y análisis
- 🤖 **Análisis con IA** (próximamente)
- 💳 **Procesos de pago** con Stripe (futuro)

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación (5 minutos)

```bash
# Clonar y entrar al proyecto
git clone <repo-url>
cd klimrod-cfo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# (Por ahora puedes dejar vacías las variables de Supabase)

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Uso Básico

1. **Home**: Ve el dashboard
2. **Events**: Crea tu primer evento
3. **View Details**: Registra ventas de empleados
4. **Export**: Descarga reporte en Excel

## 📁 Estructura

```
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── EventForm.tsx
│   │   ├── SalesTable.tsx
│   │   ├── TipReport.tsx
│   │   └── Navbar.tsx
│   ├── events/              # Página de eventos
│   ├── events/details/      # Detalles del evento
│   ├── sales/               # Página de ventas rápidas
│   └── lib/                 # Utilidades
│       ├── types.ts         # Interfaces
│       ├── excel.ts         # Exportación
│       ├── tips.ts          # Cálculo de propinas
│       └── supabase.ts      # Base de datos
├── SETUP.md                 # Guía de instalación
├── DOCUMENTATION.md         # Docs técnicas
└── ...
```

## 📊 Características

### ✅ Implementadas

- [x] Gestión de eventos (CRUD)
- [x] Registro de ventas editable
- [x] Cálculo automático de totales
- [x] Distribución de propinas (por % o partes iguales)
- [x] Exportación a Excel
- [x] Interfaz responsive
- [x] Almacenamiento local (localStorage)
- [x] Navegación intuitiva

### 🔄 En Desarrollo

- [ ] Autenticación con Supabase
- [ ] Base de datos persistente (Supabase)
- [ ] Dashboard de analytics

### 🚧 Próximas

- [ ] Integración con Stripe (pagos)
- [ ] Análisis con OpenAI (IA)
- [ ] Dashboard para dueños
- [ ] Dashboard para empleados
- [ ] Reportes automáticos
- [ ] Gráficos y análisis

## 📚 Documentación Completa

- **[SETUP.md](SETUP.md)** - Instalación y configuración inicial
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Docs técnicas completas
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Configurar base de datos
- **[VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)** - Deploy en producción
- **[STRIPE_SETUP.md](STRIPE_SETUP.md)** - Integración de pagos
- **[OPENAI_SETUP.md](OPENAI_SETUP.md)** - Integración de IA

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL) - preparado
- **Exportación**: XLSX
- **Deploy**: Vercel
- **Auth**: Supabase Auth - próximo
- **Pagos**: Stripe - futuro
- **IA**: OpenAI - futuro

## 🔐 Seguridad

- Variables de entorno para credenciales
- TypeScript para type-safety
- Validaciones en formularios
- RLS policies en Supabase (cuando esté configurado)

## 💡 Flujo de Uso

```
Manager crea evento → Registra ventas → Calcula propinas → Exporta a Excel
```

## 🤝 Contribuir

Reporta bugs o sugiere features en issues.

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

## 📄 Licencia

MIT

---

## 🎓 Aprende Más

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

---

**Versión**: 0.1.0 (Beta)  
**Última actualización**: Diciembre 2025
