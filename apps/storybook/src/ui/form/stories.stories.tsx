import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type FormControls,
  formControlArgs,
  formControlArgTypes,
} from './form-controls.ts'
import { FormCanvas } from './form-frame.tsx'
import { ComposedForm } from './form-layouts.tsx'

const meta = {
  args: formControlArgs,
  argTypes: formControlArgTypes,
  decorators: [FormCanvas],
  parameters: {
    controls: { exclude: ['errors'] },
    layout: 'centered',
  },
  render: (args) => <ComposedForm {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Form/Stories',
} satisfies Meta<FormControls>

export default meta

type Story = StoryObj<FormControls>

export const Default: Story = {}

export const Errors: Story = {
  args: { errors: 'This email is already registered.' },
}
