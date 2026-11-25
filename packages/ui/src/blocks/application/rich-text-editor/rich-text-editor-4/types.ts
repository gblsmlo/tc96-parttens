import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'
import type { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'

export type RichTextEditor4Color =
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'primary'

export type RichTextEditor4Status = 'editing' | 'idle' | 'viewing'

export interface RichTextEditor4User {
  color: RichTextEditor4Color
  id: string
  name: string
}

export interface RichTextEditor4Room {
  awareness: Awareness
  connect?: () => Promise<void> | void
  disconnect?: () => void
  doc: Y.Doc
  replay?: () => void
}

export interface RichTextEditor4Message {
  author: RichTextEditor4User
  body: string
  createdAt: number
  id: string
}

export interface RichTextEditor4Thread {
  anchored: boolean
  createdAt: number
  id: string
  messages: RichTextEditor4Message[]
  quote: string
  resolved: boolean
  resolvedBy?: RichTextEditor4User
}

export interface RichTextEditor4Labels {
  blocks: { blockquote: string; h2: string; h3: string }
  comments: {
    cancel: string
    composer: string
    empty: string
    list: string
    new: string
    newThread: string
    open: string
    openThread: (quote: string) => string
    reopen: string
    reopened: string
    replies: (count: number) => string
    reply: string
    replyComposer: string
    resolve: string
    resolved: string
    resolvedBadge: string
    send: string
    showResolved: string
    thread: string
    undo: string
    unanchored: string
  }
  editor: string
  online: {
    label: string
    merged: (names: string[]) => string
    offline: (queued: number) => string
    synced: string
  }
  presence: {
    follow: (name: string) => string
    following: (name: string) => string
    group: string
    person: (name: string, status: string) => string
    status: Record<RichTextEditor4Status, string>
    stopFollowing: string
    summary: (counts: Record<RichTextEditor4Status, number>) => string
    you: string
  }
  replay: string
  title: string
  tools: {
    bold: string
    bulletList: string
    code: string
    comment: string
    format: string
    italic: string
    numberedList: string
    paragraph: string
    redo: string
    strikethrough: string
    blockType: string
    underline: string
    undo: string
  }
}

export type RichTextEditor4LabelsInput = {
  [Key in keyof RichTextEditor4Labels]?: RichTextEditor4Labels[Key] extends string
    ? string
    : Partial<RichTextEditor4Labels[Key]>
}

export interface RichTextEditor4Props {
  className?: string
  defaultValue?: RichTextValue
  labels?: RichTextEditor4LabelsInput
  now?: () => number
  onCommentsChange?: (threads: RichTextEditor4Thread[]) => void
  room: RichTextEditor4Room
  user: RichTextEditor4User
}
