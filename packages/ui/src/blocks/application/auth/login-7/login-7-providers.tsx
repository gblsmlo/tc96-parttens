'use client'

import { Button } from '@tc96/ui/button'
import { Separator } from '@tc96/ui/separator'
import type { ReactElement } from 'react'
import type { AuthCommonLabels, AuthProvider } from '../shared/types'

export interface Login7ProvidersProps {
  labels: Pick<
    AuthCommonLabels,
    'providerContinue' | 'providersGroup' | 'providersSeparator'
  >
  onSelect?: (id: string) => void
  pending?: boolean
  providers?: readonly AuthProvider[]
}

function providerGridClass(count: number): string {
  if (count >= 3) return 'grid min-w-0 gap-2 sm:grid-cols-3'
  if (count === 2) return 'grid min-w-0 gap-2 sm:grid-cols-2'
  return 'grid min-w-0 gap-2'
}

export function Login7Providers({
  labels,
  onSelect,
  pending = false,
  providers,
}: Readonly<Login7ProvidersProps>): ReactElement | null {
  if (!providers?.length) return null
  return (
    <div className="flex flex-col gap-4">
      <div
        aria-hidden="true"
        className="flex items-center gap-3 text-muted-foreground text-xs"
      >
        <div className="flex-1">
          <Separator />
        </div>
        <span>{labels.providersSeparator}</span>
        <div className="flex-1">
          <Separator />
        </div>
      </div>
      <fieldset className={providerGridClass(providers.length)}>
        <legend className="sr-only">{labels.providersGroup}</legend>
        {providers.map((provider) => (
          <Button
            aria-label={labels.providerContinue(provider.label)}
            className="w-full"
            disabled={pending}
            key={provider.id}
            onClick={() => {
              if (!pending) onSelect?.(provider.id)
            }}
            type="button"
            variant="secondary"
          >
            {provider.icon}
            {provider.label}
          </Button>
        ))}
      </fieldset>
    </div>
  )
}
