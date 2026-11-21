import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type GroupControls,
  groupControlArgs,
  groupControlArgTypes,
} from './group-controls.ts'
import { ComposedGroup } from './group-layouts.tsx'

const meta = {
  args: groupControlArgs,
  argTypes: groupControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Group/Playground',
} satisfies Meta<GroupControls>

export default meta

type Story = StoryObj<GroupControls>

export const Playground: Story = {}
