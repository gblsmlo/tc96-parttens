import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: ScrollArea,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/ScrollArea/API Reference',
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { className: 'h-48 w-64 rounded-lg border' },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="flex h-96 w-96 flex-col p-2">
        <Slot name="children" />
      </div>
    </ScrollArea>
  ),
}
