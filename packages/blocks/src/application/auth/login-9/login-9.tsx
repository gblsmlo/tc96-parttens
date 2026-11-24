'use client'

import type { ReactElement } from 'react'
import { resolveAuthLabels } from '../shared/labels'
import { defaultLogin9Labels } from './labels'
import { MagicLinkForm } from './magic-link-form'
import { TestimonialAside } from './testimonial-aside'
import type { Login9Props } from './types'

export function Login9({
  brands,
  brandsLabel,
  error,
  fieldErrors,
  labels: labelsProp,
  logo,
  onProviderSelect,
  onSubmit,
  pending = false,
  providers,
  testimonial,
}: Readonly<Login9Props>): ReactElement {
  const labels = resolveAuthLabels(defaultLogin9Labels, labelsProp)
  const hasAside = Boolean(testimonial || brands || brandsLabel)
  return (
    <div
      className={hasAside ? 'grid min-h-svh md:grid-cols-2' : 'grid min-h-svh'}
    >
      <main className="flex items-center justify-center p-4 sm:p-6">
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
      </main>
      {hasAside ? (
        <TestimonialAside
          brands={brands}
          brandsLabel={brandsLabel}
          label={labels.asideLabel}
          ratingLabel={labels.rating}
          testimonial={testimonial}
        />
      ) : null}
    </div>
  )
}
