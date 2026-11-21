import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from '@tc96/ui/number-field'
import { NumberFieldCanvas } from './number-field-frame.tsx'

const meta = {
  component: NumberField,
  decorators: [NumberFieldCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/NumberField/API Reference',
} satisfies Meta<typeof NumberField>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <NumberField defaultValue={0} {...args}>
      <NumberFieldScrubArea label="NumberFieldScrubArea" />
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  ),
}
