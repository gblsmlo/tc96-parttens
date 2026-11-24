import { UploadSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { renderAnchor } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import { cloneElement, type ReactElement, useId } from 'react'
import { defaultEmptyState1Labels } from './labels'
import type { EmptyState1Props } from './types'

const guideClassName =
  'text-sm underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function EmptyState1({
  className,
  guides = [],
  icon,
  labels: labelsProp,
  onCreate,
  onImport,
  renderLink = renderAnchor,
}: Readonly<EmptyState1Props>) {
  const labels = { ...defaultEmptyState1Labels, ...labelsProp }
  const guidesId = useId()

  return (
    <section
      aria-label={labels.title}
      className={cn('flex', className)}
      data-slot="empty-state-1"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {icon ?? <UploadSimpleIcon aria-hidden="true" />}
          </EmptyMedia>
          <EmptyTitle>{labels.title}</EmptyTitle>
          <EmptyDescription>{labels.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {onImport || onCreate ? (
            <div className="flex flex-wrap justify-center gap-2">
              {onImport ? (
                <Button onClick={onImport} size="sm" type="button">
                  {labels.import}
                </Button>
              ) : null}
              {onCreate ? (
                <Button
                  onClick={onCreate}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {labels.create}
                </Button>
              ) : null}
            </div>
          ) : null}
          {guides.length > 0 ? (
            <nav aria-labelledby={guidesId} className="grid gap-2">
              <p className="text-muted-foreground text-xs" id={guidesId}>
                {labels.guides}
              </p>
              <ul className="grid list-none gap-1">
                {guides.map((guide) => (
                  <li data-guide={guide.id} key={guide.id}>
                    {cloneElement(
                      renderLink(guide.href) as ReactElement<{
                        className: string
                      }>,
                      { className: guideClassName },
                      guide.title,
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </EmptyContent>
      </Empty>
    </section>
  )
}
