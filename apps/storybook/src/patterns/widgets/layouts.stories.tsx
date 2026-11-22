import type { Meta, StoryObj } from '@storybook/react-vite'
import { WidgetsCanvas } from './widgets-canvas.tsx'
import { widgetsControlArgs } from './widgets-controls.ts'
import { ComposedWidget } from './widgets-layouts.tsx'

const meta = {
  decorators: [WidgetsCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const AmountOnly: Story = {
  render: () => (
    <ComposedWidget {...widgetsControlArgs} list={false} trend={false} />
  ),
}

export const WithPeriodToggle: Story = {
  render: () => <ComposedWidget {...widgetsControlArgs} periods />,
}

export const ListOnly: Story = {
  render: () => (
    <ComposedWidget
      {...widgetsControlArgs}
      amount={false}
      title="Recent orders"
    />
  ),
}

export const WithoutTitle: Story = {
  render: () => <ComposedWidget {...widgetsControlArgs} title="" />,
}
