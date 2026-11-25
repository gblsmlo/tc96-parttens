import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import type { ReactNode } from 'react'

export type RichTextEditor1CopyFormat = 'html' | 'text'

export type RichTextEditor1SaveState = 'saved' | 'unsaved'

export interface RichTextEditor1Shortcut {
  id: string
  keys: string[]
  label: string
}

export interface RichTextEditor1MarkdownRule {
  id: string
  label: string
  syntax: string
}

export interface RichTextEditor1Labels {
  align: {
    center: string
    justify: string
    left: string
    right: string
  }
  blockType: string
  blocks: {
    h1: string
    h2: string
    h3: string
    paragraph: string
  }
  bulletList: string
  characters: (count: number) => string
  clear: {
    cancel: string
    confirm: string
    description: string
    done: string
    restore: string
    title: string
  }
  codeBlock: string
  copy: {
    html: string
    htmlDone: string
    text: string
    textDone: string
  }
  divider: string
  document: string
  editMode: string
  emptyTitle: string
  history: { redo: string; undo: string }
  link: { apply: string; button: string; remove: string; url: string }
  marks: {
    bold: string
    code: string
    highlight: string
    italic: string
    strikethrough: string
    underline: string
  }
  numberedList: string
  placeholder: string
  quote: string
  readingTime: (minutes: number) => string
  saveState: Record<RichTextEditor1SaveState, string>
  shortcuts: {
    markdownTitle: string
    markdownRules: RichTextEditor1MarkdownRule[]
    shortcutsTitle: string
    shortcutList: RichTextEditor1Shortcut[]
    title: string
    trigger: string
  }
  taskList: string
  titleLabel: string
  toolbar: string
  viewMode: string
  words: (count: number) => string
}

export interface RichTextEditor1NavbarContext {
  menuItems: ReactNode
  readOnly: boolean
  status: ReactNode
}

export interface RichTextEditor1Props {
  className?: string
  defaultReadOnly?: boolean
  defaultTitle?: string
  defaultValue?: RichTextValue
  description?: string
  labels?: Partial<RichTextEditor1Labels>
  navbar?: ReactNode | ((context: RichTextEditor1NavbarContext) => ReactNode)
  onChange?: (value: RichTextValue) => void
  onClear?: () => void
  onCopy?: (format: RichTextEditor1CopyFormat, content: string) => void
  onReadOnlyChange?: (readOnly: boolean) => void
  onSave?: (value: RichTextValue) => void
  onTitleChange?: (title: string) => void
  readOnly?: boolean
  saveDelay?: number
  status?: string
}
