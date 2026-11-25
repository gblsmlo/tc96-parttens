import { RichTextEditor3 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-3'
import { fn } from 'storybook/test'
import {
  contractValue,
  redlineAuthors,
  redlineTime,
} from '../fixtures/rich-text-editor-3.ts'
import type { RichTextEditor3Controls } from './rich-text-editor-3-controls.ts'

export const richTextEditor3Handlers = {
  onChange: fn(),
  onDecision: fn(),
  onExport: fn(),
}

export const ComposedRichTextEditor3 = ({
  authorId,
  existingChanges,
  title,
}: Readonly<RichTextEditor3Controls>) => {
  const author =
    redlineAuthors.find((person) => person.id === authorId) ?? redlineAuthors[0]
  if (!author) return null
  return (
    <RichTextEditor3
      author={author}
      authors={redlineAuthors}
      defaultValue={contractValue(existingChanges)}
      formatTime={redlineTime}
      key={`${authorId}-${existingChanges}`}
      onChange={richTextEditor3Handlers.onChange}
      onDecision={richTextEditor3Handlers.onDecision}
      onExport={richTextEditor3Handlers.onExport}
      title={title}
    />
  )
}

export const redlineDocumentName = 'Contrato de prestação de serviços'

const settle = () => new Promise((resolve) => setTimeout(resolve, 150))

function textNodeWith(editor: HTMLElement, text: string): Text {
  for (const element of editor.querySelectorAll('[data-slate-string]')) {
    const node = element.firstChild
    if (node instanceof Text && (node.textContent ?? '').includes(text))
      return node
  }
  throw new Error(`No text node contains "${text}"`)
}

export async function selectRedlineText(
  editor: HTMLElement,
  text: string,
  collapse: 'end' | false = false,
): Promise<void> {
  const node = textNodeWith(editor, text)
  const start = (node.textContent ?? '').indexOf(text)
  const range = editor.ownerDocument.createRange()
  range.setStart(node, start)
  range.setEnd(node, start + text.length)
  if (collapse) range.collapse(false)
  editor.focus()
  const selection = editor.ownerDocument.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  await settle()
}
