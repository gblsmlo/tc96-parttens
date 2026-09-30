import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from 'tc96/ui'

const meta = {
  title: 'UI/Input',
  component: Input,
  args: {
    'aria-label': 'Project name',
    placeholder: 'TC96 project',
    size: 'md',
    type: 'text',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Editable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Project name' })
    await userEvent.type(input, 'Lemind')
    await expect(input).toHaveValue('Lemind')
  },
}

export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Invalid value',
  },
}
