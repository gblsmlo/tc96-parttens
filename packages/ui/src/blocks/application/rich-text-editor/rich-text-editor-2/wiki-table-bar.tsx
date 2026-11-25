import {
  ColumnsPlusRightIcon,
  RowsPlusBottomIcon,
  TableIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import {
  addTableColumn,
  addTableRow,
  hasTableHeaderRow,
  isInTable,
  removeTable,
  removeTableColumn,
  removeTableRow,
  toggleTableHeaderRow,
} from '@tc96/ui/patterns/rich-text-editor'
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@tc96/ui/toolbar'
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
} from 'platejs/react'
import { useState } from 'react'
import type { RichTextEditor2Labels } from './types'

export function WikiTableBar({
  labels,
}: Readonly<{ labels: RichTextEditor2Labels }>) {
  const editor = useEditorRef()
  const readOnly = useEditorReadOnly()
  const inTable = useEditorSelector((current) => isInTable(current), [])
  const header = useEditorSelector((current) => hasTableHeaderRow(current), [])
  const [confirming, setConfirming] = useState(false)

  const run = (action: () => void) => () => {
    action()
    editor.tf.focus()
  }
  const keepFocus = (event: { preventDefault: () => void }) =>
    event.preventDefault()

  if (readOnly || (!inTable && !confirming)) return null

  return (
    <>
      <Toolbar
        aria-label={labels.tableBar}
        className="my-2 flex-wrap"
        data-slot="wiki-table-bar"
      >
        <ToolbarGroup>
          <TableIcon aria-hidden="true" className="mx-1.5 size-4 opacity-60" />
          <ToolbarButton
            onClick={run(() => addTableRow(editor, 'after'))}
            onMouseDown={keepFocus}
            render={<Button size="sm" variant="ghost" />}
          >
            <RowsPlusBottomIcon aria-hidden="true" />
            {labels.tableAddRow}
          </ToolbarButton>
          <ToolbarButton
            onClick={run(() => addTableColumn(editor, 'after'))}
            onMouseDown={keepFocus}
            render={<Button size="sm" variant="ghost" />}
          >
            <ColumnsPlusRightIcon aria-hidden="true" />
            {labels.tableAddColumn}
          </ToolbarButton>
          <ToolbarButton
            aria-pressed={header}
            onClick={run(() => toggleTableHeaderRow(editor))}
            onMouseDown={keepFocus}
            render={<Button size="sm" variant="ghost" />}
          >
            {labels.tableHeader}
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton
            onClick={run(() => removeTableRow(editor))}
            onMouseDown={keepFocus}
            render={<Button size="sm" variant="ghost" />}
          >
            {labels.tableRemoveRow}
          </ToolbarButton>
          <ToolbarButton
            onClick={run(() => removeTableColumn(editor))}
            onMouseDown={keepFocus}
            render={<Button size="sm" variant="ghost" />}
          >
            {labels.tableRemoveColumn}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setConfirming(true)}
            onMouseDown={keepFocus}
            render={<Button size="sm" variant="ghost" />}
          >
            <TrashIcon aria-hidden="true" />
            {labels.tableRemove}
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
      <AlertDialog onOpenChange={setConfirming} open={confirming}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.tableRemoveTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.tableRemoveDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button size="sm" variant="outline" />}>
              {labels.tableRemoveCancel}
            </AlertDialogClose>
            <AlertDialogClose
              onClick={run(() => removeTable(editor))}
              render={<Button size="sm" variant="destructive" />}
            >
              {labels.tableRemoveConfirm}
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  )
}
