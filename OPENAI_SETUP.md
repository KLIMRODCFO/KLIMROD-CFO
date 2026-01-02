# Integración OpenAI - Guía de Setup

Esta guía te ayudará a integrar OpenAI para análisis inteligente en KlimRod CFO.

## 1. ¿Por qué OpenAI?

OpenAI en KlimRod CFO puede:
- 📊 Analizar reportes automáticamente
- 💡 Dar recomendaciones de propinas
- 📈 Identificar tendencias de ventas
- 💬 Responder preguntas sobre reportes
- 🎯 Optimizar distribución de ingresos

## 2. Crear Cuenta en OpenAI

### 2.1 Registro
1. Ve a [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Crea cuenta con:
   - Email
   - Contraseña
   - Nombre
   - Teléfono (para verificación)

3. Verifica tu email y teléfono

### 2.2 Configurar Billing
1. Ve a [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Agrega método de pago (tarjeta de crédito)
3. Configura límites de uso (importante para no sorpresas)

## 3. Obtener API Key

1. Ve a [https://platform.openai.com/api/keys](https://platform.openai.com/api/keys)
2. Clic en "Create new secret key"
3. Dale un nombre: "KlimRod CFO"
4. **COPIA INMEDIATAMENTE** (solo aparece una vez)
5. Agrega en `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

## 4. Instalar SDK

```bash
npm install openai
```

## 5. Use Cases para KlimRod CFO

### Case 1: Analizar Reporte de Ventas

```typescript
// app/lib/openai.ts
import OpenAI from 'openai'
import { Event, SalesRow } from './types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeSalesReport(
  event: Event,
  sales: SalesRow[]
) {
  const reportSummary = `
    Evento: ${event.eventName}
    Fecha: ${event.date}
    Turno: ${event.shift}
    Manager: ${event.manager}
    
    Empleados y Ventas:
    ${sales
      .map(
        (s) =>
          `- ${s.employee} (${s.position}): $${s.netSales} en ventas, $${s.ccGratuity + s.cashGratuity} en propinas`
      )
      .join('\n')}
  `

  const message = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'Eres un experto en análisis de reportes de ventas y eventos de restaurantes/bares. Proporciona insights útiles y accionables.',
      },
      {
        role: 'user',
        content: `Analiza este reporte de ventas e identifica:
1. Vendedor estrella
2. Áreas de mejora
3. Eficiencia de propinas
4. Tendencias notables

Reporte:
${reportSummary}`,
      },
    ],
  })

  return message.choices[0].message.content
}
```

### Case 2: Recomendar Distribución de Propinas

```typescript
export async function recommendTipDistribution(
  sales: SalesRow[],
  totalTips: number
) {
  const salesData = sales
    .map((s) => `${s.employee}: $${s.netSales} ventas`)
    .join('\n')

  const message = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content:
          'Eres un experto en distribución justa de propinas en restaurantes.',
      },
      {
        role: 'user',
        content: `Dadas estas ventas y $${totalTips} en propinas, recomienda la mejor distribución:
${salesData}

Considera factores de equidad, esfuerzo visible, y morale del equipo.`,
      },
    ],
  })

  return message.choices[0].message.content
}
```

### Case 3: Generar Resumen Ejecutivo

```typescript
export async function generateExecutiveSummary(
  events: Event[],
  allSales: SalesRow[][]
) {
  const summary = `
    Eventos procesados: ${events.length}
    Total de vendedores: ${new Set(allSales.flat().map((s) => s.employee)).size}
    Total de ventas: $${allSales
      .flat()
      .reduce((sum, s) => sum + s.netSales, 0)}
  `

  const message = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'Eres un experto en análisis de negocios de restaurantes.',
      },
      {
        role: 'user',
        content: `Genera un resumen ejecutivo para el dueño del lugar:
${summary}

Incluye:
1. Métricas clave
2. Victorias
3. Oportunidades de crecimiento`,
      },
    ],
  })

  return message.choices[0].message.content
}
```

## 6. Componente de Chat

```typescript
// app/components/AIInsights.tsx
'use client'

import { useState } from 'react'
import { Event, SalesRow } from '@/app/lib/types'

interface AIInsightsProps {
  event: Event
  sales: SalesRow[]
}

export default function AIInsights({ event, sales }: AIInsightsProps) {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<string>('')

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analyze-sales', {
        method: 'POST',
        body: JSON.stringify({ event, sales }),
      })

      const data = await response.json()
      setInsights(data.analysis)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 AI Insights</h3>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg mb-4 disabled:bg-gray-400"
      >
        {loading ? 'Analizando...' : 'Analizar con IA'}
      </button>

      {insights && (
        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
          {insights}
        </div>
      )}
    </div>
  )
}
```

## 7. API Routes

```typescript
// app/api/analyze-sales/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { analyzeSalesReport } from '@/app/lib/openai'

