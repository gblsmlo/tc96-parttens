'use client'

import type { Updater } from '@tanstack/react-table'
import { useRef, useState } from 'react'
import { useLatestCallback } from './use-latest-callback'

export function useControllableTableState<TValue>(
  controlled: TValue | undefined,
  initial: () => TValue,
  onChange: ((value: TValue) => void) | undefined,
): [TValue, (updater: Updater<TValue>) => void] {
  const [uncontrolled, setUncontrolled] = useState<TValue>(initial)
  const value = controlled ?? uncontrolled
  const valueRef = useRef(value)
  valueRef.current = value
  const handleChange = useLatestCallback((updater: Updater<TValue>) => {
    const next =
      typeof updater === 'function'
        ? (updater as (previous: TValue) => TValue)(valueRef.current)
        : updater
    if (controlled === undefined) {
      valueRef.current = next
      setUncontrolled(next)
    }
    onChange?.(next)
  })
  return [value, handleChange]
}
