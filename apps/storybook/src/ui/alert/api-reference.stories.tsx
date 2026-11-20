import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@tc96/ui/alert'
import { Slot } from '../../test-utils/anatomy-slot'
import { AlertCanvas } from './alert-frame.tsx'

const meta = {
  component: Alert,
  decorators: [AlertCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Alert/API Reference',
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Alert {...args}>
      <svg aria-hidden="true" data-anatomy="leading" viewBox="0 0 16 16">
        <rect
          fill="none"
          height="15"
          rx="3"
          stroke="currentColor"
          strokeDasharray="2 2"
          width="15"
          x="0.5"
          y="0.5"
        />
      </svg>
      <AlertTitle>
        <Slot name="AlertTitle" />
      </AlertTitle>
      <AlertDescription>
        <Slot name="AlertDescription" />
      </AlertDescription>
      <AlertAction>
        <Slot name="AlertAction" />
      </AlertAction>
    </Alert>
  ),
}
