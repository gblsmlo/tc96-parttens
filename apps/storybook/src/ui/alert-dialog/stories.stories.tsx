import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AlertDialogControls,
  alertDialogControlArgs,
  alertDialogControlArgTypes,
} from './alert-dialog-controls.ts'
import { ComposedAlertDialog } from './alert-dialog-layouts.tsx'

const meta = {
  args: alertDialogControlArgs,
  argTypes: alertDialogControlArgTypes,
  parameters: {
    controls: { exclude: ['bottomStickOnMobile', 'footerVariant'] },
  },
  render: (args) => <ComposedAlertDialog {...args} />,
  tags: ['!autodocs'],
  title: 'UI/AlertDialog/Stories',
} satisfies Meta<AlertDialogControls>

export default meta

type Story = StoryObj<AlertDialogControls>

export const Default: Story = {}

export const FooterBare: Story = {
  args: { footerVariant: 'bare' },
  name: 'Footer bare',
}

export const BottomStickOnMobileFalse: Story = {
  args: { bottomStickOnMobile: false },
  name: 'bottomStickOnMobile false',
}
