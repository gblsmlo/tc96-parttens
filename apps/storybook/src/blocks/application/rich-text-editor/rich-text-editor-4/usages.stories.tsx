import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import {
  placeCaretAtEnd,
  typedText,
} from '../../../../test-utils/rich-text-typing.ts'
import {
  type RichTextEditor4Controls,
  richTextEditor4ControlArgs,
} from './rich-text-editor-4-controls.ts'
import {
  ComposedRichTextEditor4,
  TwoClients,
  withToasts,
} from './rich-text-editor-4-layouts.tsx'

const meta = {
  args: richTextEditor4ControlArgs,
  decorators: [withToasts],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor4/Usages',
} satisfies Meta<RichTextEditor4Controls>

export default meta

type Story = StoryObj<typeof meta>

export const ReviewingTheSpecWithTheTeam: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(
      async () => {
        await expect(
          canvas.getByRole('button', {
            name: 'Abrir conversa sobre "Conversão"',
          }),
        ).toBeVisible()
        await expect(
          typedText(
            canvas.getByRole('textbox', { name: 'Especificação do produto' }),
          ),
        ).toContain('Revisar com o time de dados.')
      },
      { timeout: 10000 },
    )
    await expect(
      canvas.getByRole('button', { name: 'Carla Prado, Editando' }),
    ).toBeVisible()
  },
}

export const TwoPeopleOnTheSameDocument: Story = {
  render: () => <TwoClients />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = await waitFor(() => {
      const editors = canvas.getAllByRole('textbox')
      expect(editors).toHaveLength(2)
      expect(typedText(editors[0] as HTMLElement)).toContain(
        'Checkout em um passo',
      )
      return editors as [HTMLElement, HTMLElement]
    })
    placeCaretAtEnd(first)
    await userEvent.keyboard(' Aprovado pela Marina.')
    await waitFor(() =>
      expect(typedText(second)).toContain('Aprovado pela Marina.'),
    )
  },
}
