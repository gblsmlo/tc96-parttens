import {
  CaretDownIcon,
  LinkSimpleIcon,
  NotePencilIcon,
  PlusIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { useRef } from 'react'
import type { Documents4Labels } from './types'

export interface Documents4CreateMenuProps {
  accept?: string
  labels: Documents4Labels
  onCreateLink?: () => void
  onCreateNote?: () => void
  onUpload?: (files: File[]) => void
}

export const hasDocuments4Create = ({
  onCreateLink,
  onCreateNote,
  onUpload,
}: Omit<Documents4CreateMenuProps, 'labels'>) =>
  Boolean(onCreateLink || onCreateNote || onUpload)

export function Documents4CreateMenu({
  accept,
  labels,
  onCreateLink,
  onCreateNote,
  onUpload,
}: Readonly<Documents4CreateMenuProps>) {
  const input = useRef<HTMLInputElement>(null)
  const creates = Boolean(onCreateNote || onCreateLink)

  return (
    <>
      <Menu>
        <MenuTrigger
          render={<ToolbarButton render={<Button type="button" />} />}
        >
          <PlusIcon aria-hidden="true" />
          {labels.create}
          <CaretDownIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end">
          {onCreateNote ? (
            <MenuItem onClick={onCreateNote}>
              <NotePencilIcon aria-hidden="true" />
              {labels.createNote}
            </MenuItem>
          ) : null}
          {onCreateLink ? (
            <MenuItem onClick={onCreateLink}>
              <LinkSimpleIcon aria-hidden="true" />
              {labels.createLink}
            </MenuItem>
          ) : null}
          {creates && onUpload ? <MenuSeparator /> : null}
          {onUpload ? (
            <MenuItem onClick={() => input.current?.click()}>
              <UploadSimpleIcon aria-hidden="true" />
              {labels.upload}
            </MenuItem>
          ) : null}
        </MenuPopup>
      </Menu>
      {onUpload ? (
        <input
          accept={accept}
          data-slot="documents-4-upload-input"
          hidden
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files ?? [])
            event.target.value = ''
            if (files.length > 0) onUpload(files)
          }}
          ref={input}
          tabIndex={-1}
          type="file"
        />
      ) : null}
    </>
  )
}
