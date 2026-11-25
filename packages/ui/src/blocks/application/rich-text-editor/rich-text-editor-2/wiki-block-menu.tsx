import { DotsThreeIcon, PlusIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { stripRichTextNodeIds } from '@tc96/ui/helpers/rich-text'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  applyBlock,
  applyExtraBlock,
  type RichTextEditorInstance,
} from '@tc96/ui/patterns/rich-text-editor'
import type { TElement } from 'platejs'
import type { RichTextEditor2BlockKind, RichTextEditor2Labels } from './types'

const kinds = [
  'p',
  'h2',
  'h3',
  'ul',
  'ol',
  'todo',
  'blockquote',
  'code',
  'callout',
] as const satisfies readonly RichTextEditor2BlockKind[]

function turnInto(
  editor: RichTextEditorInstance,
  index: number,
  kind: RichTextEditor2BlockKind,
): void {
  const end = editor.api.end([index])
  if (!end) return
  editor.tf.focus()
  editor.tf.select(end)
  if (kind === 'todo' || kind === 'code' || kind === 'callout')
    applyExtraBlock(editor, kind)
  else applyBlock(editor, kind)
}

function duplicate(editor: RichTextEditorInstance, index: number): void {
  const node = editor.children[index]
  if (!node) return
  const [copy] = stripRichTextNodeIds([node as never])
  editor.tf.insertNodes(copy as TElement, { at: [index + 1] })
}

function remove(editor: RichTextEditorInstance, index: number): void {
  editor.tf.removeNodes({ at: [index] })
  if (editor.children.length === 0)
    editor.tf.insertNodes(editor.api.create.block(), { at: [0] })
}

function addBelow(editor: RichTextEditorInstance, index: number): void {
  editor.tf.insertNodes(editor.api.create.block(), { at: [index + 1] })
  editor.tf.focus({ at: [index + 1], edge: 'start' })
}

export function WikiBlockGutter({
  editor,
  index,
  labels,
  top,
}: Readonly<{
  editor: RichTextEditorInstance
  index: number
  labels: RichTextEditor2Labels
  top: number
}>) {
  const last = editor.children.length - 1

  return (
    <div
      className="absolute inset-s-0 z-10 flex items-center gap-0.5"
      data-slot="wiki-block-gutter"
      style={{ top }}
    >
      <Button
        aria-label={labels.blockAdd}
        onClick={() => addBelow(editor, index)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <PlusIcon aria-hidden="true" />
      </Button>
      <Menu>
        <MenuTrigger
          aria-label={labels.blockMenu}
          render={<Button size="icon-sm" type="button" variant="ghost" />}
        >
          <DotsThreeIcon aria-hidden="true" weight="bold" />
        </MenuTrigger>
        <MenuPopup align="start">
          <MenuSub>
            <MenuSubTrigger>{labels.blockTurnInto}</MenuSubTrigger>
            <MenuSubPopup>
              {kinds.map((kind) => (
                <MenuItem
                  key={kind}
                  onClick={() => turnInto(editor, index, kind)}
                >
                  {labels.blockKinds[kind]}
                </MenuItem>
              ))}
            </MenuSubPopup>
          </MenuSub>
          <MenuItem onClick={() => duplicate(editor, index)}>
            {labels.blockDuplicate}
          </MenuItem>
          <MenuItem
            disabled={index === 0}
            onClick={() =>
              editor.tf.moveNodes({ at: [index], to: [index - 1] })
            }
          >
            {labels.blockMoveUp}
          </MenuItem>
          <MenuItem
            disabled={index >= last}
            onClick={() =>
              editor.tf.moveNodes({ at: [index], to: [index + 1] })
            }
          >
            {labels.blockMoveDown}
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => remove(editor, index)} variant="destructive">
            {labels.blockDelete}
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  )
}
