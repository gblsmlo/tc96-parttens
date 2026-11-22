import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneInputCanvas } from './phone-input-canvas.tsx'
import {
  type PhoneInputControls,
  phoneInputControlArgs,
  phoneInputControlArgTypes,
} from './phone-input-controls.ts'
import { ComposedPhoneInput } from './phone-input-layouts.tsx'

const meta = {
  args: phoneInputControlArgs,
  argTypes: phoneInputControlArgTypes,
  decorators: [PhoneInputCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'invalid', 'value'] },
  },
  render: (args) => <ComposedPhoneInput {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone Input/Stories',
} satisfies Meta<PhoneInputControls>

export default meta

type Story = StoryObj<PhoneInputControls>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: '' },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
