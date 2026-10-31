import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowStepLibraryItem } from '@tc96/parttens'
import { expect, fn, within } from 'storybook/test'

const description = 'Envia uma mensagem por e-mail'

const meta = {
  args: {
    onAdd: fn(),
    type: {
      description,
      group: 'Mensagens',
      id: 'send-email',
      label: 'Enviar e-mail',
    },
  },
  component: FlowStepLibraryItem,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Item',
} satisfies Meta<typeof FlowStepLibraryItem>

export default meta
type Story = StoryObj<typeof meta>

const button = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Enviar e-mail' })

export const DescribedByVisibleDescription: Story = {
  play: async ({ canvasElement }) => {
    await expect(button(canvasElement)).toHaveAccessibleDescription(description)
    const id = button(canvasElement).getAttribute('aria-describedby')
    await expect(id).toBeTruthy()
    await expect(document.getElementById(id as string)?.textContent).toBe(
      description,
    )
  },
}

export const CollapsedDropsDescription: Story = {
  args: { collapsed: true },
  play: async ({ canvasElement }) => {
    await expect(button(canvasElement)).not.toHaveAttribute('aria-describedby')
  },
}

export const DisabledBlocksClickAndDrag: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(button(canvasElement)).toBeDisabled()
    await expect(button(canvasElement)).toHaveAttribute('draggable', 'false')
  },
}