export async function POST(request: NextRequest) {
  const { event, sales } = await request.json()

  const analysis = await analyzeSalesReport(event, sales)

  return NextResponse.json({ analysis })
}

// app/api/recommend-tips/route.ts
import { recommendTipDistribution } from '@/app/lib/openai'

export async function POST(request: NextRequest) {
  const { sales, totalTips } = await request.json()

  const recommendation = await recommendTipDistribution(sales, totalTips)

  return NextResponse.json({ recommendation })
}
```

## 8. Integración en UI

```typescript
// En app/events/details/page.tsx, agregar:

{tab === 'ai' ? (
  <>
    <AIInsights event={event} sales={sales} />
    <AIRecommendations sales={sales} totals={totals} />
  </>
) : null}
```

## 9. Modelos Disponibles

OpenAI ofrece varios modelos:

| Modelo | Costo | Velocidad | Calidad | Usa en |
|--------|-------|-----------|---------|---------|
| gpt-4-turbo | Alto | Medio | Muy Alta | Análisis complejos |
| gpt-4o | Medio | Rápido | Alta | Recomendaciones |
| gpt-4o-mini | Bajo | Muy Rápido | Buena | Chat simple |

Recomendación: Usa `gpt-4o` para mejor balance.

## 10. Prompts Optimizados para KlimRod CFO

### Prompt: Análisis de Performance

```
Eres un gerente de restaurante experto con 10 años de experiencia.
Analiza este reporte de ventas y proporciona:
1. Top 3 vendedores y por qué sobresalen
2. Qué podría mejorar cada empleado
3. Patrones o tendencias notables
4. Una recomendación accionable para aumentar ventas

Sé conciso (máximo 3 párrafos) pero detallado.
```

### Prompt: Distribución Justa de Propinas

```
Como experto en recursos humanos de hospitality:
- Proporciona una distribución justa de propinas basada en ventas
- Considera el rol (mesero vs bartender) si es relevante
- Explica brevemente tu lógica
- Mantén la moral del equipo en mente
- Sugiere incentivos para el siguiente evento
```

## 11. Limitaciones y Costos

### Precios Aproximados (USD)
- gpt-4-turbo: $0.01 per 1K input tokens, $0.03 per 1K output tokens
- gpt-4o: $0.005 per 1K input, $0.015 per 1K output
- gpt-4o-mini: $0.00015 per 1K input, $0.0006 per 1K output

### Ejemplo de Costo
Un análisis típico: ~100 tokens input, ~200 output
- Con gpt-4o-mini: ~$0.00013
- Con gpt-4o: ~$0.001
- 100 análisis al mes: <$0.10 con mini, ~$0.10 con o

### Limitaciones
- Rate limit: 3,500 requests per minute (plan pay-as-you-go)
- Max tokens: 128,000 para gpt-4-turbo
- Latencia: 1-10 segundos típicamente

## 12. Mejores Prácticas

```typescript
// ✅ Cachear respuestas
const cache = new Map<string, string>()

export async function getCachedAnalysis(eventId: string) {
  if (cache.has(eventId)) {
    return cache.get(eventId)!
  }

  const analysis = await analyzeSalesReport(...)
  cache.set(eventId, analysis)
  return analysis
}

// ✅ Manejar errores
try {
  const analysis = await openai.chat.completions.create(...)
} catch (error) {
  if (error instanceof OpenAI.RateLimitError) {
    // Esperar y reintentar
  } else {
    // Manejar otro error
  }
}

// ✅ Timeouts
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000) // 30 segundos

// ✅ Validar inputs
if (!sales || sales.length === 0) {
  return "No hay datos para analizar"
}
```

## 13. Pasar a Producción

```env
# En Vercel
OPENAI_API_KEY=sk-... # Tu API key real
```

Mantén logs de:
- Cuántos análisis se hacen
- Cuántas tokens se gastan
- Errores y latencias

## 14. Futuras Extensiones

- [ ] Chat con IA sobre reportes
- [ ] Predicción de ventas futuras
- [ ] Análisis de tendencias por hora
- [ ] Recomendaciones de menú
- [ ] Alertas automáticas (bajo performance)
- [ ] Generación automática de reportes
- [ ] Análisis de satisfacción de clientes

## 📚 Recursos

- [OpenAI Docs](https://platform.openai.com/docs)
- [API Reference](https://platform.openai.com/docs/api-reference)
- [Playground](https://platform.openai.com/playground)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

## 🔐 Seguridad

- ⚠️ Nunca expongas tu API key en el frontend
- Siempre valida user inputs
- Implementa rate limiting
- No guardes datos sensibles del cliente en OpenAI
- Revisa costs regularmente

---

**Tip**: Empieza con gpt-4o-mini para testing. Es económico y suficiente para la mayoría de análisis.
