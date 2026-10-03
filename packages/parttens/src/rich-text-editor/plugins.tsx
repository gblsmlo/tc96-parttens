import {
  BoldRules,
  CodeRules,
  ItalicRules,
  StrikethroughRules,
} from '@platejs/basic-nodes'
import {
  BoldPlugin,
  CodePlugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { toggleList, unwrapList } from '@platejs/list-classic'
import {
  BulletedListPlugin,
  ListItemPlugin,
  ListPlugin,
  NumberedListPlugin,
  TaskListPlugin,
} from '@platejs/list-classic/react'
import { SlashInputPlugin, SlashPlugin } from '@platejs/slash-command/react'
import {
  createBlockStartInputRule,
  type Descendant,
  ElementApi,
  KEYS,
  NodeApi,
  type Path,
  PathApi,
  RangeApi,
  type SlateEditor,
  type TElement,
} from 'platejs'
import {
  createPlatePlugin,
  Key,
  ParagraphPlugin,
  PlateElement,
  type PlateElementProps,
  PlateLeaf,
  type PlateLeafProps,
} from 'platejs/react'
import type { ReactElement } from 'react'

export const RICH_TEXT_MARKS = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'code',
] as const

export type RichTextMark = (typeof RICH_TEXT_MARKS)[number]

export const RICH_TEXT_BLOCKS = ['h2', 'h3', 'blockquote', 'ul', 'ol'] as const

export type RichTextBlock = (typeof RICH_TEXT_BLOCKS)[number]

export const RICH_TEXT_ELEMENTS = [
  'p',
  'h2',
  'h3',
  'blockquote',
  'ul',
  'ol',
  'li',
  'lic',
] as const

export const SLASH_INPUT_TYPE = KEYS.slashInput

const LIST_TYPES: readonly string[] = ['ul', 'ol']

const isList = (node: unknown): node is TElement =>
  ElementApi.isElement(node) && LIST_TYPES.includes(node.type)

const inListItem = (editor: SlateEditor) =>
  editor.api.some({ match: { type: 'li' } })

export function applyBlock(
  editor: SlateEditor,
  block: RichTextBlock | 'p',
): void {
  if (block === 'ul' || block === 'ol') {
    toggleList(editor, { type: block })
    return
  }
  if (!editor.api.some({ match: { type: block } }) && inListItem(editor))
    unwrapList(editor)
  editor.tf.toggleBlock(block)
}

const outsideList = ({ editor }: { editor: SlateEditor }) => !inListItem(editor)

const notAlready =
  (block: RichTextBlock) =>
  ({ editor }: { editor: SlateEditor }) =>
    !editor.api.some({ match: { type: block } })

function blockShortcut(
  prefix: RegExp | string,
  block: RichTextBlock,
  enabled?: (context: { editor: SlateEditor }) => boolean,
) {
  return createBlockStartInputRule({
    apply: ({ editor }, match) => {
      editor.tf.delete({ at: match.range })
      applyBlock(editor, block)
      return true
    },
    enabled: (context) =>
      notAlready(block)(context) && (enabled?.(context) ?? true),
    match: prefix,
    trigger: ' ',
  })
}

function ParagraphElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement {...props} as="p" className="my-2 first:mt-0 last:mb-0" />
  )
}

function H2Element(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="h2"
      className="mt-4 mb-2 font-semibold text-lg first:mt-0"
    />
  )
}

function H3Element(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="h3"
      className="mt-3 mb-1 font-semibold text-base first:mt-0"
    />
  )
}

function BlockquoteElement(props: PlateElementProps): ReactElement {
  return (
    <PlateElement
      {...props}
      as="blockquote"
      className="my-2 border-border border-s-2 ps-4 italic"
    />
  )
}

function BulletedListElement(props: PlateElementProps): ReactElement {
  return <PlateElement {...props} as="ul" className="my-2 list-disc ps-6" />
}

function NumberedListElement(props: PlateElementProps): ReactElement {
  return <PlateElement {...props} as="ol" className="my-2 list-decimal ps-6" />
}

function ListItemElement(props: PlateElementProps): ReactElement {
  return <PlateElement {...props} as="li" />
}

