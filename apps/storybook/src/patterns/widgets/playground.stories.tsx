import type { Meta, StoryObj } from '@storybook/react-vite'
import { WidgetsCanvas } from './widgets-canvas.tsx'
import {
  type WidgetsControls,
  widgetsControlArgs,
  widgetsControlArgTypes,
} from './widgets-controls.ts'
import { ComposedWidget } from './widgets-layouts.tsx'

const meta = {
  args: widgetsControlArgs,
  argTypes: widgetsControlArgTypes,
  decorators: [WidgetsCanvas],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedWidget {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Playground',
} satisfies Meta<WidgetsControls>

export default meta

type Story = StoryObj<WidgetsControls>

export const Playground: Story = {}
