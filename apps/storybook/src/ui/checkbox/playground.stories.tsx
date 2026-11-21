import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CheckboxControls,
  checkboxControlArgs,
  checkboxControlArgTypes,
} from './checkbox-controls.ts'
import { ComposedCheckbox } from './checkbox-layouts.tsx'

const meta = {
  args: checkboxControlArgs,
  argTypes: checkboxControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedCheckbox key={String(args.checked)} {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Checkbox/Playground',
} satisfies Meta<CheckboxControls>

export default meta

type Story = StoryObj<CheckboxControls>

export const Playground: Story = {}
