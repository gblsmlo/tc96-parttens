import { Checkbox } from '@tc96/ui/checkbox'
import {
  ListRow,
  ListRowBody,
  ListRowDescription,
  ListRowField,
  ListRowHeader,
  ListRowLeading,
  ListRowOpenTrigger,
  ListRowSelect,
  ListRowTitle,
  ListRowTrailing,
} from '@tc96/ui/patterns/list-view/components/list-row'
import {
  ListViewHeader,
  ListViewHeaderCell,
} from '@tc96/ui/patterns/list-view/components/list-view-header'
import { cn } from '@tc96/utils'
import {
  DataCollectionCaption,
  DataCollectionKanbanCard,
} from '../../shared/collection/data-collection-record-parts'
import {
  Finance4AmountField,
  Finance4ClientField,
  Finance4DirectionMark,
  Finance4DueField,
  type Finance4FieldContext,
  Finance4KindField,
  Finance4ResponsibleField,
  Finance4SituationField,
  finance4CaseCaption,
} from './finance-4-fields'
import { finance4FieldWidth, finance4LeadingWidth } from './finance-4-options'
import type {
  Finance4Entry,
  Finance4Labels,
  Finance4Sort,
  Finance4SortColumn,
  Finance4SortDirection,
} from './types'

export interface Finance4ListHeaderSelection {
  checked: boolean
  indeterminate: boolean
  onCheckedChange: (checked: boolean) => void
}

export interface Finance4ListHeaderProps {
  labels: Finance4Labels
  onSort?: (column: Finance4SortColumn) => void
  selection?: Finance4ListHeaderSelection
  sort: Finance4Sort
  sortDirection: Finance4SortDirection
}

export function Finance4ListHeader({
  labels,
  onSort,
  selection,
  sort,
  sortDirection,
}: Readonly<Finance4ListHeaderProps>) {
  const sortable = (column: Finance4SortColumn) => {
    const direction = sort === column ? sortDirection : null
    return {
      onSort: onSort ? () => onSort(column) : undefined,
      sortDirection: direction,
      sortLabel: onSort ? labels.sortColumn(column, direction) : undefined,
    }
  }

  return (
    <ListViewHeader data-slot="finance-4-list-header">
      <ListViewHeaderCell
        always
        className={cn(finance4LeadingWidth, '-me-0.5 ps-1')}
      >
        {selection ? (
          <Checkbox
            aria-label={labels.selectAll}
            checked={selection.checked}
            indeterminate={selection.indeterminate}
            onCheckedChange={(checked) =>
              selection.onCheckedChange(checked === true)
            }
          />
        ) : null}
      </ListViewHeaderCell>
      <ListViewHeaderCell always className="flex-1">
        {labels.columns.description}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        className={finance4FieldWidth.client}
        {...sortable('client')}
      >
        {labels.columns.client}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={finance4FieldWidth.responsible}>
        {labels.columns.responsible}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        always
        className={finance4FieldWidth.due}
        {...sortable('due')}
      >
        {labels.columns.due}
      </ListViewHeaderCell>
      <ListViewHeaderCell
        always
        className={cn(finance4FieldWidth.amount, 'justify-end')}
        {...sortable('amount')}
      >
        {labels.columns.amount}
      </ListViewHeaderCell>
      <ListViewHeaderCell className={finance4FieldWidth.situation}>
        {labels.columns.situation}
      </ListViewHeaderCell>
    </ListViewHeader>
  )
}

export const renderFinance4ListRow =
  (context: Finance4FieldContext) => (entry: Finance4Entry) => {
    const { labels, onOpen, onSelectedChange, selectedIds } = context
    const selected = selectedIds.has(entry.id)
    const caption = finance4CaseCaption(context, entry)
    return (
      <ListRow
        data-slot="finance-4-row"
        interactive={Boolean(onOpen)}
        selected={selected}
      >
        <ListRowLeading className={cn(finance4LeadingWidth, '-me-0.5 ps-1')}>
          {onSelectedChange ? (
            <ListRowSelect
              aria-label={labels.selectEntry(entry.description)}
              checked={selected}
              onCheckedChange={(checked) =>
                onSelectedChange(entry.id, checked === true)
              }
            >
              <Finance4DirectionMark context={context} item={entry} />
            </ListRowSelect>
          ) : (
            <Finance4DirectionMark context={context} item={entry} />
          )}
        </ListRowLeading>
        <ListRowBody>
          <ListRowHeader>
            <ListRowTitle>
              {onOpen ? (
                <ListRowOpenTrigger
                  aria-label={labels.openEntry(entry.description)}
                  onClick={() => onOpen(entry.id)}
                >
                  {entry.description}
                </ListRowOpenTrigger>
              ) : (
                entry.description
              )}
            </ListRowTitle>
            <span className="hidden shrink-0 md:flex">
              <Finance4KindField context={context} item={entry} />
            </span>
          </ListRowHeader>
          {caption.length ? (
            <ListRowDescription className="tabular-nums">
              <DataCollectionCaption parts={caption} />
            </ListRowDescription>
          ) : null}
        </ListRowBody>
        <ListRowTrailing className="gap-3">
          <ListRowField className={finance4FieldWidth.client}>
            <Finance4ClientField context={context} item={entry} />
          </ListRowField>
          <ListRowField className={finance4FieldWidth.responsible}>
            <Finance4ResponsibleField context={context} item={entry} />
          </ListRowField>
          <ListRowField always className={finance4FieldWidth.due}>
            <Finance4DueField context={context} item={entry} />
          </ListRowField>
          <ListRowField always className={finance4FieldWidth.amount}>
            <Finance4AmountField context={context} item={entry} />
          </ListRowField>
          <ListRowField className={finance4FieldWidth.situation}>
            <Finance4SituationField context={context} item={entry} />
          </ListRowField>
        </ListRowTrailing>
      </ListRow>
    )
  }

export const renderFinance4KanbanCard =
  (context: Finance4FieldContext) => (entry: Finance4Entry) => {
    const { clientById, labels, onOpen } = context
    const client = entry.clientId ? clientById.get(entry.clientId) : undefined
    return (
      <DataCollectionKanbanCard
        caption={client ? [client.label] : []}
        fields={[
          {
            id: 'amount',
            label: labels.columns.amount,
            value: <Finance4AmountField context={context} item={entry} />,
          },
          {
            id: 'due',
            label: labels.columns.due,
            value: <Finance4DueField context={context} item={entry} />,
          },
          {
            id: 'responsible',
            label: labels.columns.responsible,
            value: <Finance4ResponsibleField context={context} item={entry} />,
          },
        ]}
        footer={<Finance4KindField context={context} item={entry} />}
        onOpen={onOpen ? () => onOpen(entry.id) : undefined}
        openLabel={labels.openEntry(entry.description)}
        title={entry.description}
      />
    )
  }
