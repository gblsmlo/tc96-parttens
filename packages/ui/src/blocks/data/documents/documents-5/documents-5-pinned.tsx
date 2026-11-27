import { PushPinIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Card, CardDescription, CardTitle } from '@tc96/ui/card'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@tc96/ui/tooltip'
import { useId } from 'react'
import { DataCollectionCaption } from '../../shared/collection/data-collection-record-parts'
import {
  type Documents5FieldContext,
  Documents5TypeIcon,
  formatDocuments5Updated,
} from './documents-5-fields'
import { documents5OpenTrigger } from './documents-5-records'
import type { Documents5Record } from './types'

export interface Documents5PinnedProps {
  context: Documents5FieldContext
  records: readonly Documents5Record[]
}

export function Documents5Pinned({
  context,
  records,
}: Readonly<Documents5PinnedProps>) {
  const headingId = useId()
  const { labels, locale, onOpen, onPinnedChange, timeZone } = context
  if (records.length === 0) return null

  return (
    <section
      aria-labelledby={headingId}
      className="grid min-w-0 gap-2"
      data-slot="documents-5-pinned"
    >
      <h2 className="font-medium text-muted-foreground text-xs" id={headingId}>
        {labels.pinned}
      </h2>
      <ul className="flex min-w-0 gap-3 overflow-x-auto pb-1">
        {records.map((item) => (
          <Card
            className="w-64 shrink-0 flex-row items-center gap-3 p-3"
            data-slot="documents-5-pinned-item"
            key={item.id}
            render={<li />}
          >
            <Documents5TypeIcon context={context} item={item} size="sm" />
            <div className="grid min-w-0 flex-1 gap-0.5">
              <CardTitle
                className="truncate font-medium text-sm leading-5"
                render={(props) => <h3 {...props} />}
              >
                {onOpen ? (
                  <button
                    aria-label={labels.openRecord(item.name)}
                    className={documents5OpenTrigger}
                    onClick={() => onOpen(item.id)}
                    type="button"
                  >
                    {item.name}
                  </button>
                ) : (
                  item.name
                )}
              </CardTitle>
              <CardDescription className="truncate text-xs tabular-nums">
                <DataCollectionCaption
                  parts={[
                    labels.types[item.type],
                    formatDocuments5Updated(item.updatedAt, locale, timeZone),
                  ]}
                />
              </CardDescription>
            </div>
            {onPinnedChange ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={labels.unpinRecord(item.name)}
                      className="relative z-10"
                      onClick={() => onPinnedChange(item.id, false)}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    />
                  }
                >
                  <PushPinIcon aria-hidden="true" weight="fill" />
                </TooltipTrigger>
                <TooltipPopup>{labels.unpin}</TooltipPopup>
              </Tooltip>
            ) : null}
          </Card>
        ))}
      </ul>
    </section>
  )
}
