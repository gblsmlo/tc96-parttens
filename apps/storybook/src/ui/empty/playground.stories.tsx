import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type EmptyControls,
  emptyControlArgs,
  emptyControlArgTypes,
} from './empty-controls.ts'
import { EmptyCanvas } from './empty-frame.tsx'
import { ComposedEmpty } from './empty-layouts.tsx'

const meta = {
  args: emptyControlArgs,
  argTypes: emptyControlArgTypes,
  decorators: [EmptyCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedEmpty {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Empty/Playground',
} satisfies Meta<EmptyControls>

export default meta

type Story = StoryObj<EmptyControls>

export const Playground: Story = {}
