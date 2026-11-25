import type { Meta, StoryObj } from '@storybook/react-vite'
import { AssignedProperty, AssignedPropertyBadge } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { assignees } from './assigned-controls'

const ignore = () => undefined

const meta = {
  component: AssignedProperty,
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Assigned/API Reference',
} satisfies Meta<typeof AssignedProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: {
    ariaLabel: 'AssignedProperty',
    onValueChange: ignore,
    options: assignees,
    value: 'gabriel',
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'AssignedProperty: Gabriel Melo',
      }),
    ).toBeVisible()
  },
}

export const BadgeAnatomy: Story = {
  args: { options: assignees, value: null },
  render: () => (
    <div className="flex items-center gap-2">
      <AssignedPropertyBadge
        placeholder="Sem responsável"
        option={assignees[1] ?? null}
      />
      <AssignedPropertyBadge placeholder="Sem responsável" option={null} />
    </div>
  ),
}
