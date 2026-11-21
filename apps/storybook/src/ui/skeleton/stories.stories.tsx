import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SkeletonControls,
  skeletonControlArgs,
  skeletonControlArgTypes,
} from './skeleton-controls.ts'
import { ComposedSkeleton } from './skeleton-layouts.tsx'

const meta = {
  args: skeletonControlArgs,
  argTypes: skeletonControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedSkeleton {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Skeleton/Stories',
} satisfies Meta<SkeletonControls>

export default meta

type Story = StoryObj<SkeletonControls>

export const Default: Story = {}
