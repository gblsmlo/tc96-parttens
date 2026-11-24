'use client'

import { RecordDialog } from '@tc96/parttens/records/dialog/composition/record-dialog/record-dialog'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Skeleton } from '@tc96/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import type { ReactElement } from 'react'
import { resolveRecordsLabels } from '../shared/labels'
import { StatusRows } from '../shared/status-rows'
import { defaultBulkImport1Labels } from './labels'
import type { BulkImport1Props } from './types'

const SKELETON_ROWS = ['first', 'second', 'third']

export function BulkImport1({
  children,
  columns,
  importing = false,
  labels: labelsProp,
  maxSelected = 50,
  onImport,
  onOpenChange,
  onSearchAgain,
  onSelectedChange,
  onStepChange,
  open,
  progress,
  query,
  rows,
  searchedAt,
  searching = false,
  selected,
  step,
}: Readonly<BulkImport1Props>): ReactElement {
  const labels = resolveRecordsLabels(defaultBulkImport1Labels, labelsProp)
  const full = selected.length >= maxSelected

  const toggle = (id: string, checked: boolean) =>
    onSelectedChange(
      checked ? [...selected, id] : selected.filter((value) => value !== id),
    )

  if (step === 'select') {
    const ready = !searching && selected.length > 0
    return (
      <RecordDialog
        cancelLabel={labels.cancel}
        onOpenChange={onOpenChange}
        onSubmit={() => {
          if (ready) onStepChange('link')
          return false
        }}
        open={open}
        size="large"
        step={step}
        submitDisabled={!ready}
        submitHint={
          searching
            ? undefined
            : selected.length === 0
              ? labels.noneSelected
              : labels.selectedCount(selected.length, maxSelected)
        }
        submitLabel={labels.continue}
        title={labels.title}
        titleAncestor={labels.ancestor}
      >
        <div className="flex flex-col gap-4">
          <div
            className="flex flex-wrap items-center gap-3"
            data-slot="bulk-import-query"
          >
            <Badge variant="outline">{query}</Badge>
            <span
              aria-live="polite"
              className="min-w-0 flex-1 text-muted-foreground text-sm"
            >
              {searching ? labels.searching : searchedAt}
            </span>
            {onSearchAgain ? (
              <Button
                disabled={searching}
                onClick={onSearchAgain}
                size="sm"
                type="button"
                variant="outline"
              >
                {labels.searchAgain}
              </Button>
            ) : null}
          </div>
          <Table aria-busy={searching || undefined}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <span className="sr-only">{labels.selectColumn}</span>
                </TableHead>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
                <TableHead>
                  <span className="sr-only">{labels.status}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searching
                ? SKELETON_ROWS.map((key) => (
                    <TableRow aria-hidden="true" key={key}>
                      <TableCell>
                        <Skeleton className="size-4" />
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                      <TableCell />
                    </TableRow>
                  ))
                : rows.map((row) => {
                    const checked = selected.includes(row.id)
                    return (
                      <TableRow
                        data-disabled={row.disabledReason ? '' : undefined}
                        key={row.id}
                      >
                        <TableCell>
                          <Checkbox
                            aria-label={labels.select(row.label)}
                            checked={checked}
                            disabled={
                              Boolean(row.disabledReason) || (full && !checked)
                            }
                            onCheckedChange={(next) => toggle(row.id, next)}
                          />
                        </TableCell>
                        {row.cells.map((cell, index) => (
                          <TableCell key={columns[index] ?? index}>
                            {cell}
                          </TableCell>
                        ))}
                        <TableCell>
                          {row.disabledReason ? (
                            <Badge variant="secondary">
                              {row.disabledReason}
                            </Badge>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </div>
      </RecordDialog>
    )
  }

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      footerStart={
        <Button
          disabled={importing}
          onClick={() => onStepChange('select')}
          type="button"
          variant="outline"
        >
          {labels.back}
        </Button>
      }
      keepOpenOnSuccess
      onOpenChange={onOpenChange}
      onSubmit={onImport}
      open={open}
      size="large"
      step={step}
      submitDisabled={importing}
      submitHint={importing ? labels.importingHint : undefined}
      submitLabel={
        importing ? labels.importing : labels.import(selected.length)
      }
      title={labels.title}
      titleAncestor={labels.ancestor}
    >
      <div className="flex flex-col gap-5">
        {children}
        {progress && progress.length > 0 ? (
          <StatusRows label={labels.progress} rows={progress} />
        ) : null}
      </div>
    </RecordDialog>
  )
}
