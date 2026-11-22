import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type TextControls,
  textControlArgs,
  textControlArgTypes,
} from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

const meta = {
  args: textControlArgs,
  argTypes: textControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedText {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Text/Playground',
} satisfies Meta<TextControls>

export default meta

type Story = StoryObj<TextControls>

export const Playground: Story = {}
