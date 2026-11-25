import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Team2Controls,
  team2ControlArgs,
  team2ControlArgTypes,
} from './team-2-controls.ts'
import { ComposedTeam2 } from './team-2-layouts.tsx'

const meta = {
  args: team2ControlArgs,
  argTypes: team2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTeam2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Team/Team2/Playground',
} satisfies Meta<Team2Controls>

export default meta

type Story = StoryObj<Team2Controls>

export const Playground: Story = {}
