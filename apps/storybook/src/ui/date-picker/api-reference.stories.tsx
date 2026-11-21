import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { IconSlot, Slot } from '../../test-utils/anatomy-slot'
import { DatePickerCanvas } from './date-picker-frame.tsx'
import { popupLabels } from './date-picker-layouts.tsx'

const meta = {
  component: Popover,
  decorators: [DatePickerCanvas],
  parameters: {
    docs: { story: { iframeHeight: '220px', inline: false } },
    layout: 'padded',
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/DatePicker/API Reference',
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger
        render={<Button className="w-full justify-start" variant="outline" />}
      >
        <IconSlot />
        <Slot name="PopoverTrigger" />
      </PopoverTrigger>
      <PopoverPopup aria-label={popupLabels.single}>
        <div className="flex h-24 w-64 items-center justify-center">
          <Slot name="Calendar" />
        </div>
      </PopoverPopup>
    </Popover>
  ),
}
