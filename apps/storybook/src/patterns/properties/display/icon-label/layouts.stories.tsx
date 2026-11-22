import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelCanvas } from './icon-label-canvas.tsx'
import { iconLabelControlArgs } from './icon-label-controls.ts'
import { ComposedIconLabel } from './icon-label-layouts.tsx'

const meta = {
  decorators: [IconLabelCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Icon Label/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutIcon: Story = {
  render: () => <ComposedIconLabel {...iconLabelControlArgs} icon={false} />,
}

export const WithLeading: Story = {
  render: () => (
    <ComposedIconLabel {...iconLabelControlArgs} icon={false} leading />
  ),
}

export const WithTrailing: Story = {
  render: () => <ComposedIconLabel {...iconLabelControlArgs} trailing />,
}

export const AsButton: Story = {
  render: () => (
    <ComposedIconLabel {...iconLabelControlArgs} element="button" />
  ),
}

export const AsLink: Story = {
  render: () => <ComposedIconLabel {...iconLabelControlArgs} element="link" />,
}
