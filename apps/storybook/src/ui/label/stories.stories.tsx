import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type LabelControls,
  labelControlArgs,
  labelControlArgTypes,
} from './label-controls.ts'
import { LabelCanvas } from './label-frame.tsx'
import { ComposedLabel } from './label-layouts.tsx'

const meta = {
  args: labelControlArgs,
  argTypes: labelControlArgTypes,
  decorators: [LabelCanvas],
  parameters: { controls: { exclude: ['element'] }, layout: 'centered' },
  render: (args) => <ComposedLabel {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Label/Stories',
} satisfies Meta<LabelControls>

export default meta

type Story = StoryObj<LabelControls>

export const Default: Story = {}
