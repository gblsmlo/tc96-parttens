import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Team1Controls,
  team1ControlArgs,
  team1ControlArgTypes,
} from './team-1-controls.ts'
import { ComposedTeam1 } from './team-1-layouts.tsx'

const meta = {
  args: team1ControlArgs,
  argTypes: team1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTeam1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Team/Team1/Playground',
} satisfies Meta<Team1Controls>

export default meta

type Story = StoryObj<Team1Controls>

export const Playground: Story = {}
