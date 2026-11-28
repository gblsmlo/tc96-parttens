import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import { useMemo } from 'react'
import { defaultRecordProperties2Catalog } from './catalog'
import { resolveRecordProperties2Labels } from './labels'
import type {
  RecordProperties2Catalog,
  RecordProperties2DefaultKey,
  RecordProperties2Item,
  RecordProperties2Props,
} from './types'

function labelOf<TKey extends string>(
  item: RecordProperties2Item<TKey>,
  catalog: RecordProperties2Catalog<TKey>,
) {
  const entry =
    item.catalogKey === undefined ? undefined : catalog[item.catalogKey]
  return item.label ?? entry?.label ?? item.id
}

export function RecordProperties2<
  TKey extends string = RecordProperties2DefaultKey,
>({
  ariaLabel,
  catalog = defaultRecordProperties2Catalog as RecordProperties2Catalog<TKey>,
  className,
  items,
  labels: labelsProp,
}: Readonly<RecordProperties2Props<TKey>>) {
  const labels = useMemo(
    () => resolveRecordProperties2Labels(labelsProp),
    [labelsProp],
  )
  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn('@container min-w-0', className)}
      data-slot="record-properties"
    >
      <div className="grid grid-cols-1 gap-x-8 @lg:grid-cols-2">
        {items.map((item) => {
          const label = labelOf(item, catalog)
          return (
            <RecordGroupRow key={item.id} label={label}>
              {item.pending ? (
                <output
                  aria-busy="true"
                  aria-label={labels.loadingValue(label)}
                  className="flex h-6 items-center"
                  data-slot="record-properties-pending"
                >
                  <Skeleton className="h-4 w-24" />
                </output>
              ) : (
                item.render()
              )}
            </RecordGroupRow>
          )
        })}
      </div>
    </fieldset>
  )
}
