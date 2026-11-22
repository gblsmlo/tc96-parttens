import type { Meta, StoryObj } from '@storybook/react-vite'
import { GamificationCanvas } from './gamification-canvas.tsx'
import {
  type GamificationControls,
  gamificationControlArgs,
  gamificationControlArgTypes,
} from './gamification-controls.ts'
import { ComposedGamification } from './gamification-layouts.tsx'

const meta = {
  args: gamificationControlArgs,
  argTypes: gamificationControlArgTypes,
  decorators: [GamificationCanvas],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedGamification {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Gamification/Playground',
} satisfies Meta<GamificationControls>

export default meta

type Story = StoryObj<GamificationControls>

export const Playground: Story = {}
