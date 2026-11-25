import { useState } from 'react'

export function useReadOnly(
  controlled: boolean | undefined,
  initial: boolean,
  onChange: ((readOnly: boolean) => void) | undefined,
) {
  const [inner, setInner] = useState(initial)
  const readOnly = controlled ?? inner

  const setReadOnly = (next: boolean) => {
    if (controlled === undefined) setInner(next)
    onChange?.(next)
  }

  return [readOnly, setReadOnly] as const
}
