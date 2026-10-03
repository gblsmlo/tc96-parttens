import type { Meta, StoryObj } from '@storybook/react-vite'
import type { RichTextValue } from '@tc96/parttens'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { moveCaretToLineEnd } from '../../../test-utils/rich-text-typing'
import {
  clearStored,
  paragraph,
  readStored,
  text,
  UsageDocument,
  usageParameters,
} from '../../../test-utils/usage-kit'

const storageKey = 'tc96:usage:tasks'

const todo = (label: string, checked = false) => ({
  checked,
  children: [text(label)],
  type: 'action_item',
})

const body = [
  { children: [text('Sprint 42')], type: 'h2' },
  paragraph(
    text('Entrega prevista para '),
    { children: [{ text: '' }], date: '2026-10-16', type: 'date' },
    text('.'),
  ),
  todo('Revisar o layout do painel de tarefas', true),
  todo('Ligar o filtro por responsável'),
  todo('Escrever os testes de interação'),
  paragraph(text('Dúvidas com ')),
] as unknown as RichTextValue

const meta = {
  args: {
    draggableBlocks: true,
    initial: { body, title: 'Tarefas da semana' },
    label: 'Tarefas',
    mentions: [
      { id: 'ana', label: 'Ana Souza' },
      { id: 'bruno', label: 'Bruno Lima' },
      { id: 'carla', label: 'Carla Dias' },
    ],
    storageKey,
    titleLabel: 'Lista sem título',
  },
  beforeEach: () => clearStored(storageKey),
  component: UsageDocument,
  parameters: usageParameters,
  render: (args) => (
    <div className="w-2xl max-w-full">
      <UsageDocument {...args} />
    </div>
  ),
  title: 'Patterns/Rich Text Editor/Usages/Tasks',
} satisfies Meta<typeof UsageDocument>

export default meta

type Story = StoryObj<typeof meta>

export const Checklist: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Tarefas' })
    const boxes = within(editor).getAllByRole('checkbox')
    await expect(boxes).toHaveLength(3)
    await expect(boxes[0]).toBeChecked()
    await expect(boxes[1]).not.toBeChecked()

    await userEvent.click(boxes[1] as HTMLElement)
    await waitFor(() => expect(boxes[1]).toBeChecked())
    await waitFor(() =>
      expect(JSON.stringify(readStored(storageKey)?.body)).toContain(
        '"checked":true,"children":[{"text":"Ligar o filtro',
      ),
    )
    await expect(canvas.getByText('Salvo neste navegador')).toBeInTheDocument()
  },
}

export const MentionATeammate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Tarefas' })
    const last = Array.from(
      editor.querySelectorAll<HTMLElement>('[data-slate-string]'),
    ).at(-1) as HTMLElement
    await userEvent.click(last)
    moveCaretToLineEnd(editor)
    await userEvent.keyboard('@car')

    const listbox = await within(document.body).findByRole('listbox', {
      name: 'Pessoas',
    })
    await expect(within(listbox).getAllByRole('option')).toHaveLength(1)
    await userEvent.keyboard('{Enter}')

    await waitFor(() =>
      expect(editor.querySelector('[data-slate-void=true]')).not.toBeNull(),
    )
    await waitFor(() =>
      expect(JSON.stringify(readStored(storageKey)?.body)).toContain(
        '"value":"Carla Dias"',
      ),
    )
  },
}
