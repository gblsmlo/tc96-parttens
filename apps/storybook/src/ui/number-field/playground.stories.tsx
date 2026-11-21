import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type NumberFieldControls,
  numberFieldControlArgs,
  numberFieldControlArgTypes,
} from './number-field-controls.ts'
import { NumberFieldCanvas } from './number-field-frame.tsx'
import { ComposedNumberField } from './number-field-layouts.tsx'

const meta = {
  args: numberFieldControlArgs,
  argTypes: numberFieldControlArgTypes,
  decorators: [NumberFieldCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedNumberField {...args} />,
  tags: ['!autodocs'],
  title: 'UI/NumberField/Playground',
} satisfies Meta<NumberFieldControls>

export default meta

type Story = StoryObj<NumberFieldControls>

export const Playground: Story = {}
