'use client'

import type { ReactElement } from 'react'
import { resolveAuthLabels } from '../shared/labels'
import { defaultLogin8Labels } from './labels'
import { MagicLinkForm } from './magic-link-form'
import type { Login8Props } from './types'

export function Login8({
  error,
  fieldErrors,
  labels: labelsProp,
  logo,
  media,
  onProviderSelect,
  onSubmit,
  pending = false,
  providers,
}: Readonly<Login8Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin8Labels, labelsProp)
  return (
    <main className="grid min-h-svh gap-4 p-4 sm:p-6 md:grid-cols-2">
      {media ? (
        <div className="hidden overflow-hidden rounded-xl border md:flex">
          {media}
        </div>
      ) : null}
      <div className="flex items-center justify-center md:col-start-2">
        <MagicLinkForm
          error={error}
          fieldErrors={fieldErrors}
          labels={labels}
          logo={logo}
          onProviderSelect={onProviderSelect}
          onSubmit={onSubmit}
          pending={pending}
          providers={providers}
        />
      </div>
    </main>
  )
}
