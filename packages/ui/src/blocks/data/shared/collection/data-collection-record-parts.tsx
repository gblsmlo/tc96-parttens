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
} from '@tc96/ui/patterns/kanban-card/components/kanban-card'
import {
  ListRow,
  ListRowAction,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowHeader,
  ListRowLeading,
  ListRowTitle,
  ListRowTitleTrigger,
  ListRowTrailing,
} from '@tc96/ui/patterns/list-view/components/list-row'
import { Fragment, type ReactNode } from 'react'

export function DataCollectionCaption({
  parts,
}: Readonly<{ parts: readonly string[] }>) {
  return parts.map((part, index) => (
    <Fragment key={`${index}-${part}`}>
      {index > 0 ? <span aria-hidden="true"> · </span> : null}
      <span>{part}</span>
    </Fragment>
  ))
}

export function DataCollectionTitleCell({
  caption,
  title,
}: Readonly<{ caption?: readonly string[]; title: string }>) {
  return (
    <span className="grid min-w-56 max-w-80 gap-0.5">
      <span className="truncate font-medium">{title}</span>
      {caption?.length ? (
        <span className="truncate text-muted-foreground text-xs tabular-nums">
          <DataCollectionCaption parts={caption} />
        </span>
      ) : null}
    </span>
  )
}

export interface DataCollectionListRowProps {
  actions?: ReactNode
  caption?: readonly string[]
  fields?: ReactNode
  icon?: ReactNode
  mark?: ReactNode
  onOpen?: () => void
  openLabel?: string
  title: string
}

export function DataCollectionListRow({
  actions,
  caption,
  fields,
  icon,
  mark,
  onOpen,
  openLabel,
  title,
}: Readonly<DataCollectionListRowProps>) {
  const heading = (
    <ListRowTitle>
      {onOpen ? (
        <ListRowTitleTrigger aria-label={openLabel} onClick={onOpen}>
          {title}
        </ListRowTitleTrigger>
      ) : (
        title
      )}
    </ListRowTitle>
  )

  return (
    <ListRow interactive={Boolean(onOpen)}>
      {icon ? <ListRowLeading>{icon}</ListRowLeading> : null}
      <ListRowBody>
        {mark ? (
          <ListRowHeader>
            {heading}
            <span className="flex shrink-0 items-center gap-2">{mark}</span>
          </ListRowHeader>
        ) : (
          heading
        )}
        {caption?.length ? (
          <ListRowDescription className="tabular-nums">
            <DataCollectionCaption parts={caption} />
          </ListRowDescription>
        ) : null}
      </ListRowBody>
      {fields || actions ? (
        <ListRowTrailing>
          {fields ? (
            <ListRowField always className="gap-2">
              {fields}
            </ListRowField>
          ) : null}
          {actions ? (
            <ListRowAction className="gap-1">{actions}</ListRowAction>
          ) : null}
        </ListRowTrailing>
      ) : null}
    </ListRow>
  )
}

export interface DataCollectionKanbanField {
  id: string
  interactive?: boolean
  label: string
  value: ReactNode
}

export interface DataCollectionKanbanCardProps {
  caption: readonly string[]
  fields: readonly DataCollectionKanbanField[]
  footer?: ReactNode
  onOpen?: () => void
  openLabel?: string
  title: string
}

export function DataCollectionKanbanCard({
  caption,
  fields,
  footer,
  onOpen,
  openLabel,
  title,
}: Readonly<DataCollectionKanbanCardProps>) {
  return (
    <KanbanCard density="sm" variant={onOpen ? 'interactive' : 'default'}>
      {onOpen ? (
        <KanbanCardOpenTrigger aria-label={openLabel} onClick={onOpen} />
      ) : null}
      <KanbanCardHeader>
        <KanbanCardTitle className="min-w-0 truncate">{title}</KanbanCardTitle>
        <KanbanCardDescription className="truncate tabular-nums">
          <DataCollectionCaption parts={caption} />
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
