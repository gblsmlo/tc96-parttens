import { RichTextEditor5 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  rolloutAuthors,
  rolloutTime,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'
import type { RichTextEditor5Controls } from './rich-text-editor-5-controls.ts'

export const richTextEditor5Handlers = {
  onChange: fn(),
  onDecision: fn(),
}

export const ComposedRichTextEditor5 = ({
  authorId,
  stepDelay,
}: Readonly<RichTextEditor5Controls>) => {
  const author =
    rolloutAuthors.find((person) => person.id === authorId) ?? rolloutAuthors[0]
  if (!author) return null
  return (
    <RichTextEditor5
      author={author}
      defaultValue={rolloutValue()}
      formatTime={rolloutTime}
      key={authorId}
      onChange={richTextEditor5Handlers.onChange}
      onDecision={richTextEditor5Handlers.onDecision}
      stepDelay={stepDelay}
    />
  )
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 150))

function elementWith(editor: HTMLElement, text: string): HTMLElement {
  for (const element of editor.querySelectorAll<HTMLElement>(
    '[data-slate-string]',
  )) {
    if ((element.textContent ?? '').includes(text)) return element
  }
  throw new Error(`No text leaf contains "${text}"`)
}

export async function selectRolloutText(
  editor: HTMLElement,
  text: string,
): Promise<void> {
  const element = elementWith(editor, text)
  const start = (element.textContent ?? '').indexOf(text)
  await userEvent.pointer([
    { keys: '[MouseLeft>]', offset: start, target: element },
    { offset: start + text.length, target: element },
    { keys: '[/MouseLeft]' },
  ])
  await settle()
}

export const editorOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', { name: 'Plano de lançamento' })

export const dockOf = (canvasElement: HTMLElement) =>
  within(
    within(canvasElement).getByRole('region', {
      name: 'Assistente de escrita',
    }),
  )

export const reviewItems = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>('[data-slot="suggestion-review-item"]'),
  )

export const requestOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', {
    name: 'Peça algo ao assistente',
  })

export const topBlocks = (canvasElement: HTMLElement) =>
  Array.from(
    editorOf(canvasElement).querySelectorAll<HTMLElement>(
      ':scope > [data-slate-node="element"]',
    ),
  )

export async function runTask(canvasElement: HTMLElement, name: string) {
  const tasks = within(
    dockOf(canvasElement).getByRole('group', { name: 'Tarefas do assistente' }),
  )
  await userEvent.click(tasks.getByRole('button', { name }))
}

export async function waitForFinished(canvasElement: HTMLElement) {
  await waitFor(
    () =>
      expect(
        canvasElement.querySelector('[data-slot="assistant-status"]'),
      ).toHaveTextContent(/Pronto|Interrompido|falhou/),
    { timeout: 8000 },
  )
}

export { screen }
