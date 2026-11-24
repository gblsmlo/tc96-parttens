'use client'

import { type ReactElement, useCallback, useState } from 'react'
import type { RecordStatusListProps } from '../../core'
import { recordStatusListClassName } from '../../lib/variants'
import { RecordStatusListContext } from '../../store/status-list-context'

export function RecordStatusList({
  children,
  className,
  label,
}: Readonly<RecordStatusListProps>): ReactElement {
  const [message, setMessage] = useState('')
  const announce = useCallback((next: string) => setMessage(next), [])

  return (
    <RecordStatusListContext.Provider value={announce}>
      <div className={className} data-slot="record-status-list">
        <ul aria-label={label} className={recordStatusListClassName}>
          {children}
        </ul>
        <p
          aria-live="polite"
          className="sr-only"
          data-slot="record-status-list-announcer"
        >
          {message}
        </p>
      </div>
    </RecordStatusListContext.Provider>
  )
}