function CodeLeaf(props: PlateLeafProps): ReactElement {
  return (
    <PlateLeaf
      {...props}
      as="code"
      className="rounded-sm bg-muted px-1 font-mono text-sm"
    />
  )
}

function SlashInputElement(props: PlateElementProps): ReactElement {
  return <PlateElement {...props} as="span" className="rounded-sm bg-muted" />
}

export const hasSlashInput = (nodes: readonly Descendant[]): boolean =>
  nodes.some(
    (node) =>
      ElementApi.isElement(node) &&
      (node.type === SLASH_INPUT_TYPE ||
        hasSlashInput(node.children as Descendant[])),
  )

function unwrapStaleSlashInputs(editor: SlateEditor): void {
  const { selection } = editor
  const current =
    selection && !RangeApi.isExpanded(selection)
      ? editor.api.above({ at: selection, match: { type: SLASH_INPUT_TYPE } })
      : undefined
  if (current) return
  const leftovers = [
    ...editor.api.nodes({ at: [], match: { type: SLASH_INPUT_TYPE } }),
  ]
  for (const [, path] of leftovers.reverse())
    editor.tf.unwrapNodes({ at: path })
}

const slashPlugin = SlashPlugin.configure({
  handlers: {
    onChange: ({ editor }: { editor: SlateEditor }) =>
      unwrapStaleSlashInputs(editor),
  },
  options: {
    createComboboxInput: () => ({
      children: [{ text: '/' }],
      type: SLASH_INPUT_TYPE,
    }),
  },
})
  .configurePlugin(SlashInputPlugin, {
    node: { component: SlashInputElement, isVoid: false },
  })
  .overrideEditor(({ editor, tf: { normalizeNode } }) => ({
    transforms: {
      normalizeNode(entry) {
        const [node, path] = entry
        if (ElementApi.isElement(node) && node.type === SLASH_INPUT_TYPE) {
          const text = NodeApi.string(node)
          if (text === '') {
            editor.tf.removeNodes({ at: path })
            return
          }
          if (!text.startsWith('/')) {
            editor.tf.unwrapNodes({ at: path })
            return
          }
        }
        normalizeNode(entry)
      },
    },
  }))

const BlockquotePlugin = createPlatePlugin({
  inputRules: [blockShortcut('>', 'blockquote')],
  key: 'blockquote',
  node: { component: BlockquoteElement, isElement: true },
  parsers: {
    html: { deserializer: { rules: [{ validNodeName: 'BLOCKQUOTE' }] } },
  },
  rules: { break: { empty: 'reset' }, delete: { start: 'reset' } },
}).overrideEditor(({ editor, type, tf: { normalizeNode } }) => ({
  transforms: {
    normalizeNode(entry) {
      const [node, path] = entry
      const isBlockChild = (child: unknown) =>
        ElementApi.isElement(child) && !editor.api.isInline(child)
      if (
        ElementApi.isElement(node) &&
        node.type === type &&
        node.children.some(isBlockChild)
      ) {
        editor.tf.withoutNormalizing(() => {
          for (let index = node.children.length - 1; index > 0; index -= 1) {
            if (isBlockChild(node.children[index])) {
              editor.tf.insertNodes({ text: '\n' }, { at: [...path, index, 0] })
            }
          }
          editor.tf.unwrapNodes({
            at: path,
            match: (child: unknown, childPath: Path) =>
              isBlockChild(child) && childPath.length === path.length + 1,
            mode: 'all',
          })
        })
        return
      }
      normalizeNode(entry)
    },
  },
}))

function listDepthAt(editor: SlateEditor, path: Path): number {
  let depth = 0
  for (let length = 1; length <= path.length; length += 1) {
    if (isList(NodeApi.get(editor, path.slice(0, length)))) depth += 1
  }
  return depth
}

function nestedDepth(listItem: TElement): number {
  let deepest = 0
  for (const child of listItem.children) {
    if (!isList(child)) continue
    for (const item of child.children) {
      if (ElementApi.isElement(item))
        deepest = Math.max(deepest, 1 + nestedDepth(item))
    }
  }
  return deepest
}

type ListDepthConfig = { maxDepth: number }

