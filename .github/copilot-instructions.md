# Instrucciones del proyecto

## Stack y convenciones
- App web con Next.js App Router, React 19, TypeScript estricto y Tailwind CSS.
- Mantén la interfaz y los mensajes en español. Reutiliza dependencias y estilos ya presentes; no agregues SDKs de Groq ni librerías de envoltorio HTTP.
- Los componentes que usan estado o efectos del navegador deben ser Client Components. Mantén las claves y llamadas externas en el servidor.

## Chat con Groq
- La interfaz administra con `useState` el texto, la conversación, la carga, los errores y las métricas de tokens.
- Envía el historial completo y ordenado de mensajes (`user` y `assistant`) en cada turno, incluyendo el nuevo mensaje del usuario.
- La llamada a Groq se realiza en una ruta del servidor de Next.js mediante `fetch` y `async`/`await`. Configura manualmente `Authorization: Bearer ${process.env.GROQ_API_KEY}` y `Content-Type: application/json` en cada petición.
- Usa un modelo Llama 3 disponible en Groq. No expongas `GROQ_API_KEY` al navegador ni uses variables `NEXT_PUBLIC_` para secretos.
- Comprueba respuestas no exitosas y devuelve errores legibles y en español; no muestres detalles internos del proveedor.
- Lee `usage.prompt_tokens` y `usage.completion_tokens` de la respuesta, acumula ambos y muestra también el total y una métrica adicional, como el nombre del modelo.

## Estado y persistencia
- Usa `useEffect` para hidratar la conversación desde `localStorage` al montar y sincronizar los cambios posteriores. Evita acceder a `localStorage` durante el renderizado del servidor.
- El botón «Borrar conversación» debe vaciar el estado de conversación y métricas y limpiar la persistencia local.
- Usa `useEffect` para coordinar el estado visible de «Pensando...» con la petición en curso y limpia temporizadores/recursos al desmontar cuando corresponda.

## Validación
- Ejecuta `pnpm exec tsc --noEmit` después de cambios de TypeScript.
- No guardes secretos ni agregues archivos `.env` con claves reales al repositorio. Para desarrollo local, configura `GROQ_API_KEY` en `.env.local`.
