# Guía de Deploy en Vercel

Esta guía te ayudará a desplegar tu aplicación KlimRod CFO en Vercel.

## 1. Preparar tu Repositorio GitHub

### 1.1 Crear repositorio en GitHub
1. Ve a [https://github.com/new](https://github.com/new)
2. Nombre: `klimrod-cfo`
3. Descripción: "Sales Management & Reporting System"
4. Público o privado según prefieras
5. No inicialices con README (ya tienes uno)
6. Crea el repositorio

### 1.2 Subir tu código a GitHub

En tu terminal, en la carpeta del proyecto:

```bash
# Inicializar git (si no está hecho)
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: KlimRod CFO app"

# Agregar remoto
git remote add origin https://github.com/YOUR_USERNAME/klimrod-cfo.git

# Push a main branch
git branch -M main
git push -u origin main
```

## 2. Conectar Vercel a GitHub

### 2.1 Crear cuenta en Vercel
1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel para acceder a tus repositorios

### 2.2 Importar proyecto
1. En dashboard de Vercel, haz clic en "Add New..." → "Project"
2. Busca tu repositorio `klimrod-cfo`
3. Haz clic en "Import"

## 3. Configurar Variables de Entorno

En Vercel, durante el setup:

1. **Project Settings** (después de importar)
2. Ve a **Settings** → **Environment Variables**
3. Agrega:

```
NEXT_PUBLIC_SUPABASE_URL = tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_key_supabase
```

4. Haz clic en "Deploy"

## 4. Configuración Avanzada

### 4.1 Dominio Custom
1. En **Settings** → **Domains**
2. Agregar dominio custom
3. Seguir instrucciones para configurar DNS

### 4.2 CI/CD Settings
1. **Settings** → **Git**
2. Configurar branches a desplegar:
   - Production: `main`
   - Preview: Pull Requests

### 4.3 Build Settings
Por defecto Vercel detecta Next.js. Si necesitas cambiar:

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

## 5. Primeros Deploys

### First Deploy
Vercel automáticamente:
- Construye tu app
- Corre tests (si existen)
- Despliega en una URL temporal

Deberías ver: `https://klimrod-cfo.vercel.app`

### Preview Deployments
Cada PR automáticamente:
- Crea un preview
- Te muestra URL para revisar cambios
- Requiere aprobación antes de merge a main

## 6. Monitoreo y Logs

### Ver Logs de Build
1. Dashboard → Tu proyecto
2. Haz clic en último deployment
3. → "Logs"

### Ver Logs en Runtime
1. Dashboard → Tu proyecto
2. **Settings** → **Integrations**
3. Conectar con herramienta de logs (Sentry, etc)

## 7. Actualizar después de cambios

Simplemente push a GitHub:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel automáticamente:
- Detecta cambios
- Builds y deploya
- Te notifica si hay errores

## 8. Variables de Entorno para Futuras Integraciones

Cuando agregues Stripe y OpenAI, en Vercel Settings:

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...

# OpenAI
OPENAI_API_KEY = sk-...
OPENAI_ORG_ID = org-...
```

⚠️ **Nota**: Las variables con `NEXT_PUBLIC_` son públicas (seguro en frontend)
Las otras son secretas (solo backend)

## 9. Troubleshooting

### Build falla
- Revisa los logs en Vercel
- Verifica que `npm run build` funciona localmente
- Comprueba TypeScript: `npx tsc --noEmit`

### Variables de entorno no cargan
- Verifica que están bien configuradas en Settings
- Redeploy después de agregar variables
- Usa console.log para debug (con cuidado en prod)

### Lentitud
- Ve a **Analytics** en Vercel
- Identifica requests lentos
- Optimiza imágenes y código splitting

## 10. Seguridad

### Proteger Secrets
- Nunca commits `.env.local`
- Usa `.gitignore`:
  ```
  .env.local
  .env.*.local
  node_modules/
  .next/
  ```

### CORS y Headers
Agregar en `next.config.ts` si necesitas:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ]
}
```

## 11. Próximos Pasos

- [ ] Configurar dominio custom
- [ ] Agregar Supabase en Vercel
- [ ] Integrar Stripe
- [ ] Configurar OpenAI
- [ ] Agregar CI/CD checks (ESLint, Tests)
- [ ] Configurar Sentry para error tracking
- [ ] Setup de backups automáticos

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Environment Variables in Vercel](https://vercel.com/docs/environment-variables)
- [Best Practices](https://vercel.com/docs/edge-network/best-practices)

---

**Notas finales:**
- Vercel es gratis para proyectos pequeños
- Con tráfico alto, el costo escala automáticamente
- Siempre tienes control total sobre precios
