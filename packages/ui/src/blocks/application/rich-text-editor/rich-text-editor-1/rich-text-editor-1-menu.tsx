import {
  CodeIcon,
  CopyIcon,
  DotsThreeIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import type { RichTextEditor1CopyFormat, RichTextEditor1Labels } from './types'

export function RichTextEditor1Menu({
  labels,
  onClear,
  onCopy,
  onReadOnlyChange,
  readOnly,
}: Readonly<{
  labels: RichTextEditor1Labels
  onClear: () => void
  onCopy: (format: RichTextEditor1CopyFormat) => void
  onReadOnlyChange: (readOnly: boolean) => void
  readOnly: boolean
}>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={labels.documentMenu}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuRadioGroup
          onValueChange={(value) => onReadOnlyChange(value === 'view')}
          value={readOnly ? 'view' : 'edit'}
        >
          <MenuRadioItem value="edit">{labels.editMode}</MenuRadioItem>
          <MenuRadioItem value="view">{labels.viewMode}</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuItem onClick={() => onCopy('html')}>
          <CodeIcon aria-hidden="true" />
          {labels.copy.html}
        </MenuItem>
        <MenuItem onClick={() => onCopy('text')}>
          <CopyIcon aria-hidden="true" />
          {labels.copy.text}
        </MenuItem>
        <MenuSeparator />
        <MenuItem disabled={readOnly} onClick={onClear} variant="destructive">
          <TrashIcon aria-hidden="true" />
          {labels.clear.confirm}
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}
