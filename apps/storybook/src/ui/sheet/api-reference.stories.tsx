import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from '@tc96/ui/sheet'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Sheet,
  parameters: {
    docs: { story: { iframeHeight: '480px', inline: false } },
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Sheet/API Reference',
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        <Slot name="SheetTrigger" />
      </SheetTrigger>
      <SheetPopup>
        <SheetHeader>
          <SheetTitle>
            <Slot name="SheetTitle" />
          </SheetTitle>
          <SheetDescription>
            <Slot name="SheetDescription" />
          </SheetDescription>
        </SheetHeader>
        <SheetPanel>
          <Slot name="SheetPanel" />
        </SheetPanel>
        <SheetFooter>
          <SheetClose render={<Button variant="ghost" />}>
            <Slot name="SheetClose" />
          </SheetClose>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  ),
}
