import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type LookupCreate1Controls,
  lookupCreate1ControlArgs,
  lookupCreate1ControlArgTypes,
} from './lookup-create-1-controls.ts'
import { ComposedLookupCreate1 } from './lookup-create-1-layouts.tsx'

const meta = {
  args: lookupCreate1ControlArgs,
  argTypes: lookupCreate1ControlArgTypes,
  render: (args) => <ComposedLookupCreate1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Records/LookupCreate1/Playground',
} satisfies Meta<LookupCreate1Controls>

export default meta

type Story = StoryObj<LookupCreate1Controls>

export const Playground: Story = {}
