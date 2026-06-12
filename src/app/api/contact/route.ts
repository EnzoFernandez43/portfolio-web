import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { nombre, email, asunto, mensaje } = await req.json();

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',        // sin dominio propio, solo este funciona
    to: 'enzomiguelfernandez43@gmail.com',
    subject: `[Portfolio] ${asunto}`,
    html: `
      <p><strong>De:</strong> ${nombre} (${email})</p>
      <p><strong>Asunto:</strong> ${asunto}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}