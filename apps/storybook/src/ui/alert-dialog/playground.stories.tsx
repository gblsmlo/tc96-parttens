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
  render: (args) => <ComposedAlertDialog {...args} />,
  tags: ['!autodocs'],
  title: 'UI/AlertDialog/Playground',
} satisfies Meta<AlertDialogControls>

export default meta

type Story = StoryObj<AlertDialogControls>

export const Playground: Story = {}
