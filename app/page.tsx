'use client'

import { useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  CircleHelp,
  Command,
  FileText,
  Hash,
  LayoutGrid,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  TrendingUp,
  User,
  X,
} from 'lucide-react'

const conversations = [
  { title: 'Optimización de consultas SQL', time: 'Ahora', active: true },
  { title: 'Ideas para onboarding', time: 'Ayer' },
  { title: 'Resumen del Q3', time: 'Ayer' },
  { title: 'API de clasificación', time: '12 Oct' },
  { title: 'Notas de la reunión', time: '10 Oct' },
]

const usage = [
  { label: 'Lun', value: 38 },
  { label: 'Mar', value: 52 },
  { label: 'Mié', value: 44 },
  { label: 'Jue', value: 76 },
  { label: 'Vie', value: 61 },
  { label: 'Sáb', value: 28 },
  { label: 'Dom', value: 42 },
]

export default function Page() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) return
    setSent(true)
    setMessage('')
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-20 flex w-[264px] flex-col border-r bg-sidebar transition-transform lg:static lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-[72px] items-center justify-between border-b px-5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
              <span className="text-[15px] font-semibold tracking-tight">Lumen AI</span>
            </div>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Cerrar menú"><X className="size-4" /></button>
          </div>
          <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-3">
            <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"><Plus className="size-4" /> Nueva conversación <span className="ml-auto rounded border border-primary-foreground/20 px-1 text-[10px] opacity-70">⌘ K</span></button>
            <nav className="flex flex-col gap-1" aria-label="Navegación principal">
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Espacio de trabajo</p>
              <button className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2 text-sm font-medium"><MessageSquare className="size-4 text-primary" /> Conversaciones</button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"><FileText className="size-4" /> Prompts guardados</button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground"><BarChart3 className="size-4" /> Uso y facturación</button>
            </nav>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-2 pb-2"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recientes</p><button className="text-muted-foreground hover:text-foreground" aria-label="Buscar conversaciones"><Search className="size-3.5" /></button></div>
              {conversations.map((item) => <button key={item.title} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition ${item.active ? 'bg-sidebar-accent font-medium text-foreground' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'}`}><MessageSquare className="size-3.5 shrink-0 opacity-70" /><span className="truncate">{item.title}</span></button>)}
            </div>
          </div>
          <div className="border-t p-3">
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-sidebar-accent"><div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">MR</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">María Ríos</p><p className="truncate text-xs text-muted-foreground">Plan Pro</p></div><Settings2 className="size-4 text-muted-foreground" /></button>
          </div>
        </aside>

        {mobileMenu && <button className="fixed inset-0 z-10 bg-black/20 lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Cerrar menú" />}

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[72px] items-center justify-between border-b px-4 sm:px-8">
            <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileMenu(true)} aria-label="Abrir menú"><Menu className="size-5" /></button><div><p className="text-xs text-muted-foreground">Conversación</p><h1 className="text-sm font-semibold">Optimización de consultas SQL</h1></div></div>
            <div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs text-muted-foreground transition hover:bg-muted sm:flex"><Command className="size-3.5" /> Buscar <span className="rounded border px-1.5 py-0.5 text-[10px]">⌘ K</span></button><button className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Más opciones"><MoreHorizontal className="size-4" /></button></div>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-8 sm:py-10">
              <div className="mb-8 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></div><div><p className="text-sm font-semibold">Lumen AI</p><p className="text-xs text-muted-foreground">Claude 3.5 Sonnet · hace 2 min</p></div></div>
              <div className="flex flex-col gap-8">
                <div className="flex gap-3"><div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Sparkles className="size-3.5" /></div><div className="min-w-0 flex-1 text-[14px] leading-7"><p>Claro. He revisado el esquema y encontré tres oportunidades para reducir la latencia de las consultas más frecuentes:</p><ol className="mt-3 flex flex-col gap-2 pl-5 text-muted-foreground"><li><span className="font-medium text-foreground">Índice compuesto:</span> añadir un índice sobre <code className="rounded bg-muted px-1.5 py-0.5 text-[12px] text-foreground">(user_id, created_at)</code>.</li><li><span className="font-medium text-foreground">Paginación:</span> cambiar OFFSET por cursor para evitar escaneos innecesarios.</li><li><span className="font-medium text-foreground">Proyección:</span> seleccionar solo las columnas que necesita el cliente.</li></ol></div></div>
                <div className="flex justify-end"><div className="max-w-[82%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground">¿Puedes preparar la migración del índice compuesto y explicar cómo validar el impacto?</div></div>
                <div className="flex gap-3"><div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Sparkles className="size-3.5" /></div><div className="min-w-0 flex-1 text-[14px] leading-7"><p>Por supuesto. Te propongo una migración segura en dos fases:</p><div className="mt-3 overflow-hidden rounded-xl border bg-muted/40"><div className="flex items-center justify-between border-b px-4 py-2.5"><span className="text-xs font-medium text-muted-foreground">migration.sql</span><button className="text-xs text-muted-foreground hover:text-foreground">Copiar</button></div><pre className="overflow-x-auto p-4 text-[12px] leading-6 text-foreground"><code>{'CREATE INDEX CONCURRENTLY idx_events_user_date\nON events (user_id, created_at DESC);'}</code></pre></div><p className="mt-4">Después, compara el plan con <code className="rounded bg-muted px-1.5 py-0.5 text-[12px]">EXPLAIN ANALYZE</code> antes y después del cambio.</p></div></div>
                {sent && <div className="flex justify-end"><div className="max-w-[82%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground">Listo, continuemos con la validación.</div></div>}
              </div>
            </div>
            <div className="mx-auto w-full max-w-3xl px-4 pb-5 sm:px-8 sm:pb-7"><form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-2 shadow-sm"><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe un mensaje..." rows={2} className="w-full resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" aria-label="Mensaje" /><div className="flex items-center justify-between px-2 pb-1"><div className="flex items-center gap-1"><button type="button" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Adjuntar archivo"><Plus className="size-4" /></button><button type="button" className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted">Claude 3.5 Sonnet <ChevronDown className="ml-1 inline size-3" /></button></div><button type="submit" className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40" disabled={!message.trim()} aria-label="Enviar mensaje"><Send className="size-3.5" /></button></div></form><p className="mt-2 text-center text-[10px] text-muted-foreground">La IA puede cometer errores. Verifica la información importante.</p></div>
          </div>
        </section>

        <aside className="hidden w-[286px] shrink-0 border-l bg-muted/20 xl:flex xl:flex-col">
          <div className="border-b px-6 py-6"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Consumo de tokens</p><h2 className="mt-1 text-lg font-semibold tracking-tight">Este mes</h2></div><button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Ayuda"><CircleHelp className="size-4" /></button></div><div className="mt-6 flex items-end justify-between"><div><p className="text-3xl font-semibold tracking-tight">1.28M</p><p className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><TrendingUp className="size-3" /> 12.4% <span className="text-muted-foreground">vs. mes anterior</span></p></div><span className="rounded-full bg-accent px-2 py-1 text-[10px] font-medium text-accent-foreground">68% usado</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-border"><div className="h-full w-[68%] rounded-full bg-primary" /></div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>0</span><span>2M tokens</span></div></div>
          <div className="flex flex-col gap-6 p-6"><div><div className="mb-4 flex items-center justify-between"><h3 className="text-xs font-semibold">Actividad semanal</h3><button className="text-[10px] text-muted-foreground hover:text-foreground">Ver detalle</button></div><div className="flex h-28 items-end justify-between gap-2">{usage.map((item) => <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full rounded-t-sm transition hover:opacity-80 ${item.label === 'Jue' ? 'bg-primary' : 'bg-primary/15'}`} style={{ height: `${item.value}%` }} /><span className="text-[10px] text-muted-foreground">{item.label}</span></div>)}</div></div><div className="rounded-xl border bg-card p-4"><div className="flex items-center gap-2"><div className="flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground"><Hash className="size-3.5" /></div><div><p className="text-xs font-medium">Esta conversación</p><p className="text-[11px] text-muted-foreground">4,820 tokens</p></div></div><div className="mt-4 flex items-end justify-between"><span className="text-2xl font-semibold">0.24%</span><span className="text-[10px] text-muted-foreground">del total</span></div></div><div><h3 className="mb-3 text-xs font-semibold">Por modelo</h3><div className="flex flex-col gap-3"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Claude 3.5 Sonnet</span><span className="font-medium">782K</span></div><div className="h-1.5 rounded-full bg-border"><div className="h-full w-[61%] rounded-full bg-primary/70" /></div><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">GPT-4o mini</span><span className="font-medium">498K</span></div><div className="h-1.5 rounded-full bg-border"><div className="h-full w-[39%] rounded-full bg-primary/30" /></div></div></div></div>
        </aside>
      </div>
    </main>
  )
}
