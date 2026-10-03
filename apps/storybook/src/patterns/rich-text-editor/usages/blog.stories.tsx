import type { Meta, StoryObj } from '@storybook/react-vite'
import type { RichTextValue } from '@tc96/parttens'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { placeCaretAtEnd } from '../../../test-utils/rich-text-typing'
import {
  clearStored,
  paragraph,
  readStored,
  text,
  UsageDocument,
  usageParameters,
} from '../../../test-utils/usage-kit'

const storageKey = 'tc96:usage:blog'

const body = [
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

const meta = {
  args: {
    draggableBlocks: true,
    initial: { body, title: 'Como escrevemos o design system' },
    label: 'Artigo',
    pickImages: true,
    storageKey,
    titleLabel: 'Artigo sem título',
  },
  beforeEach: () => clearStored(storageKey),
  component: UsageDocument,
  parameters: usageParameters,
  render: (args) => (
    <div className="w-3xl max-w-full">
      <UsageDocument {...args} />
    </div>
  ),
  title: 'Patterns/Rich Text Editor/Usages/Blog',
} satisfies Meta<typeof UsageDocument>

export default meta

type Story = StoryObj<typeof meta>

export const Article: Story = {
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
    await expect(canvas.getByText('Ainda não salvo')).toBeInTheDocument()
  },
}

export const DraftPersistsInTheBrowser: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('textbox', { name: 'Título' })
    title.focus()
    await waitFor(() => expect(title).toHaveFocus())
    await userEvent.keyboard('{End} (rascunho)')

    await waitFor(() =>
      expect(readStored(storageKey)?.title).toBe(
        'Como escrevemos o design system (rascunho)',
      ),
    )
    await expect(canvas.getByText('Salvo neste navegador')).toBeInTheDocument()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Restaurar exemplo' }),
    )
    await waitFor(() => expect(readStored(storageKey)).toBeNull())
    await expect(canvas.getByRole('textbox', { name: 'Título' })).toHaveValue(
      'Como escrevemos o design system',
    )
  },
}

const pixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

export const ImageFromThePicker: Story = {
  args: {
    pickImage: async () => ({ alt: 'capa.png', url: pixel }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Artigo' })
    placeCaretAtEnd(editor, editor.querySelector('h2 [data-slate-string]'))
    await waitFor(() => expect(editor).toHaveFocus())
    await userEvent.keyboard('{Enter}/imagem{Enter}')

    await waitFor(() =>
      expect(editor.querySelector('img')).toHaveAttribute('alt', 'capa.png'),
    )
    await waitFor(() =>
      expect(JSON.stringify(readStored(storageKey)?.body)).toContain('"img"'),
    )
    await expect(screen.queryByRole('listbox', { name: 'Blocos' })).toBeNull()
  },
}
