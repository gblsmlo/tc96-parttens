'use client'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  EyeSlashIcon,
  PushPinIcon,
  PushPinSlashIcon,
} from '@phosphor-icons/react'
import type { RowData } from '@tanstack/react-table'
import { MenuItem, MenuPopup, MenuSeparator } from '@tc96/ui/menu'
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
            <CaretUpIcon aria-hidden="true" />
            Ordem crescente
          </MenuItem>
          <MenuItem onClick={() => column.toggleSorting(true)}>
            <CaretDownIcon aria-hidden="true" />
            Ordem decrescente
          </MenuItem>
          {sorted ? (
            <MenuItem onClick={() => column.clearSorting()}>
              <CaretUpDownIcon aria-hidden="true" />
              Limpar ordenação
            </MenuItem>
          ) : null}
          <MenuSeparator />
        </>
      ) : null}
      <MenuItem onClick={() => moveColumn(table, column.id, -1)}>
        <ArrowLeftIcon aria-hidden="true" />
        Mover para esquerda
      </MenuItem>
      <MenuItem onClick={() => moveColumn(table, column.id, 1)}>
        <ArrowRightIcon aria-hidden="true" />
        Mover para direita
      </MenuItem>
      {canPin ? (
        <>
          <MenuSeparator />
          {column.getIsPinned() ? (
            <MenuItem onClick={() => column.pin(false)}>
              <PushPinSlashIcon aria-hidden="true" />
              Desafixar coluna
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={() => column.pin('start')}>
                <PushPinIcon aria-hidden="true" />
                Fixar à esquerda
              </MenuItem>
              <MenuItem onClick={() => column.pin('end')}>
                <PushPinIcon aria-hidden="true" />
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
            <EyeSlashIcon aria-hidden="true" />
            Ocultar coluna
          </MenuItem>
        </>
      ) : null}
    </MenuPopup>
  )
}
