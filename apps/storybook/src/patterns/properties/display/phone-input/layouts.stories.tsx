import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhoneInputCanvas } from './phone-input-canvas.tsx'
import { phoneInputControlArgs } from './phone-input-controls.ts'
import {
  ComposedPhoneInput,
  LabelOverFieldPhoneInput,
} from './phone-input-layouts.tsx'

const meta = {
  decorators: [PhoneInputCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/PhoneInput/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedPhoneInput {...phoneInputControlArgs} />,
}

export const LabelOverField: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The visible label above the field, which repeats its `ariaLabel`, and an optional hint or error message under it. For a form or a detail panel, where the field needs its name in view and the consumer shows its own message.',
      },
    },
  },
  render: () => (
    <LabelOverFieldPhoneInput
      {...phoneInputControlArgs}
      message="Com DDD, como aparece no cadastro."
    />
  ),
}
