import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ActionBarControls,
  actionBarControlArgs,
  actionBarControlArgTypes,
} from './action-bar-controls.ts'
import { ComposedActionBar } from './action-bar-layouts.tsx'

const meta = {
  args: actionBarControlArgs,
  argTypes: actionBarControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedActionBar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ActionBar/Playground',
} satisfies Meta<ActionBarControls>

export default meta

type Story = StoryObj<ActionBarControls>

export const Playground: Story = {}
