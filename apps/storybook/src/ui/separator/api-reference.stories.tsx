import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '@tc96/ui/separator'
import { Slot } from '../../test-utils/anatomy-slot'
import { SeparatorCanvas } from './separator-frame.tsx'

const meta = {
  component: Separator,
  decorators: [SeparatorCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Separator/API Reference',
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Slot name="Content" />
      <Separator {...args} />
      <Slot name="Content" />
    </div>
  ),
}
