import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleCanvas } from './people-canvas.tsx'
import {
  type PeopleControls,
  peopleControlArgs,
  peopleControlArgTypes,
} from './people-controls.ts'
import { ComposedPeople } from './people-layouts.tsx'

const meta = {
  args: peopleControlArgs,
  argTypes: peopleControlArgTypes,
  decorators: [PeopleCanvas],
  parameters: {
    controls: { exclude: ['disabled', 'readOnly', 'value', 'variant'] },
  },
  render: (args) => <ComposedPeople {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/People/Stories',
} satisfies Meta<PeopleControls>

export default meta

type Story = StoryObj<PeopleControls>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: [] },
}

export const Badge: Story = {
  args: { variant: 'badge' },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
