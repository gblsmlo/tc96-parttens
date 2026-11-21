import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type FieldsetControls,
  fieldsetControlArgs,
  fieldsetControlArgTypes,
} from './fieldset-controls.ts'
import { FieldsetCanvas } from './fieldset-frame.tsx'
import { ComposedFieldset } from './fieldset-layouts.tsx'

const meta = {
  args: fieldsetControlArgs,
  argTypes: fieldsetControlArgTypes,
  decorators: [FieldsetCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedFieldset {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Fieldset/Playground',
} satisfies Meta<FieldsetControls>

export default meta

type Story = StoryObj<FieldsetControls>

export const Playground: Story = {}
