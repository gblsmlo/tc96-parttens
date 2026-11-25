import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsCanvas } from './tags-canvas.tsx'
import {
  type TagsControls,
  tagsControlArgs,
  tagsControlArgTypes,
} from './tags-controls.ts'
import { ComposedTags } from './tags-layouts.tsx'

const meta = {
  args: tagsControlArgs,
  argTypes: tagsControlArgTypes,
  decorators: [TagsCanvas],
  parameters: {
    controls: {
      exclude: ['disabled', 'readOnly', 'value', 'variant'],
    },
  },
  render: (args) => <ComposedTags {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Variants',
} satisfies Meta<TagsControls>

export default meta

type Story = StoryObj<TagsControls>

export const Default: Story = {}

export const Badge: Story = {
  args: { variant: 'badge' },
}

export const Empty: Story = {
  args: { value: [] },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
