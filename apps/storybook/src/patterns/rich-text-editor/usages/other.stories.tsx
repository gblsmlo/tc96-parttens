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

const storageKey = 'tc96:usage:other'

const cell = (label: string, type: 'td' | 'th' = 'td') => ({
  children: [paragraph(text(label))],
  type,
})

const body = [
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
  args: {
    initial: { body, title: 'Ata da reunião' },
    label: 'Ata',
    storageKey,
    titleLabel: 'Ata sem título',
  },
  beforeEach: () => clearStored(storageKey),
  component: UsageDocument,
  parameters: usageParameters,
  render: (args) => (
    <div className="w-2xl max-w-full">
      <UsageDocument {...args} />
    </div>
  ),
  title: 'Patterns/Rich Text Editor/Usages/Other',
} satisfies Meta<typeof UsageDocument>

export default meta

type Story = StoryObj<typeof meta>

export const MeetingNotes: Story = {
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

export const AddADateAndATable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = canvas.getByRole('textbox', { name: 'Ata' })
    const last = Array.from(
      editor.querySelectorAll<HTMLElement>('[data-slate-string]'),
    ).at(-1) as HTMLElement
    await userEvent.click(last)
    moveCaretToLineEnd(editor)

    await userEvent.keyboard(' {Enter}/data{Enter}')
    await waitFor(() => expect(editor.querySelector('time')).not.toBeNull())

    await userEvent.keyboard('{Enter}/tabela{Enter}')
    await waitFor(() =>
      expect(editor.querySelectorAll('td, th')).toHaveLength(15),
    )
    await waitFor(() =>
      expect(JSON.stringify(readStored(storageKey)?.body)).toContain('"date"'),
    )
  },
}
