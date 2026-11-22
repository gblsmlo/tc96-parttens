import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProductivityCanvas } from './productivity-canvas.tsx'
import {
  type ProductivityControls,
  productivityControlArgs,
  productivityControlArgTypes,
} from './productivity-controls.ts'
import { ComposedProductivity } from './productivity-layouts.tsx'

const meta = {
  args: productivityControlArgs,
  argTypes: productivityControlArgTypes,
  decorators: [ProductivityCanvas],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedProductivity {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Productivity/Playground',
} satisfies Meta<ProductivityControls>

export default meta

type Story = StoryObj<ProductivityControls>

export const Playground: Story = {}
