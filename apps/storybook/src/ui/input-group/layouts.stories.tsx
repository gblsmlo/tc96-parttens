import type { Meta, StoryObj } from '@storybook/react-vite'
import { inputGroupControlArgs } from './input-group-controls.ts'
import { InputGroupCanvas } from './input-group-frame.tsx'
import { ComposedInputGroup } from './input-group-layouts.tsx'

const meta = {
  decorators: [InputGroupCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/InputGroup/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TextAddon: Story = {
  render: () => (
    <ComposedInputGroup {...inputGroupControlArgs} icon={false} text="Text" />
  ),
}

export const IconAndText: Story = {
  render: () => <ComposedInputGroup {...inputGroupControlArgs} text="Text" />,
}

export const EndText: Story = {
  render: () => (
    <ComposedInputGroup
      {...inputGroupControlArgs}
      endText="Text"
      icon={false}
    />
  ),
}

export const TextOnBothEnds: Story = {
  render: () => (
    <ComposedInputGroup
      {...inputGroupControlArgs}
      endText="Text"
      icon={false}
      text="Text"
    />
  ),
}

export const WithButton: Story = {
  render: () => <ComposedInputGroup {...inputGroupControlArgs} button />,
}

export const WithTextarea: Story = {
  render: () => (
    <ComposedInputGroup
      {...inputGroupControlArgs}
      button
      endText="Text"
      icon={false}
      textarea
    />
  ),
}
