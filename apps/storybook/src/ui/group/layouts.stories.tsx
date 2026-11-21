import type { Meta, StoryObj } from '@storybook/react-vite'
import { groupControlArgs } from './group-controls.ts'
import {
  ComposedGroup,
  InputWithButtonGroup,
  NestedGroups,
  TextAsLabelGroup,
} from './group-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Group/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithText: Story = {
  render: () => <ComposedGroup {...groupControlArgs} text="Insert" />,
}

export const WithInput: Story = {
  render: () => <InputWithButtonGroup />,
}

export const TextAsLabel: Story = {
  render: () => <TextAsLabelGroup />,
}

export const Nested: Story = {
  render: () => <NestedGroups />,
}
