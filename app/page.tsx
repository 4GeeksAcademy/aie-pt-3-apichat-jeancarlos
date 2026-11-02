'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, RotateCcw, Send, Sparkles } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type SessionMetrics = {
  promptTokens: number
  completionTokens: number
  model: string
}

type StoredSession = {
  messages?: Message[]
  metrics?: SessionMetrics
}

const storageKey = 'lumen-chat-session'
const initialMetrics: SessionMetrics = { promptTokens: 0, completionTokens: 0, model: '' }

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState(initialMetrics)
  const [isHydrated, setIsHydrated] = useState(false)
  const conversationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const session = JSON.parse(stored) as StoredSession
        if (Array.isArray(session.messages)) setMessages(session.messages)
        if (session.metrics) setMetrics({ ...initialMetrics, ...session.metrics })
      }
    } catch {
      localStorage.removeItem(storageKey)
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(storageKey, JSON.stringify({ messages, metrics }))
  }, [isHydrated, messages, metrics])

  useEffect(() => {
    if (!isLoading) {
      setIsThinking(false)
      return
    }
    const timer = window.setTimeout(() => setIsThinking(true), 250)
    return () => window.clearTimeout(timer)
  }, [isLoading])

  useEffect(() => {
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = input.trim()
    if (!content || isLoading || !isHydrated) return

    const nextMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'No se pudo enviar el mensaje. Inténtalo de nuevo.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
      setMetrics((current) => ({
        promptTokens: current.promptTokens + Number(data.usage?.promptTokens ?? 0),
        completionTokens: current.completionTokens + Number(data.usage?.completionTokens ?? 0),
        model: typeof data.model === 'string' ? data.model : current.model,
      }))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  function clearConversation() {
    if (isLoading) return
    setMessages([])
    setMetrics(initialMetrics)
    setError('')
    localStorage.removeItem(storageKey)
  }

  const totalTokens = metrics.promptTokens + metrics.completionTokens

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
          <div><p className="text-sm font-semibold">Lumen AI</p><p className="text-xs text-muted-foreground">Chat con Groq</p></div>
        </div>
        <button type="button" onClick={clearConversation} disabled={isLoading || (!messages.length && !totalTokens)} className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45">
          <RotateCcw className="size-3.5" /> Borrar conversación
        </button>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_250px]">
        <section className="flex min-h-[65vh] flex-col overflow-hidden rounded-xl border bg-card" aria-label="Conversación">
          <div ref={conversationRef} className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-7" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground"><MessageSquare className="size-5" /></div>
                <h1 className="text-lg font-semibold">¿En qué puedo ayudarte?</h1>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">Escribe una pregunta para iniciar una conversación con Llama 3.</p>
              </div>
            ) : messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Sparkles className="size-3.5" /></div>}
                <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted'}`}>{message.content}</div>
              </div>
            ))}
            {isThinking && <div className="flex items-center gap-3 text-sm text-muted-foreground"><div className="flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground"><Sparkles className="size-3.5" /></div><span>Pensando...</span></div>}
            {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-3 sm:p-4">
            <label htmlFor="chat-message" className="sr-only">Escribe un mensaje</label>
            <div className="flex items-end gap-2 rounded-lg border bg-background p-2 focus-within:ring-2 focus-within:ring-ring/40">
              <textarea id="chat-message" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} placeholder="Escribe un mensaje..." rows={2} className="max-h-40 min-h-12 flex-1 resize-y bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" disabled={!isHydrated || isLoading} />
              <button type="submit" disabled={!input.trim() || isLoading || !isHydrated} aria-label="Enviar mensaje" className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-4" /></button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Enter para enviar · Shift + Enter para una nueva línea</p>
          </form>
        </section>

        <aside className="flex flex-col gap-3" aria-label="Métricas de la sesión">
          <h2 className="text-sm font-semibold">Uso de tokens</h2>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <Metric label="Prompt" value={metrics.promptTokens} />
            <Metric label="Completado" value={metrics.completionTokens} />
            <Metric label="Total" value={totalTokens} />
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs text-muted-foreground">Modelo</p>
            <p className="mt-1 break-all text-sm font-medium">{metrics.model || 'Llama 3 (Groq)'}</p>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">Los tokens se acumulan durante esta sesión y se conservan junto a la conversación.</p>
        </aside>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border bg-card p-3 lg:p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold tabular-nums">{value.toLocaleString('es-ES')}</p></div>
}
