import type { Meta, StoryObj } from '@storybook/react-vite'
import type { RichTextValue } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import {
  clearStored,
  paragraph,
  text,
  UsageDocument,
  usageParameters,
} from '../../test-utils/usage-kit.tsx'
import { sampleMentions } from './rich-text-editor-data.ts'

const articleKey = 'tc96:usage:blog'
const tasksKey = 'tc96:usage:tasks'
const notesKey = 'tc96:usage:other'

const article = [
  {
    children: [text('Por que começamos pelos patterns')],
    type: 'h2',
  },
  paragraph(
    text('Um design system só ajuda quando '),
    text('cada tela o usa do mesmo jeito', { bold: true }),
    text('. Por isso o '),
    {
      children: [text('guia de composição')],
      type: 'a',
      url: 'https://example.com/guia',
    },
    text(' vem antes de qualquer componente novo.'),
  ),
  {
    children: [paragraph(text('Decidimos pouco, mas decidimos por escrito.'))],
    type: 'blockquote',
  },
  { children: [text('Como medimos')], type: 'h3' },
  {
    children: [
      {
        children: [
          { children: [text('Tempo para montar uma tela nova')], type: 'lic' },
        ],
        type: 'li',
      },
      {
        children: [
          { children: [text('Quantas telas fogem do padrão')], type: 'lic' },
        ],
        type: 'li',
      },
    ],
    type: 'ul',
  },
  { children: [text('const tela = compor(pattern)')], type: 'code_block' },
] as unknown as RichTextValue

const todo = (label: string, checked = false) => ({
  checked,
  children: [text(label)],
  type: 'action_item',
})

const tasks = [
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

const cell = (label: string, type: 'td' | 'th' = 'td') => ({
  children: [paragraph(text(label))],
  type,
})

const meetingNotes = [
  {
    children: [paragraph(text('Decidimos manter o Plate e a UI do COSS.'))],
    icon: '📌',
    type: 'callout',
  },
  { children: [text('Quem faz o quê')], type: 'h2' },
  {
    children: [
      {
        children: [cell('Pessoa', 'th'), cell('Próximo passo', 'th')],
        type: 'tr',
      },
      { children: [cell('Ana'), cell('Publicar o guia')], type: 'tr' },
      { children: [cell('Bruno'), cell('Revisar os tokens')], type: 'tr' },
    ],
    type: 'table',
  },
  { children: [{ text: '' }], type: 'hr' },
  { children: [text('bun run check')], type: 'code_block' },
  paragraph(text('Próxima reunião')),
] as unknown as RichTextValue

const meta = {
  component: UsageDocument,
  parameters: usageParameters,
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Usages',
} satisfies Meta<typeof UsageDocument>

export default meta

type Story = StoryObj<typeof meta>

export const Article: Story = {
  args: {
    draggableBlocks: true,
    initial: { body: article, title: 'Como escrevemos o design system' },
    label: 'Artigo',
    pickImages: true,
    storageKey: articleKey,
    titleLabel: 'Artigo sem título',
  },
  beforeEach: () => clearStored(articleKey),
  render: (args) => (
    <div className="w-3xl max-w-full">
      <UsageDocument {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Artigo' })
    await expect(editor.querySelector('h2')).toHaveTextContent(
      'Por que começamos pelos patterns',
    )
    await expect(editor.querySelector('a')).toHaveAttribute(
      'href',
      'https://example.com/guia',
    )
    await expect(editor.querySelector('pre')).toHaveTextContent(
      'compor(pattern)',
    )
  },
}

export const Checklist: Story = {
  args: {
    draggableBlocks: true,
    initial: { body: tasks, title: 'Tarefas da semana' },
    label: 'Tarefas',
    mentions: sampleMentions,
    storageKey: tasksKey,
    titleLabel: 'Lista sem título',
  },
  beforeEach: () => clearStored(tasksKey),
  render: (args) => (
    <div className="w-2xl max-w-full">
      <UsageDocument {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Tarefas' })
    const boxes = within(editor).getAllByRole('checkbox')
    await expect(boxes).toHaveLength(3)
    await expect(boxes[0]).toBeChecked()
    await expect(boxes[1]).not.toBeChecked()
  },
}

export const MeetingNotes: Story = {
  args: {
    initial: { body: meetingNotes, title: 'Ata da reunião' },
    label: 'Ata',
    storageKey: notesKey,
    titleLabel: 'Ata sem título',
  },
  beforeEach: () => clearStored(notesKey),
  render: (args) => (
    <div className="w-2xl max-w-full">
      <UsageDocument {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Ata' })
    await expect(editor).toHaveTextContent('Decidimos manter o Plate')
    await expect(editor.querySelectorAll('th')).toHaveLength(2)
    await expect(editor.querySelectorAll('td')).toHaveLength(4)
    await expect(editor.querySelector('hr')).not.toBeNull()
    await expect(editor.querySelector('pre')).toHaveTextContent('bun run check')
  },
}
