import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type KbdControls,
  kbdControlArgs,
  kbdControlArgTypes,
} from './kbd-controls.ts'
import { ComposedKbd } from './kbd-layouts.tsx'

const meta = {
  args: kbdControlArgs,
  argTypes: kbdControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedKbd {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Kbd/Playground',
} satisfies Meta<KbdControls>

export default meta

type Story = StoryObj<KbdControls>

export const Playground: Story = {}
