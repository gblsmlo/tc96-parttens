import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonCanvas } from './person-canvas.tsx'
import {
  type PersonControls,
  personControlArgs,
  personControlArgTypes,
} from './person-controls.ts'
import { ComposedPerson } from './person-layouts.tsx'

const meta = {
  args: personControlArgs,
  argTypes: personControlArgTypes,
  decorators: [PersonCanvas],
  parameters: {
    controls: {
      exclude: ['avatarSize', 'disabled', 'display', 'value', 'variant'],
    },
  },
  render: (args) => <ComposedPerson {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Stories',
} satisfies Meta<PersonControls>

export default meta

type Story = StoryObj<PersonControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const AvatarOnly: Story = {
  args: { display: 'avatar' },
  name: 'Display avatar',
}

export const AvatarSizeSm: Story = {
  args: { avatarSize: 'sm' },
  name: 'Avatar size sm',
}

export const Empty: Story = {
  args: { value: 'none' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
