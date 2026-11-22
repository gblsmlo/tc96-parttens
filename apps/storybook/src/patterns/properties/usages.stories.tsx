import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { LeadHeader, TaskHeader } from './properties-layouts'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Task: Story = {
  render: () => <TaskHeader />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Task properties',
    })

    await expect(group).toHaveTextContent('In progress')
    await expect(group).toHaveTextContent('Set assignee')
  },
}

export const Lead: Story = {
  render: () => <LeadHeader />,
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'Lead properties',
    })

    await expect(group).toHaveTextContent('Ana Souza')
    await expect(group).toHaveTextContent('Follow-up')
  },
}
