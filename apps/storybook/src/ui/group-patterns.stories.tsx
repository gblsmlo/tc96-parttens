import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from 'lucide-react'
import { expect, userEvent, within } from 'storybook/test'
import { Button, Group, GroupSeparator, GroupText, Input } from 'tc96/ui'

const meta = {
  title: 'UI/Group/Patterns',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const WithInputAndCurrencyText: Story = {
  render: () => (
    <Group aria-label="Price input">
      <Input
        aria-label="Enter the amount"
        className="text-right"
        defaultValue="100"
        id="amount"
        inputMode="decimal"
        type="text"
      />
      <GroupSeparator />
      <GroupText render={<label aria-label="Currency" htmlFor="amount" />}>
        USD
      </GroupText>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const amount = canvas.getByRole('textbox', { name: 'Enter the amount' })

    await userEvent.clear(amount)
    await userEvent.type(amount, '149.90')

    await expect(amount).toHaveValue('149.90')
    await expect(canvas.getByText('USD')).toHaveAccessibleName('Currency')
  },
}

export const WithAddButtonAndInput: Story = {
  render: () => (
    <Group aria-label="Add item">
      <Button aria-label="Add" size="md" variant="outline">
        <PlusIcon aria-hidden />
      </Button>
      <GroupSeparator />
      <Input aria-label="Item name" placeholder="Enter item name" type="text" />
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Item name' })

    await userEvent.type(input, 'New project')

    await expect(canvas.getByRole('button', { name: 'Add' })).toBeEnabled()
    await expect(input).toHaveValue('New project')
  },
}
