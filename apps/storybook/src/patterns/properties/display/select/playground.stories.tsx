import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectCanvas } from './select-canvas.tsx'
import {
  type SelectControls,
  selectControlArgs,
  selectControlArgTypes,
} from './select-controls.ts'
import { ComposedSelect } from './select-layouts.tsx'

const meta = {
  args: selectControlArgs,
  argTypes: selectControlArgTypes,
  decorators: [SelectCanvas],
  render: (args) => <ComposedSelect {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Playground',
} satisfies Meta<SelectControls>

export default meta

type Story = StoryObj<SelectControls>

export const Playground: Story = {}
