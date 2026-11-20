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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedAlert {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Alert/Playground',
} satisfies Meta<AlertControls>

export default meta

type Story = StoryObj<AlertControls>

export const Playground: Story = {}
