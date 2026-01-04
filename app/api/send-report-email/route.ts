export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, pdfBase64 } = await request.json();
    if (!to || !pdfBase64) {
      return NextResponse.json({ error: 'Missing email or PDF' }, { status: 400 });
    }

    // Configura tu transporter SMTP aquí (ejemplo con Gmail, reemplaza con tu proveedor real)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: subject || 'Reporte de Evento',
      text: text || 'Adjunto el reporte en PDF.',
      attachments: [
        {
          filename: 'reporte-evento.pdf',
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
  }
}
