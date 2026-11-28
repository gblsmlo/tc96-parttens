'use client'

import { FileTextIcon, type Icon, ReceiptIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupLink } from '@tc96/ui/patterns/records/group/composition/record-group-link/record-group-link'
import { useMemo } from 'react'
import { defaultRecordGroup6Catalog } from './catalog'
import { resolveRecordGroup6Labels } from './labels'
import type {
  RecordGroup6LinkKind,
  RecordGroup6Props,
  RecordGroup6StatusTone,
} from './types'

const linkIcons: Record<RecordGroup6LinkKind, Icon> = {
  file: FileTextIcon,
  record: ReceiptIcon,
}

const badgeVariants = {
  danger: 'error',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<RecordGroup6StatusTone, string>

export function RecordGroup6({
  catalog = defaultRecordGroup6Catalog,
  className,
  labels: labelsProp,
  links,
}: Readonly<RecordGroup6Props>) {
  const labels = useMemo(
    () => resolveRecordGroup6Labels(labelsProp),
    [labelsProp],
  )

  return (
    <RecordGroup
      className={className}
      empty={links.length === 0}
      title={labels.title}
      variant="plain"
    >
      {links.length === 0 ? (
        <p className="text-muted-foreground text-sm">{labels.empty}</p>
      ) : (
        links.map(({ href, id, kind, label, meta, status }) => {
          const LinkIcon = linkIcons[kind]
          const statusMeta = status ? catalog.status[status] : undefined
          return (
            <RecordGroupLink
              href={href}
              key={id}
              leading={<LinkIcon aria-hidden />}
              meta={
                statusMeta || meta ? (
                  <span className="flex items-center gap-2">
                    {statusMeta ? (
                      <Badge variant={badgeVariants[statusMeta.tone]}>
                        {statusMeta.label}
                      </Badge>
                    ) : null}
                    {meta}
                  </span>
                ) : undefined
              }
            >
              {label}
            </RecordGroupLink>
          )
        })
      )}
    </RecordGroup>
  )
}
