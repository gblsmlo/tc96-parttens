import { StarIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import type { ReactElement, ReactNode } from 'react'
import type { Login9Testimonial } from './types'

const starPositions = [1, 2, 3, 4, 5]

export interface TestimonialAsideProps {
  brands?: ReactNode
  brandsLabel?: string
  label: string
  ratingLabel: (stars: number) => string
  testimonial?: Login9Testimonial
}

export function TestimonialAside({
  brands,
  brandsLabel,
  label,
  ratingLabel,
  testimonial,
}: Readonly<TestimonialAsideProps>): ReactElement {
  const stars = Math.max(0, Math.min(5, Math.round(testimonial?.rating ?? 0)))
  return (
    <aside
      aria-label={label}
      className="hidden flex-col justify-between gap-10 bg-muted p-10 md:flex"
    >
      {testimonial ? (
        <figure className="my-auto flex max-w-lg flex-col gap-6">
          {stars ? (
            <div
              aria-label={ratingLabel(stars)}
              className="flex gap-1 text-foreground"
              role="img"
            >
              {starPositions.slice(0, stars).map((position) => (
                <StarIcon
                  aria-hidden
                  className="size-5"
                  key={position}
                  weight="fill"
                />
              ))}
            </div>
          ) : null}
          <blockquote className="font-medium text-xl">
            {testimonial.quote}
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <Avatar>
              {testimonial.author.avatarSrc ? (
                <AvatarImage alt="" src={testimonial.author.avatarSrc} />
              ) : null}
              <AvatarFallback>
                {testimonial.author.avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-medium">{testimonial.author.name}</span>
              {testimonial.author.role ? (
                <span className="text-muted-foreground">
                  {testimonial.author.role}
                </span>
              ) : null}
            </div>
          </figcaption>
        </figure>
      ) : null}
      {brandsLabel || brands ? (
        <div className="flex flex-col gap-4">
          {brandsLabel ? (
            <p className="text-muted-foreground text-sm">{brandsLabel}</p>
          ) : null}
          {brands ? (
            <div className="flex flex-wrap items-center gap-6">{brands}</div>
          ) : null}
        </div>
      ) : null}
    </aside>
  )
}
