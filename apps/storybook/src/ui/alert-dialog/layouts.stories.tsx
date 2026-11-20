import type { Meta, StoryObj } from '@storybook/react-vite'
import { alertDialogControlArgs } from './alert-dialog-controls.ts'
import {
  BodyAlertDialog,
  ComposedAlertDialog,
  DetachedTriggerAlertDialog,
  NestedAlertDialog,
} from './alert-dialog-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/AlertDialog/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutDescription: Story = {
  render: () => (
    <ComposedAlertDialog {...alertDialogControlArgs} description="" />
  ),
}

export const SingleAction: Story = {
  render: () => (
    <ComposedAlertDialog {...alertDialogControlArgs} cancel={false} />
  ),
}

export const WithBody: Story = {
  render: () => <BodyAlertDialog />,
}

export const DetachedTrigger: Story = {
  render: () => <DetachedTriggerAlertDialog />,
}

export const InsideDialog: Story = {
  render: () => <NestedAlertDialog />,
}
