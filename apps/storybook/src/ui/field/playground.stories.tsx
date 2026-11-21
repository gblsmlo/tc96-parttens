import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type FieldControls,
  fieldControlArgs,
  fieldControlArgTypes,
} from './field-controls.ts'
import { FieldCanvas } from './field-frame.tsx'
import { ComposedField } from './field-layouts.tsx'

const meta = {
  args: fieldControlArgs,
  argTypes: fieldControlArgTypes,
  decorators: [FieldCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedField {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Field/Playground',
} satisfies Meta<FieldControls>

export default meta

type Story = StoryObj<FieldControls>

export const Playground: Story = {}
