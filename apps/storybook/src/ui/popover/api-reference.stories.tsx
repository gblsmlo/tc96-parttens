import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Popover,
  PopoverClose,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Popover,
  parameters: {
    docs: { story: { iframeHeight: '320px', inline: false } },
    layout: 'centered',
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Popover/API Reference',
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger render={<Button variant="outline" />}>
        <Slot name="PopoverTrigger" />
      </PopoverTrigger>
      <PopoverPopup>
        <div className="flex flex-col gap-2">
          <PopoverTitle>
            <Slot name="PopoverTitle" />
          </PopoverTitle>
          <PopoverDescription>
            <Slot name="PopoverDescription" />
          </PopoverDescription>
          <PopoverClose render={<Button size="sm" variant="ghost" />}>
            <Slot name="PopoverClose" />
          </PopoverClose>
        </div>
      </PopoverPopup>
    </Popover>
  ),
}
