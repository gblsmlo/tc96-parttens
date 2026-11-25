import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import {
  RichTextEditor5,
  type RichTextEditor5Props,
} from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  rolloutAuthors,
  rolloutBreadcrumbs,
  rolloutTime,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'
import type { RichTextEditor5Controls } from './rich-text-editor-5-controls.ts'

export const richTextEditor5Handlers = {
  onChange: fn(),
  onDecision: fn(),
}

export const PlanPage = (props: Readonly<RichTextEditor5Props>) => (
  <RichTextEditor5
    {...props}
    navbar={({ status }) => (
      <Navbar1 breadcrumbs={rolloutBreadcrumbs} status={status} />
    )}
  />
)

export const ComposedRichTextEditor5 = ({
  authorId,
  stepDelay,
}: Readonly<RichTextEditor5Controls>) => {
  const author =
    rolloutAuthors.find((person) => person.id === authorId) ?? rolloutAuthors[0]
  if (!author) return null
  return (
    <PlanPage
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
    within(canvasElement).getByRole('complementary', {
      name: 'Assistente de escrita',
    }),
  )

export const statusOf = (canvasElement: HTMLElement) => {
  const status = canvasElement.querySelector<HTMLElement>(
    '[data-slot="assistant-status"]',
  )
  if (!status) throw new Error('No assistant status')
  return status
}

export async function openTaskMenu(canvasElement: HTMLElement) {
  await userEvent.click(
    dockOf(canvasElement).getByRole('button', { name: 'Escolher uma tarefa' }),
  )
  return within(await screen.findByRole('listbox'))
}

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
  const group = dockOf(canvasElement).queryByRole('group', {
    name: 'Tarefas do assistente',
  })
  if (group) {
    await userEvent.click(within(group).getByRole('button', { name }))
    return
  }
  const menu = await openTaskMenu(canvasElement)
  await userEvent.click(menu.getByRole('option', { name }))
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
