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
  render: (args) => <ComposedPerson {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Playground',
} satisfies Meta<PersonControls>

export default meta

type Story = StoryObj<PersonControls>

export const Playground: Story = {}
