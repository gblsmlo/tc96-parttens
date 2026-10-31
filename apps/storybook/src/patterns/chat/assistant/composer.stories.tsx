import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssistantComposer } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: { onSend: fn() },
  component: AssistantComposer,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Assistant/Composer',
} satisfies Meta<typeof AssistantComposer>

export default meta
type Story = StoryObj<typeof meta>

const input = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', {
    name: 'Mensagem para o assistente',
  })

export const SendTrimsAndClears: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.type(input(canvasElement), '  Por que falhou?  ')
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviar' }),
    )
    await expect(args.onSend).toHaveBeenCalledWith('Por que falhou?')
    await expect(input(canvasElement)).toHaveValue('')
  },
}

export const SendDisabledWhileEmpty: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Enviar' }),
    ).toBeDisabled()
  },
}

export const AttachHiddenWithoutCallback: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('button', { name: 'Anexar contexto' }),
    ).toBeNull()
  },
}

export const AttachCallsOnAttach: Story = {
  args: { onAttach: fn() },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Anexar contexto' }),
    )
    await expect(args.onAttach).toHaveBeenCalledTimes(1)
  },
}

export const PlaceholderFromProp: Story = {
  args: { placeholder: 'Pergunte algo' },
  play: async ({ canvasElement }) => {
    await expect(input(canvasElement)).toHaveAttribute(
      'placeholder',
      'Pergunte algo',
    )
  },
}
