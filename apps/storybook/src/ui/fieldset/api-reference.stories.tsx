import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fieldset, FieldsetLegend } from '@tc96/ui/fieldset'
import { Slot } from '../../test-utils/anatomy-slot'
import { FieldsetCanvas } from './fieldset-frame.tsx'

const meta = {
  component: Fieldset,
  decorators: [FieldsetCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Fieldset/API Reference',
} satisfies Meta<typeof Fieldset>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Fieldset {...args} className="flex flex-col gap-3">
      <FieldsetLegend>
        <Slot name="FieldsetLegend" />
      </FieldsetLegend>
      <Slot name="Field" />
      <Slot name="Field" />
    </Fieldset>
  ),
}
