import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ComboboxControls,
  comboboxControlArgs,
  comboboxControlArgTypes,
} from './combobox-controls.ts'
import { ComboboxCanvas } from './combobox-frame.tsx'
import { ComposedCombobox } from './combobox-layouts.tsx'

const meta = {
  args: comboboxControlArgs,
  argTypes: comboboxControlArgTypes,
  decorators: [ComboboxCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedCombobox {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Combobox/Playground',
} satisfies Meta<ComboboxControls>

export default meta

type Story = StoryObj<ComboboxControls>

export const Playground: Story = {}
