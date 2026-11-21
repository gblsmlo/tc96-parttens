import type { Meta, StoryObj } from '@storybook/react-vite'
import { collapsibleControlArgs } from './collapsible-controls.ts'
import { CollapsibleCanvas } from './collapsible-frame.tsx'
import {
  ButtonTriggerCollapsible,
  ComposedCollapsible,
  IconTriggerCollapsible,
  NestedCollapsible,
} from './collapsible-layouts.tsx'

const meta = {
  decorators: [CollapsibleCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Collapsible/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutChevron: Story = {
  render: () => (
    <ComposedCollapsible {...collapsibleControlArgs} chevron={false} />
  ),
}

export const ButtonTrigger: Story = {
  render: () => <ButtonTriggerCollapsible />,
}

export const IconTrigger: Story = {
  render: () => <IconTriggerCollapsible />,
}

export const Nested: Story = {
  render: () => <NestedCollapsible />,
}
