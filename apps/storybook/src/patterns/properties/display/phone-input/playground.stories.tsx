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
  render: (args) => <ComposedPhoneInput {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Phone Input/Playground',
} satisfies Meta<PhoneInputControls>

export default meta

type Story = StoryObj<PhoneInputControls>

export const Playground: Story = {}
