import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Documents2Controls,
  documents2ControlArgs,
  documents2ControlArgTypes,
} from './documents-2-controls.ts'
import { ComposedDocuments2 } from './documents-2-layouts.tsx'

const meta = {
  args: documents2ControlArgs,
  argTypes: documents2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDocuments2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Documents/Documents2/Playground',
} satisfies Meta<Documents2Controls>

export default meta

type Story = StoryObj<Documents2Controls>

export const Playground: Story = {}
