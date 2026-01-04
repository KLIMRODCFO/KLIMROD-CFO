import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { reportData } = await request.json();
    if (!reportData) {
      return NextResponse.json({ error: 'No report data provided' }, { status: 400 });
    }

    // Construye el prompt para OpenAI
    const prompt = `Eres un asistente experto en análisis de reportes de ventas de restaurantes. Resume el siguiente reporte de manera profesional, clara y concisa, resaltando los puntos clave, incidencias, logros y cualquier observación relevante. El resumen debe ser apto para enviar a los dueños del restaurante.\n\nReporte completo:\n${JSON.stringify(reportData, null, 2)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres un asistente experto en reportes de restaurantes.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const summary = response.choices?.[0]?.message?.content || '';
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('❌ Error al generar resumen con OpenAI:', error);
    return NextResponse.json({ error: 'Error al generar resumen' }, { status: 500 });
  }
}
