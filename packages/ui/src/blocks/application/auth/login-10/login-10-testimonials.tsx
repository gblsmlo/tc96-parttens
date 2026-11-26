'use client'

import { cn } from '@tc96/utils'
import { type ReactElement, useState } from 'react'
import type { Login10Labels, Login10Testimonial } from './types'

export interface Login10TestimonialsProps {
  labels: Pick<Login10Labels, 'showTestimonial' | 'testimonials'>
  testimonials: readonly Login10Testimonial[]
}

export function Login10Testimonials({
  labels,
  testimonials,
}: Readonly<Login10TestimonialsProps>): ReactElement {
  const [active, setActive] = useState(0)
  const current = Math.min(active, testimonials.length - 1)
  return (
    <section
      aria-label={labels.testimonials}
      aria-roledescription="carousel"
      className="flex flex-col gap-6"
    >
      <div className="overflow-hidden">
        <div
          className="flex gap-4 motion-safe:transition-transform motion-safe:duration-500"
          data-slot="login-10-track"
          style={{
            transform: `translateX(calc(12.5% - ${current} * (75% + 1rem)))`,
          }}
        >
          {testimonials.map((testimonial, index) => {
            const isActive = index === current
            return (
              <figure
                aria-hidden={isActive ? undefined : true}
                className={cn(
                  'flex w-3/4 shrink-0 flex-col gap-4 rounded-xl bg-background p-6 shadow-(shadow:--card-shadow) motion-safe:transition-opacity motion-safe:duration-500',
                  !isActive && 'opacity-40',
                )}
                data-active={isActive ? '' : undefined}
                inert={!isActive}
                key={`${testimonial.name}-${testimonial.quote}`}
              >
                <blockquote className="text-base">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  {testimonial.avatar}
                  <span className="flex flex-col">
                    <span className="font-medium text-sm">
                      {testimonial.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
      {testimonials.length > 1 ? (
        <div className="flex justify-center gap-1">
          {testimonials.map((testimonial, index) => (
            <button
              aria-label={labels.showTestimonial(testimonial.name)}
              aria-pressed={index === current}
              className="group flex size-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              key={`${testimonial.name}-${testimonial.quote}`}
              onClick={() => setActive(index)}
              type="button"
            >
              <span className="size-2 rounded-full bg-foreground/25 group-aria-pressed:bg-foreground" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
