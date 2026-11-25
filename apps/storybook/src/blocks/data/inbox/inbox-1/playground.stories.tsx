import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Inbox1Controls,
  inbox1ControlArgs,
  inbox1ControlArgTypes,
} from './inbox-1-controls.ts'
import { ComposedInbox1 } from './inbox-1-layouts.tsx'

const meta = {
  args: inbox1ControlArgs,
  argTypes: inbox1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedInbox1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Inbox/Inbox1/Playground',
} satisfies Meta<Inbox1Controls>

export default meta

type Story = StoryObj<Inbox1Controls>

export const Playground: Story = {}
