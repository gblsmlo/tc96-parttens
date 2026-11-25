import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleCanvas } from './people-canvas.tsx'
import { peopleControlArgs } from './people-controls.ts'
import { ComposedPeople } from './people-layouts.tsx'

const meta = {
  decorators: [PeopleCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/People/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComposedPeople {...peopleControlArgs} />,
}
