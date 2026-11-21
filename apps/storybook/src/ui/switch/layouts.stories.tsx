import type { Meta, StoryObj } from '@storybook/react-vite'
import { switchControlArgs } from './switch-controls.ts'
import {
  AriaLabelSwitch,
  CardSwitch,
  ComposedSwitch,
  FieldSwitch,
  SwitchAtEnd,
  WrappedLabelSwitch,
} from './switch-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Switch/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithDescription: Story = {
  render: () => (
    <ComposedSwitch
      {...switchControlArgs}
      description="Describe what turning the switch on does."
    />
  ),
}

export const InsideLabel: Story = {
  render: () => <WrappedLabelSwitch />,
}

export const AtEnd: Story = {
  render: () => <SwitchAtEnd />,
}

export const WithoutVisibleLabel: Story = {
  render: () => <AriaLabelSwitch />,
}

export const AsCard: Story = {
  render: () => <CardSwitch />,
}

export const InField: Story = {
  render: () => <FieldSwitch />,
}
