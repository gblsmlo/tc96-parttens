import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { EditableTextCanvas } from './editable-text-canvas.tsx'
import { StatefulEditableText } from './editable-text-layouts.tsx'

const meta = {
  decorators: [EditableTextCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Editable Text/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskTitle: Story = {
  render: () => (
    <StatefulEditableText
      ariaLabel="Task title"
      placeholder="Untitled task"
      size="sm"
      value="Check the contract signatures"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Task title' }),
    ).toHaveValue('Check the contract signatures')
  },
}

export const RecordTitle: Story = {
  render: () => (
    <StatefulEditableText
      ariaLabel="Record title"
      className="font-semibold"
      emptyValue="Untitled"
      revertWhenEmpty
      size="lg"
      value="Untitled"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Record title' }),
    ).toHaveValue('Untitled')
  },
}

export const Description: Story = {
  render: () => (
    <StatefulEditableText
      ariaLabel="Description"
      className="leading-relaxed"
      multiline
      placeholder="Add a description"
      size="sm"
      value="The contract needs both signatures before Tuesday’s meeting, and the finance team has to approve the payment terms first."
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('textbox', { name: 'Description' }),
    ).toBeVisible()
  },
}

export const ReadOnlyEmail: Story = {
  render: () => (
    <StatefulEditableText
      ariaLabel="Email"
      placeholder="No email"
      readOnly
      size="sm"
      value={null}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No email')).toBeVisible()
  },
}
