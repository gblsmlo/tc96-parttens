import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SelectControls,
  selectControlArgs,
  selectControlArgTypes,
} from './select-controls.ts'
import { SelectCanvas } from './select-frame.tsx'
import { ComposedSelect } from './select-layouts.tsx'

const meta = {
  args: selectControlArgs,
  argTypes: selectControlArgTypes,
  decorators: [SelectCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSelect {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Select/Playground',
} satisfies Meta<SelectControls>

export default meta

type Story = StoryObj<SelectControls>

export const Playground: Story = {}
