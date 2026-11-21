import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  MediaCardSkeleton,
  ProfileRowSkeleton,
  TextLinesSkeleton,
} from './skeleton-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Skeleton/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TextLines: Story = {
  render: () => <TextLinesSkeleton />,
}

export const ProfileRow: Story = {
  render: () => <ProfileRowSkeleton />,
}

export const MediaCard: Story = {
  render: () => <MediaCardSkeleton />,
}
