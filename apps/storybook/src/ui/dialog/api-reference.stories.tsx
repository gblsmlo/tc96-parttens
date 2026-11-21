import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '@tc96/ui/dialog'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Dialog,
  parameters: {
    docs: { story: { iframeHeight: '480px', inline: false } },
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Dialog/API Reference',
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Slot name="DialogTrigger" />
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            <Slot name="DialogTitle" />
          </DialogTitle>
          <DialogDescription>
            <Slot name="DialogDescription" />
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <Slot name="DialogPanel" />
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>
            <Slot name="DialogClose" />
          </DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  ),
}
