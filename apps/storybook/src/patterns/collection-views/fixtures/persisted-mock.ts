import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

const STORAGE_PREFIX = 'tc96-parttens:mock:v1:'

function readStored<TValue>(key: string, fallback: TValue): TValue {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as TValue)
  } catch {
    return fallback
  }
}

export function usePersistedState<TValue>(
  key: string,
  initial: TValue | (() => TValue),
): [TValue, Dispatch<SetStateAction<TValue>>] {
  const [value, setValue] = useState<TValue>(() =>
    readStored(
      key,
      typeof initial === 'function' ? (initial as () => TValue)() : initial,
    ),
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch {
      return
    }
  }, [key, value])

  return [value, setValue]
}

export function resetPersistedMock() {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key)
    }
  } catch {
    return
  }
}

export function useSimulatedFetch(delayMs: number): boolean {
  const [pending, setPending] = useState(delayMs > 0)

  useEffect(() => {
    const timer = setTimeout(() => setPending(false), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  return pending
}
