import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export function useControllable<TValue>(
  controlled: TValue | undefined,
  initial: TValue,
  onChange: ((value: TValue) => void) | undefined,
): [TValue, (value: TValue) => void] {
  const [local, setLocal] = useState(initial)
  const value = controlled === undefined ? local : controlled
  const setValue = useCallback(
    (next: TValue) => {
      setLocal(next)
      onChange?.(next)
    },
    [onChange],
  )
  return [value, setValue]
}

export function useStableHandler<TArgs extends unknown[]>(
  handler: ((...args: TArgs) => void) | undefined,
): ((...args: TArgs) => void) | undefined {
  const ref = useRef(handler)
  useLayoutEffect(() => {
    ref.current = handler
  })
  const stable = useCallback((...args: TArgs) => ref.current?.(...args), [])
  return handler ? stable : undefined
}
