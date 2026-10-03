'use client'

import { HorizontalRulePlugin } from '@platejs/basic-nodes/react'
import { DatePlugin } from '@platejs/date/react'
import { unwrapList } from '@platejs/list-classic'
import { insertTable } from '@platejs/table'
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@platejs/table/react'
import { Checkbox } from '@tc96/ui/checkbox'
import { cn } from '@tc96/utils'
import type { SlateEditor } from 'platejs'
import {
  createPlatePlugin,
  PlateElement,
  type PlateElementProps,
} from 'platejs/react'
import type { ReactElement } from 'react'

export const RICH_TEXT_EXTRA_BLOCKS = [
  'todo',
  'callout',
  'code',
  'hr',
  'date',
  'table',
  'image',
] as const

export type RichTextExtraBlock = (typeof RICH_TEXT_EXTRA_BLOCKS)[number]

export const RICH_TEXT_EXTRA_ELEMENTS = [
  'action_item',
  'callout',
  'code_block',
  'hr',
  'date',
  'table',
  'tr',
  'td',
  'th',
  'img',
] as const

const extraType = {
  callout: 'callout',
  code: 'code_block',
  date: 'date',
  hr: 'hr',
  image: 'img',
  table: 'table',
  todo: 'action_item',
} as const satisfies Record<
  RichTextExtraBlock,
  (typeof RICH_TEXT_EXTRA_ELEMENTS)[number]
>

export function applyExtraBlock(
  editor: SlateEditor,
  block: RichTextExtraBlock,
): void {
  const type = extraType[block]
  if (block === 'date') {
    editor.tf.insertNodes(
      {
        children: [{ text: '' }],
        date: new Date().toISOString().slice(0, 10),
        type,
      },
      { select: true },
    )
    editor.tf.insertText(' ')
    return
  }
  if (block === 'image') return
  if (block === 'table') {
    insertTable(editor, { colCount: 3, rowCount: 3 })
    return
  }
  if (editor.api.some({ match: { type: 'li' } })) unwrapList(editor)
  if (block === 'hr') {
    editor.tf.insertNodes({ children: [{ text: '' }], type }, { select: false })
    editor.tf.insertNodes(editor.api.create.block(), { select: true })
    return
  }
  const active = editor.api.some({ match: { type } })
  editor.tf.setNodes(
    active
      ? { type: 'p' }
      : { type, ...(block === 'todo' ? { checked: false } : {}) },
  )
}

function TodoElement(props: PlateElementProps): ReactElement {
  const { editor, element, path } = props
  const checked = element.checked === true
  return (
    <PlateElement {...props} as="div" className="my-1 flex items-start gap-2">
      <span className="mt-1 flex shrink-0 select-none" contentEditable={false}>
        <Checkbox
          aria-label="Concluída"
          checked={checked}
          onCheckedChange={(next) =>
            editor.tf.setNodes({ checked: next === true }, { at: path })
          }
        />
      </span>
      <span
        className={cn(
          'min-w-0 flex-1',
          checked && 'text-muted-foreground line-through',
        )}
      >
        {props.children}
      </span>
    </PlateElement>
  )
}

function CalloutElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="div"
      className="my-2 flex gap-3 rounded-lg border border-border/80 bg-muted/48 p-3"
    >
      <span
        aria-hidden="true"
        className="select-none leading-6"
        contentEditable={false}
      >
        {String(props.element.icon ?? '💡')}
      </span>
      <div className="min-w-0 flex-1">{props.children}</div>
    </PlateElement>
  )
}

function CodeBlockElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="pre"
      className="my-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-sm"
    />
  )
}

function HrElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement {...props} as="div" className="my-3">
      <div contentEditable={false}>
        <hr className="border-border" />
      </div>
      {props.children}
    </PlateElement>
  )
}

function DateElement(props: PlateElementProps): ReactElement {
  const iso = String(props.element.date ?? '')
  const parsed = new Date(`${iso}T00:00:00`)
  const label = Number.isNaN(parsed.getTime())
    ? iso
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(parsed)
  return (
    <PlateElement
      {...props}
      as="span"
      attributes={{ ...props.attributes, contentEditable: false }}
      className="rounded-sm bg-muted px-1 text-sm"
    >
      <time dateTime={iso}>{label}</time>
      {props.children}
    </PlateElement>
  )
}

function ImageElement(props: PlateElementProps): ReactElement {
  const url = String(props.element.url ?? '')
  const alt = String(props.element.alt ?? '')
  return (
    <PlateElement {...props} as="div" className="my-3">
      <figure contentEditable={false}>
        <img
          alt={alt}
          className="max-h-96 max-w-full rounded-lg border border-border/80"
          src={url}
        />
      </figure>
      {props.children}
    </PlateElement>
  )
}

function TableElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement {...props} as="div" className="my-2 overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <tbody>{props.children}</tbody>
      </table>
    </PlateElement>
  )
}

function TableRowElement(props: PlateElementProps): ReactElement {
  return <PlateElement {...props} as="tr" />
}

function TableCellElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="td"
      className="min-w-12 border border-border/80 p-2 align-top"
    />
  )
}

function TableHeaderCellElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="th"
      className="min-w-12 border border-border/80 bg-muted/48 p-2 text-start align-top font-medium"
    />
  )
}

const resetOnEmpty = {
  break: { empty: 'reset' },
  delete: { start: 'reset' },
} as const

export const extraBlockPlugins = [
  createPlatePlugin({
    key: 'img',
    node: { component: ImageElement, isElement: true, isVoid: true },
  }),
  createPlatePlugin({
    key: 'action_item',
    node: { component: TodoElement, isElement: true },
    rules: resetOnEmpty,
  }),
  createPlatePlugin({
    key: 'callout',
    node: { component: CalloutElement, isElement: true },
    rules: resetOnEmpty,
  }),
  createPlatePlugin({
    key: 'code_block',
    node: { component: CodeBlockElement, isElement: true },
    rules: {
      break: { default: 'lineBreak', empty: 'reset' },
      delete: { start: 'reset' },
    },
  }),
  HorizontalRulePlugin.withComponent(HrElement),
  DatePlugin.withComponent(DateElement),
  TablePlugin.withComponent(TableElement),
  TableRowPlugin.withComponent(TableRowElement),
  TableCellPlugin.withComponent(TableCellElement),
  TableCellHeaderPlugin.withComponent(TableHeaderCellElement),
]

export interface RichTextImage {
  alt?: string
  url: string
}

export function insertImage(editor: SlateEditor, image: RichTextImage): void {
  editor.tf.insertNodes(
    {
      alt: image.alt ?? '',
      children: [{ text: '' }],
      type: extraType.image,
      url: image.url,
    },
    { select: true },
  )
}
