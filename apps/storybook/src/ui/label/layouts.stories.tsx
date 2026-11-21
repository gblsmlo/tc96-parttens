import type { Meta, StoryObj } from '@storybook/react-vite'
import { labelControlArgs } from './label-controls.ts'
import { LabelCanvas } from './label-frame.tsx'
import {
  CheckboxInLabel,
  ComposedLabel,
  GroupCaptionLabel,
  LabelBesideSwitch,
} from './label-layouts.tsx'

const meta = {
  decorators: [LabelCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Label/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithRequiredMarker: Story = {
  render: () => <ComposedLabel {...labelControlArgs} required />,
}

export const AsSpan: Story = {
  render: () => <ComposedLabel {...labelControlArgs} element="span" />,
}

export const WrapsCheckbox: Story = {
  render: () => <CheckboxInLabel />,
}

export const BesideSwitch: Story = {
  render: () => <LabelBesideSwitch />,
}

export const GroupCaption: Story = {
  render: () => <GroupCaptionLabel />,
}
