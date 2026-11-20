import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type AlertControls,
  alertControlArgs,
  alertControlArgTypes,
} from './alert-controls.ts'
import { AlertCanvas } from './alert-frame.tsx'
import { ComposedAlert } from './alert-layouts.tsx'

const meta = {
  args: alertControlArgs,
  argTypes: alertControlArgTypes,
  decorators: [AlertCanvas],
  parameters: {
    controls: { exclude: ['variant'] },
    layout: 'centered',
  },
  render: (args) => <ComposedAlert {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Alert/Stories',
} satisfies Meta<AlertControls>

export default meta

type Story = StoryObj<AlertControls>

export const Default: Story = {}

export const ErrorVariant: Story = {
  args: { variant: 'error' },
  name: 'Error',
}

export const Info: Story = {
  args: { variant: 'info' },
}

export const Success: Story = {
  args: { variant: 'success' },
}

export const Warning: Story = {
  args: { variant: 'warning' },
}
