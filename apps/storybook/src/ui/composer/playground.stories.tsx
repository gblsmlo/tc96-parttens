import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ComposerControls,
  composerControlArgs,
  composerControlArgTypes,
} from './composer-controls.ts'
import { ComposerCanvas } from './composer-frame.tsx'
import { ComposedComposer } from './composer-layouts.tsx'

const meta = {
  args: composerControlArgs,
  argTypes: composerControlArgTypes,
  decorators: [ComposerCanvas],
  parameters: { layout: 'centered' },
  render: (args) => <ComposedComposer {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Composer/Playground',
} satisfies Meta<ComposerControls>

export default meta

type Story = StoryObj<ComposerControls>

export const Playground: Story = {}
