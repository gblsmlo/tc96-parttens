import type { Meta, StoryObj } from '@storybook/react-vite'
import { frameControlArgs } from './frame-controls.ts'
import { FrameCanvas } from './frame-frame.tsx'
import { ComposedFrame } from './frame-layouts.tsx'

const meta = {
  decorators: [FrameCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Frame/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SeparatedPanels: Story = {
  render: () => <ComposedFrame {...frameControlArgs} secondPanel />,
}

export const TitleOnly: Story = {
  render: () => <ComposedFrame {...frameControlArgs} description="" />,
}

export const WithoutHeader: Story = {
  render: () => <ComposedFrame {...frameControlArgs} description="" title="" />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedFrame {...frameControlArgs} footer="" />,
}

export const PanelsOnly: Story = {
  render: () => (
    <ComposedFrame
      {...frameControlArgs}
      description=""
      footer=""
      secondPanel
      title=""
    />
  ),
}
