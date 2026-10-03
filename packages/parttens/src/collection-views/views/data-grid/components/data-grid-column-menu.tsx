'use client'

import type { RowData } from '@tanstack/react-table'
import { MenuItem, MenuPopup, MenuSeparator } from '@tc96/ui/menu'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  EyeOffIcon,
  PinIcon,
  PinOffIcon,
} from 'lucide-react'
import type { DataGridColumn, DataGridTable } from '../lib/data-grid-features'
import { moveColumn } from '../lib/move-column'

export interface DataGridColumnMenuProps<TData extends RowData> {
  column: DataGridColumn<TData>
  table: DataGridTable<TData>
}

export function DataGridColumnMenu<TData extends RowData>({
  column,
  table,
}: DataGridColumnMenuProps<TData>) {
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  const canPin = column.getCanPin()
  const sorted = column.getIsSorted()

  return (
    <MenuPopup align="end">
      {canSort ? (
        <>
          <MenuItem onClick={() => column.toggleSorting(false)}>
            <ChevronUpIcon />
            Ordem crescente
          </MenuItem>
          <MenuItem onClick={() => column.toggleSorting(true)}>
            <ChevronDownIcon />
            Ordem decrescente
          </MenuItem>
          {sorted ? (
            <MenuItem onClick={() => column.clearSorting()}>
              <ChevronsUpDownIcon />
              Limpar ordenação
            </MenuItem>
          ) : null}
          <MenuSeparator />
        </>
      ) : null}
      <MenuItem onClick={() => moveColumn(table, column.id, -1)}>
        <ArrowLeftIcon />
        Mover para esquerda
      </MenuItem>
      <MenuItem onClick={() => moveColumn(table, column.id, 1)}>
        <ArrowRightIcon />
        Mover para direita
      </MenuItem>
      {canPin ? (
        <>
          <MenuSeparator />
          {column.getIsPinned() ? (
            <MenuItem onClick={() => column.pin(false)}>
              <PinOffIcon />
              Desafixar coluna
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => column.pin('start')}>
                <PinIcon />
                Fixar à esquerda
              </MenuItem>
              <MenuItem onClick={() => column.pin('end')}>
                <PinIcon />
                Fixar à direita
              </MenuItem>
            </>
          )}
        </>
      ) : null}
      {canHide ? (
        <>
          <MenuSeparator />
          <MenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon />
            Ocultar coluna
          </MenuItem>
        </>
      ) : null}
    </MenuPopup>
  )
}
