import {
  CaretDownIcon,
  FileTextIcon,
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
import type { Documents3Labels } from './types'

export interface Documents3CreateMenuProps {
  accept?: string
  labels: Documents3Labels
  onCreateLink?: () => void
  onCreateNote?: () => void
  onCreatePage?: () => void
  onUpload?: (files: File[]) => void
}

export const hasDocuments3Create = ({
  onCreateLink,
  onCreateNote,
  onCreatePage,
  onUpload,
}: Omit<Documents3CreateMenuProps, 'labels'>) =>
  Boolean(onCreateLink || onCreateNote || onCreatePage || onUpload)

export function Documents3CreateMenu({
  accept,
  labels,
  onCreateLink,
  onCreateNote,
  onCreatePage,
  onUpload,
}: Readonly<Documents3CreateMenuProps>) {
  const input = useRef<HTMLInputElement>(null)
  const creates = Boolean(onCreatePage || onCreateNote || onCreateLink)

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
          {onCreatePage ? (
            <MenuItem onClick={onCreatePage}>
              <FileTextIcon aria-hidden="true" />
              {labels.createPage}
            </MenuItem>
          ) : null}
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
          data-slot="documents-3-upload-input"
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
