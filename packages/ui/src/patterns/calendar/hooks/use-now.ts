import { useEffect, useState } from 'react'

/**
 * Instante corrente para a linha "agora" e o destaque de hoje. Controlado pelo
 * consumidor quando fornecido (stories e testes precisam de fixture estável);
 * sem controle, avança por conta própria a cada minuto.
 */
export function useNow(controlled?: Date): Date {
  const [now, setNow] = useState(() => controlled ?? new Date())

  useEffect(() => {
    if (controlled) return

    const interval = setInterval(() => setNow(new Date()), 60_000)

    return () => clearInterval(interval)
  }, [controlled])

  return controlled ?? now
}