const ListDepthPlugin = createPlatePlugin({
  key: 'listDepth',
  options: { maxDepth: Number.POSITIVE_INFINITY } as ListDepthConfig,
}).overrideEditor(({ editor, getOption, tf: { normalizeNode, tab } }) => ({
  transforms: {
    normalizeNode(entry) {
      const [node, path] = entry
      if (isList(node) && listDepthAt(editor, path) > getOption('maxDepth')) {
        const parentItemPath = PathApi.parent(path)
        const outerListPath = PathApi.parent(parentItemPath)
        const firstTarget = (parentItemPath.at(-1) ?? 0) + 1
        editor.tf.withoutNormalizing(() => {
          node.children.forEach((_: unknown, offset: number) => {
            editor.tf.moveNodes({
              at: [...path, 0],
              to: [...outerListPath, firstTarget + offset],
            })
          })
          editor.tf.removeNodes({ at: path })
        })
        return
      }
      normalizeNode(entry)
    },
    tab(options) {
      const items = [
        ...(editor as SlateEditor).api.nodes({ match: { type: 'lic' } }),
      ].map(([, licPath]) => PathApi.parent(licPath))
      if (items.length === 0) return tab(options)

      const depths = items.map((itemPath) => listDepthAt(editor, itemPath))
      if (options.reverse) {
        return depths.every((depth) => depth <= 1) ? false : tab(options)
      }

      const canIndent = items.every((itemPath, index) => {
        const item = NodeApi.get(editor, itemPath) as TElement
        const hasPrevious = (itemPath.at(-1) ?? 0) > 0
        return (
          hasPrevious &&
          (depths[index] ?? 0) + 1 + nestedDepth(item) <= getOption('maxDepth')
        )
      })
      return canIndent ? tab(options) : false
    },
  },
}))

const listPlugin = ListPlugin.configure({
  inputRules: [
    blockShortcut('-', 'ul', outsideList),
    blockShortcut('*', 'ul', outsideList),
    blockShortcut(/^\d+\.$/, 'ol', outsideList),
  ],
})
  .configurePlugin(TaskListPlugin, { enabled: false })
  .configurePlugin(BulletedListPlugin, {
    node: { component: BulletedListElement },
  })
  .configurePlugin(NumberedListPlugin, {
    node: { component: NumberedListElement },
  })
  .configurePlugin(ListItemPlugin, { node: { component: ListItemElement } })

export function richTextEditorOptions(maxListDepth: number) {
  if (!Number.isInteger(maxListDepth) || maxListDepth < 1) {
    throw new RangeError(
      `maxListDepth must be an integer of at least 1; received ${maxListDepth}.`,
    )
  }
  return {
    nodeId: false,
    plugins: [
      ParagraphPlugin.withComponent(ParagraphElement),
      H2Plugin.withComponent(H2Element).configure({
        inputRules: [blockShortcut('#', 'h2'), blockShortcut('##', 'h2')],
        parsers: {
          html: { deserializer: { rules: [{ validNodeName: ['H1', 'H2'] }] } },
        },
      }),
      H3Plugin.withComponent(H3Element).configure({
        inputRules: [blockShortcut('###', 'h3')],
        parsers: {
          html: {
            deserializer: {
              rules: [{ validNodeName: ['H3', 'H4', 'H5', 'H6'] }],
            },
          },
        },
      }),
      BlockquotePlugin,
      listPlugin,
      ListDepthPlugin.configure({ options: { maxDepth: maxListDepth } }),
      slashPlugin,
      BoldPlugin.configure({ inputRules: [BoldRules.markdown()] }),
      ItalicPlugin.configure({
        inputRules: [
          ItalicRules.markdown(),
          ItalicRules.markdown({ variant: '_' }),
        ],
      }),
      UnderlinePlugin,
      StrikethroughPlugin.configure({
        inputRules: [StrikethroughRules.markdown()],
        shortcuts: { toggle: { keys: [[Key.Mod, Key.Shift, 'x']] } },
      }),
      CodePlugin.configure({
        inputRules: [CodeRules.markdown()],
        node: { component: CodeLeaf },
        shortcuts: { toggle: { keys: [[Key.Mod, 'e']] } },
      }),
    ],
  }
}
