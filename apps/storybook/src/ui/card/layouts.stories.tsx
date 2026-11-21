import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardCanvas } from './card-canvas.tsx'
import { cardControlArgs } from './card-controls.ts'
import { ComposedCard, StackedFrameCards } from './card-layouts.tsx'

const meta = {
  decorators: [CardCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Card/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithAction: Story = {
  render: () => <ComposedCard {...cardControlArgs} action />,
}

export const TitleOnly: Story = {
  render: () => <ComposedCard {...cardControlArgs} description="" footer="" />,
}

export const WithoutHeader: Story = {
  render: () => <ComposedCard {...cardControlArgs} description="" title="" />,
}

export const WithoutPanel: Story = {
  render: () => <ComposedCard {...cardControlArgs} content="" />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedCard {...cardControlArgs} footer="" />,
}

export const Separated: Story = {
  render: () => <ComposedCard {...cardControlArgs} separators />,
}

export const AsSection: Story = {
  render: () => <ComposedCard {...cardControlArgs} element="section" />,
}

export const InFrame: Story = {
  render: () => <ComposedCard {...cardControlArgs} frame />,
}

export const StackedInFrame: Story = {
  render: () => <StackedFrameCards />,
}
