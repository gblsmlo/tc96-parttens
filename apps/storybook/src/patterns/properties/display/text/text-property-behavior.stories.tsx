import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextProperty } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  component: TextProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Behavior',
} satisfies Meta<typeof TextProperty>

export default meta

type Story = StoryObj<typeof TextProperty>

export const SecondaryBadgeForValue: Story = {
  args: { ariaLabel: 'Source', value: 'Manual' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Source: Manual'),
    ).toHaveTextContent('Manual')
  },
}

export const FallbackWhenEmpty: Story = {
  args: { fallback: 'No type', value: null },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No type')).toBeInTheDocument()
  },
}

export const PlainText: Story = {
  args: { value: 'Manual', variant: 'plain' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Manual')).toBeInTheDocument()
  },
}

export const AddButtonFocusesField: Story = {
  args: {
    addLabel: 'Documento',
    ariaLabel: 'Documento',
    onCommit: fn(),
    value: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Documento' }))

    const field = canvas.getByRole('textbox', { name: 'Documento' })
    await expect(field).toHaveFocus()
    await expect(field).toHaveAttribute('data-editing')
  },
}

export const InlineEditingTakesNoFocus: Story = {
  args: {
    ariaLabel: 'Documento',
    editing: 'inline',
    onCommit: fn(),
    value: null,
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.ownerDocument.activeElement).toBe(
      canvasElement.ownerDocument.body,
    )
  },
}
