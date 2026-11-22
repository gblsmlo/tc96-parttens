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
  render: (args) => <ComposedTags {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Playground',
} satisfies Meta<TagsControls>

export default meta

type Story = StoryObj<TagsControls>

export const Playground: Story = {}
