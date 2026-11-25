import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import type { ReactNode } from 'react'

export type RichTextEditor2BlockKind =
  | 'blockquote'
  | 'callout'
  | 'code'
  | 'h2'
  | 'h3'
  | 'ol'
  | 'p'
  | 'todo'
  | 'ul'

export interface RichTextEditor2Person {
  id: string
  image?: string
  name: string
  role: string
}

export interface RichTextEditor2Settings {
  fullWidth: boolean
  locked: boolean
  smallText: boolean
}

export interface RichTextEditor2Labels {
  blockAdd: string
  blockDelete: string
  blockDuplicate: string
  blockKinds: Record<RichTextEditor2BlockKind, string>
  blockMenu: string
  blockMoveDown: string
  blockMoveUp: string
  blockSelection: string
  blockTurnInto: string
  dragHandle: string
  editor: string
  fullWidth: string
  locked: string
  lockPage: string
  mention: string
  mentionEmpty: string
  outline: string
  outlineEmpty: string
  outlineTrigger: string
  placeholder: string
  saved: string
  saving: string
  slashMenu: string
  slashMenuEmpty: string
  smallText: string
  tableAddColumn: string
  tableAddRow: string
  tableBar: string
  tableHeader: string
  tableRemove: string
  tableRemoveCancel: string
  tableRemoveColumn: string
  tableRemoveConfirm: string
  tableRemoveDescription: string
  tableRemoveRow: string
  tableRemoveTitle: string
}

export interface RichTextEditor2NavbarContext {
  lockBadge: ReactNode
  onSettingChange: (key: keyof RichTextEditor2Settings, value: boolean) => void
  pageMenuItems: ReactNode
  saveStatus: 'saved' | 'saving' | null
  settings: RichTextEditor2Settings
}

export interface RichTextEditor2Props {
  className?: string
  defaultSettings?: Partial<RichTextEditor2Settings>
  defaultValue?: RichTextValue
  navbar?: ReactNode | ((context: RichTextEditor2NavbarContext) => ReactNode)
  labels?: Partial<Omit<RichTextEditor2Labels, 'blockKinds'>> & {
    blockKinds?: Partial<RichTextEditor2Labels['blockKinds']>
  }
  onSave?: (value: RichTextValue) => void
  onSettingsChange?: (settings: RichTextEditor2Settings) => void
  people?: RichTextEditor2Person[]
  saveDelay?: number
}
