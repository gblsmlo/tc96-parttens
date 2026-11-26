import { PushPinSlashIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Card, CardDescription, CardTitle } from '@tc96/ui/card'
import { useId } from 'react'
import { DataCollectionCaption } from '../../shared/collection/data-collection-record-parts'
import {
  type Documents2FieldContext,
  Documents2TypeIcon,
  formatDocuments2Updated,
} from './documents-2-fields'
import { documents2OpenTrigger } from './documents-2-records'
import type { Documents2Record } from './types'

export interface Documents2PinnedProps {
  context: Documents2FieldContext
  records: readonly Documents2Record[]
}

export function Documents2Pinned({
  context,
  records,
}: Readonly<Documents2PinnedProps>) {
  const headingId = useId()
  const { labels, locale, onOpen, onPinnedChange, timeZone } = context
  if (records.length === 0) return null

  return (
    <section
      aria-labelledby={headingId}
      className="grid min-w-0 gap-2"
      data-slot="documents-2-pinned"
    >
      <h2 className="font-medium text-muted-foreground text-xs" id={headingId}>
        {labels.pinned}
      </h2>
      <ul className="flex min-w-0 gap-3 overflow-x-auto pb-1">
        {records.map((item) => (
          <Card
            className="w-64 shrink-0 flex-row items-center gap-3 p-3"
            data-slot="documents-2-pinned-item"
            key={item.id}
            render={<li />}
          >
            <Documents2TypeIcon context={context} item={item} size="sm" />
            <div className="grid min-w-0 flex-1 gap-0.5">
              <CardTitle
                className="truncate font-medium text-sm leading-5"
                render={(props) => <h3 {...props} />}
              >
                {onOpen ? (
                  <button
                    aria-label={labels.openRecord(item.name)}
                    className={documents2OpenTrigger}
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
                    formatDocuments2Updated(item.updatedAt, locale, timeZone),
                  ]}
                />
              </CardDescription>
            </div>
            {onPinnedChange ? (
              <Button
                aria-label={labels.unpinRecord(item.name)}
                className="relative z-10"
                onClick={() => onPinnedChange(item.id, false)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <PushPinSlashIcon aria-hidden="true" />
              </Button>
            ) : null}
          </Card>
        ))}
      </ul>
    </section>
  )
}
