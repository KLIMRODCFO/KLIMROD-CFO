# Integración Stripe - Guía de Setup

Esta guía te ayudará a integrar Stripe para procesamiento de pagos en KlimRod CFO.

## 1. ¿Cuándo usar Stripe?

Stripe es ideal para:
- ✅ Pagos de catering/eventos
- ✅ Transferencias a empleados
- ✅ Comisiones y propinas
- ✅ Facturación automática
- ✅ Reportes de pagos

## 2. Crear Cuenta en Stripe

### 2.1 Registro
1. Ve a [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Completa:
   - Email
   - Contraseña
   - País
   - Tipo de cuenta: "Individual" o "Business"

3. Verifica tu email

### 2.2 Información de Cuenta
1. Dashboard → **Settings**
2. Completa:
   - Business information
   - Tax information
   - Banking information
3. Stripe revisará tu cuenta (puede tomar 24-48 horas)

## 3. Obtener Credenciales

Una vez activada tu cuenta:

1. **API Keys** en [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copia:
   - **Publishable Key** (test): `pk_test_...` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** (test): `sk_test_...` → `STRIPE_SECRET_KEY`

3. Agrega en `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 4. Instalar Paquetes

```bash
npm install @stripe/react-stripe-js @stripe/stripe-js stripe
```

## 5. Usar Cases por Tipo de Transacción

### Case 1: Pagos de Eventos (Clientes → Tu cuenta)

```typescript
// app/lib/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function createPaymentIntent(eventId: string, amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe usa centavos
    currency: 'usd', // Cambiar según tu moneda
    metadata: {
      eventId: eventId,
    },
  })

  return paymentIntent
}
```

### Case 2: Transferencias a Empleados (Tu cuenta → Empleados)

```typescript
// Requiere: Stripe Connect para empleados

export async function transferToEmployee(employeeStripeId: string, amount: number) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    destination: employeeStripeId,
  })

  return transfer
}
```

### Case 3: Manejo de Propinas Automáticas

```typescript
export async function processTips(eventId: string, tips: TipDistribution[]) {
  // Procesar propinas automáticamente a empleados
  const results = await Promise.all(
    tips.map((tip) =>
      transferToEmployee(tip.employeeStripeId, tip.amount)
    )
  )

  return results
}
```

## 6. Componente de Pago

```typescript
// app/components/StripePaymentForm.tsx
'use client'

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

export default function StripePaymentForm({ amount }: { amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)

    // Crear payment intent en tu backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })

    const { clientSecret } = await response.json()

    // Confirmar pago
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    })

    setLoading(false)

    if (result.error) {
      console.error(result.error)
    } else if (result.paymentIntent?.status === 'succeeded') {
      alert('¡Pago exitoso!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg">
      <CardElement />
      <button
        disabled={!stripe || loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? 'Procesando...' : `Pagar $${amount}`}
      </button>
    </form>
  )
}
```

## 7. API Routes para Backend

```typescript
// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/app/lib/stripe'

export async function POST(request: NextRequest) {
  const { amount, eventId } = await request.json()

  const paymentIntent = await createPaymentIntent(eventId, amount)

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  })
}
```

## 8. Testing en Modo Sandbox

### Tarjetas de Prueba
Usa estas tarjetas en modo test:

**Exitoso:**
- `4242 4242 4242 4242`

**Rechazado:**
- `4000 0000 0000 0002`

**3D Secure:**
- `4000 0000 0000 3220`

Fecha: Cualquier futura
CVC: Cualquier número

## 9. Webhooks (Importante)

Para procesar pagos completados:

### 9.1 Crear Webhook
1. **Developers** → **Webhooks**
2. "Add endpoint"
3. URL: `https://tu-dominio.com/api/webhooks/stripe`
4. Eventos: Selecciona:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `transfer.created`

### 9.2 Implementar Handler
```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Pago completado:', paymentIntent.id)
      // Actualizar DB con comprobante de pago
      break
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Pago rechazado:', paymentIntent.id)
      // Notificar al usuario
      break
    }
  }

  return NextResponse.json({ received: true })
}
```

## 10. Guardar Información de Pago Segura

```typescript
// En tu BD de Supabase
interface PaymentRecord {
  id: string
  event_id: string
  stripe_payment_id: string
  amount: number
  status: 'pending' | 'succeeded' | 'failed'
  created_at: string
}
```

## 11. Agregar a tu Flujo

### Workflow Sugerido:
1. Manager crea evento
2. Manager agrega ventas
3. Sistema calcula propinas
4. **NEW**: Manager paga propinas a empleados con Stripe
5. Empleados reciben dinero
6. Exportar reporte con confirmación de pago

## 12. Pasar a Producción

Cuando estés listo:

### 12.1 Cambiar a Keys Reales
1. En Stripe Dashboard, desactiva "View test data"
2. Copia live keys: `pk_live_...`, `sk_live_...`
3. Agrega en Vercel environment variables
4. Redeploy

### 12.2 Verificación
- Stripe revisará tu negocio nuevamente
- Espera confirmación antes de procesar pagos reales

## 13. Configuración Adicional

### Divisas
Si necesitas múltiples divisas:
```typescript
const CURRENCIES = {
  'USD': 'usd',
  'EUR': 'eur',
  'MXN': 'mxn',
} as const
```

### Comisiones
Stripe cobra:
- 2.9% + $0.30 por transacción (USD)
- Varía por país y tipo de cuenta

## 14. Troubleshooting

### Error: "Invalid API Key"
- Verifica que la key está en variables de entorno
- Reinicia el servidor dev
- Comprueba que es la versión correcta (test vs live)

### Webhooks no se disparan
- Verifica que Vercel está visible públicamente
- Comprueba logs en Stripe Dashboard
- Usa Stripe CLI para testing local:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

### Pago fallido sin razón aparente
- Verifica amount (debe ser en centavos)
- Comprueba que currency coincida con tu cuenta
- Revisa logs de Stripe Dashboard

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Testing Guide](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)

## 🔐 Seguridad

- ⚠️ NUNCA commits credenciales reales
- Use variables de entorno para todo
- Implementa rate limiting en endpoints
- Valida todos los inputs
- Usa HTTPS siempre en producción

---

**Estado**: Este es un blueprint. Implementar según tus necesidades específicas.
