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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedLabel {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Label/Playground',
} satisfies Meta<LabelControls>

export default meta

type Story = StoryObj<LabelControls>

export const Playground: Story = {}
