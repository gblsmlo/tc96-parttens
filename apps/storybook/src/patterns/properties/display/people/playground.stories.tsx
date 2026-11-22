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
  render: (args) => <ComposedPeople {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/People/Playground',
} satisfies Meta<PeopleControls>

export default meta

type Story = StoryObj<PeopleControls>

export const Playground: Story = {}
