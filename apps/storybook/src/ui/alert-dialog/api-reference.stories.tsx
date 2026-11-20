import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: AlertDialog,
  parameters: {
    docs: { story: { iframeHeight: '420px', inline: false } },
  },
  tags: ['!autodocs', '!dev'],
  title: 'UI/AlertDialog/API Reference',
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        <Slot name="AlertDialogTrigger" />
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Slot name="AlertDialogTitle" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Slot name="AlertDialogDescription" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            <Slot name="AlertDialogClose" />
          </AlertDialogClose>
          <AlertDialogClose render={<Button variant="ghost" />}>
            <Slot name="AlertDialogClose" />
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  ),
}
