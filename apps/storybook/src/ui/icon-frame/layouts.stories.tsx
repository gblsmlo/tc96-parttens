import { DiamondIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconFrameControlArgs } from './icon-frame-controls.ts'
import { ComposedIconFrame } from './icon-frame-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/IconFrame/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AsDiv: Story = {
  render: () => <ComposedIconFrame {...iconFrameControlArgs} element="div" />,
}

export const ExplicitIconSize: Story = {
  render: () => (
    <ComposedIconFrame {...iconFrameControlArgs} size="xl">
      <DiamondIcon aria-hidden="true" className="size-8" />
    </ComposedIconFrame>
  ),
}
