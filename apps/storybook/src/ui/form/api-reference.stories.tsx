import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@tc96/ui/form'
import { Slot } from '../../test-utils/anatomy-slot'
import { FormCanvas } from './form-frame.tsx'

const meta = {
  component: Form,
  decorators: [FormCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Form/API Reference',
} satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  args: {
    className: 'flex flex-col gap-4 rounded-lg border border-dashed p-4',
  },
  render: (args) => (
    <Form {...args}>
      <Slot name="Field" />
      <Slot name="Field" />
      <Slot name="Submit button" />
    </Form>
  ),
}
