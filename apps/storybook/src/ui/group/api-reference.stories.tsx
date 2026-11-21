import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Group, GroupSeparator, GroupText } from '@tc96/ui/group'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Group,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Group/API Reference',
} satisfies Meta<typeof Group>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { children: null },
  render: (args) => (
    <Group {...args} aria-label="Group">
      <GroupText>GroupText</GroupText>
      <GroupSeparator />
      <Button variant="outline">
        <Slot name="Control" />
      </Button>
      <GroupSeparator />
      <Button variant="outline">
        <Slot name="Control" />
      </Button>
    </Group>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Group' })
    await expect(group).toHaveAttribute('data-slot', 'group')
    await expect(within(group).getByText('GroupText')).toHaveAttribute(
      'data-slot',
      'group-text',
    )
    const separators = within(group).getAllByRole('separator')
    await expect(separators).toHaveLength(2)
    for (const separator of separators) {
      await expect(separator).toHaveAttribute('data-slot', 'separator')
    }
    await expect(
      within(group).getAllByRole('button', { name: 'Control' }),
    ).toHaveLength(2)
  },
}
