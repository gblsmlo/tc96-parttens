import {
  KanbanCard,
  KanbanCardBody,
  KanbanCardDescription,
  KanbanCardField,
  KanbanCardFieldLabel,
  KanbanCardFieldValue,
  KanbanCardFooter,
  KanbanCardHeader,
  KanbanCardOpenTrigger,
  KanbanCardTitle,
} from '@tc96/ui/patterns/collection/layouts/kanban/components/kanban-card'
import {
  ListRow,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowTitle,
  ListRowTitleTrigger,
  ListRowTrailing,
} from '@tc96/ui/patterns/collection/layouts/list/components/list-row'
import { Fragment, type ReactNode } from 'react'

export function LegalCaption({
  parts,
}: Readonly<{ parts: readonly string[] }>) {
  return parts.map((part, index) => (
    <Fragment key={`${index}-${part}`}>
      {index > 0 ? <span aria-hidden="true"> · </span> : null}
      <span>{part}</span>
    </Fragment>
  ))
}

export function LegalTitleCell({
  caption,
  title,
}: Readonly<{ caption: readonly string[]; title: string }>) {
  return (
    <span className="grid min-w-56 max-w-80 gap-0.5">
      <span className="truncate font-medium">{title}</span>
      <span className="truncate text-muted-foreground text-xs tabular-nums">
        <LegalCaption parts={caption} />
      </span>
    </span>
  )
}

export interface LegalListRowProps {
  caption: readonly string[]
  fields: ReactNode
  onOpen?: () => void
  title: string
}

export function LegalListRow({
  caption,
  fields,
  onOpen,
  title,
}: Readonly<LegalListRowProps>) {
  return (
    <ListRow interactive={Boolean(onOpen)}>
      <ListRowBody>
        <ListRowTitle>
          {onOpen ? (
            <ListRowTitleTrigger onClick={onOpen}>{title}</ListRowTitleTrigger>
          ) : (
            title
          )}
        </ListRowTitle>
        <ListRowDescription className="tabular-nums">
          <LegalCaption parts={caption} />
        </ListRowDescription>
      </ListRowBody>
      <ListRowTrailing>
        <ListRowField always className="gap-2">
          {fields}
        </ListRowField>
      </ListRowTrailing>
    </ListRow>
  )
}

export interface LegalKanbanField {
  id: string
  interactive?: boolean
  label: string
  value: ReactNode
}

export interface LegalKanbanCardProps {
  caption: readonly string[]
  fields: readonly LegalKanbanField[]
  footer?: ReactNode
  onOpen?: () => void
  openLabel?: string
  title: string
}

export function LegalKanbanCard({
  caption,
  fields,
  footer,
  onOpen,
  openLabel,
  title,
}: Readonly<LegalKanbanCardProps>) {
  return (
    <KanbanCard density="sm" variant={onOpen ? 'interactive' : 'default'}>
      {onOpen ? (
        <KanbanCardOpenTrigger aria-label={openLabel} onClick={onOpen} />
      ) : null}
      <KanbanCardHeader>
        <KanbanCardTitle className="min-w-0 truncate">{title}</KanbanCardTitle>
        <KanbanCardDescription className="truncate tabular-nums">
          <LegalCaption parts={caption} />
        </KanbanCardDescription>
      </KanbanCardHeader>
      <KanbanCardBody>
        {fields.map((field) => (
          <KanbanCardField key={field.id}>
            <KanbanCardFieldLabel>{field.label}</KanbanCardFieldLabel>
            <KanbanCardFieldValue interactive={field.interactive}>
              {field.value}
            </KanbanCardFieldValue>
          </KanbanCardField>
        ))}
      </KanbanCardBody>
      {footer ? <KanbanCardFooter>{footer}</KanbanCardFooter> : null}
    </KanbanCard>
  )
}
