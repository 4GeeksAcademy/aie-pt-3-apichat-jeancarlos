import { NextResponse } from 'next/server'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const model = 'qwen/qwen3.8-27b'

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'El servicio de chat no está configurado. Añade GROQ_API_KEY al entorno del servidor.' },
      { status: 503 },
    )
  }

  let messages: ChatMessage[]

  try {
    const body: { messages?: ChatMessage[] } = await request.json()
    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.some(
        (message) =>
          !message ||
          !['user', 'assistant'].includes(message.role) ||
          typeof message.content !== 'string',
      )
    ) {
      return NextResponse.json({ error: 'La conversación enviada no es válida.' }, { status: 400 })
    }
    messages = body.messages
  } catch {
    return NextResponse.json({ error: 'No se pudo leer el mensaje enviado.' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages }),
    })

    if (!response.ok) {
      const status = response.status
      console.error('Groq API returned HTTP status:', status)
      const error = status === 401 || status === 403
        ? 'La clave del servicio no es válida. Revisa la configuración de Groq.'
        : status === 429
          ? 'El servicio está recibiendo demasiadas solicitudes. Inténtalo de nuevo en un momento.'
          : 'Groq no pudo completar la solicitud. Inténtalo de nuevo.'
      return NextResponse.json({ error }, { status: status === 429 ? 429 : 502 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content
    if (typeof reply !== 'string') {
      return NextResponse.json(
        { error: 'El servicio devolvió una respuesta vacía. Inténtalo de nuevo.' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      reply,
      model: data.model ?? model,
      usage: {
        promptTokens: Number(data.usage?.prompt_tokens ?? 0),
        completionTokens: Number(data.usage?.completion_tokens ?? 0),
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'No se pudo conectar con Groq. Comprueba tu conexión e inténtalo de nuevo.' },
      { status: 502 },
    )
  }
}
