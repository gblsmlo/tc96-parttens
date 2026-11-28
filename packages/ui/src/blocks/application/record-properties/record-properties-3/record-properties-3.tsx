import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import { useMemo } from 'react'
import { defaultRecordProperties3Catalog } from './catalog'
import { resolveRecordProperties3Labels } from './labels'
import type {
  RecordProperties3Catalog,
  RecordProperties3DefaultKey,
  RecordProperties3Item,
  RecordProperties3Props,
} from './types'

function resolveItem<TKey extends string>(
  item: RecordProperties3Item<TKey>,
  catalog: RecordProperties3Catalog<TKey>,
) {
  const entry =
    item.catalogKey === undefined ? undefined : catalog[item.catalogKey]
  return {
    icon: item.icon === null ? undefined : (item.icon ?? entry?.icon),
    label: item.label ?? entry?.label ?? item.id,
  }
}

export function RecordProperties3<
  TKey extends string = RecordProperties3DefaultKey,
>({
  ariaLabel,
  catalog = defaultRecordProperties3Catalog as RecordProperties3Catalog<TKey>,
  className,
  items,
  labels: labelsProp,
}: Readonly<RecordProperties3Props<TKey>>) {
  const labels = useMemo(
    () => resolveRecordProperties3Labels(labelsProp),
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
          const { icon: Icon, label } = resolveItem(item, catalog)
          return (
            <RecordGroupRow
              key={item.id}
              label={label}
              leading={Icon ? <Icon aria-hidden="true" /> : undefined}
            >
              {item.pending ? (
                <output
                  aria-busy="true"
                  aria-label={labels.loadingValue(label)}
                  className="flex h-6 items-center"
                  data-slot="record-properties-pending"
                >
                  <Skeleton className="h-6 w-24" />
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
