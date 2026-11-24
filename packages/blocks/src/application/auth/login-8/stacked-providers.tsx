'use client'

import { Button } from '@tc96/ui/button'
import { Separator } from '@tc96/ui/separator'
import type { ReactElement } from 'react'
import type { AuthCommonLabels, AuthProvider } from '../shared/types'

export interface StackedProvidersProps {
  labels: Pick<
    AuthCommonLabels,
    'providerContinue' | 'providersGroup' | 'providersSeparator'
  >
  onSelect?: (id: string) => void
  pending?: boolean
  providers?: readonly AuthProvider[]
}

export function StackedProviders({
  labels,
  onSelect,
  pending = false,
  providers,
}: Readonly<StackedProvidersProps>): ReactElement | null {
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
      <fieldset className="grid min-w-0 gap-2">
        <legend className="sr-only">{labels.providersGroup}</legend>
        {providers.map((provider) => (
          <Button
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
            {labels.providerContinue(provider.label)}
          </Button>
        ))}
      </fieldset>
    </div>
  )
}
