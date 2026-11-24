import { RocketLaunchIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { IconFrame } from '@tc96/ui/icon-frame'
import { List } from '@tc96/ui/patterns/list/composition/list/list'
import { cn } from '@tc96/utils'
import { useId } from 'react'
import { defaultEmptyState3Labels } from './labels'
import type { EmptyState3Props } from './types'

export function EmptyState3({
  className,
  icon,
  labels: labelsProp,
  onCreate,
  onImport,
  onTemplate,
  templates = [],
}: Readonly<EmptyState3Props>) {
  const labels = { ...defaultEmptyState3Labels, ...labelsProp }
  const templatesId = useId()

  return (
    <section
      aria-label={labels.title}
      className={cn('flex', className)}
      data-slot="empty-state-3"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <IconFrame shape="rounded" size="xl">
              {icon ?? <RocketLaunchIcon aria-hidden="true" />}
            </IconFrame>
          </EmptyMedia>
          <EmptyTitle>{labels.title}</EmptyTitle>
          <EmptyDescription>{labels.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-md">
          {onCreate || onImport ? (
            <div className="flex flex-wrap justify-center gap-2">
              {onCreate ? (
                <Button onClick={onCreate} size="sm" type="button">
                  {labels.create}
                </Button>
              ) : null}
              {onImport ? (
                <Button
                  onClick={onImport}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {labels.import}
                </Button>
              ) : null}
            </div>
          ) : null}
          {templates.length > 0 ? (
            <div className="grid w-full gap-2 text-start">
              <p className="text-muted-foreground text-xs" id={templatesId}>
                {labels.templates}
              </p>
              <ul
                aria-labelledby={templatesId}
                className="grid list-none gap-2"
              >
                {templates.map((template) => (
                  <li data-template={template.id} key={template.id}>
                    <List
                      description={template.description}
                      icon={
                        template.icon ?? <SquaresFourIcon aria-hidden="true" />
                      }
                      render={
                        <button
                          onClick={() => onTemplate?.(template.id)}
                          type="button"
                        />
                      }
                      title={template.title}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </EmptyContent>
      </Empty>
    </section>
  )
}
