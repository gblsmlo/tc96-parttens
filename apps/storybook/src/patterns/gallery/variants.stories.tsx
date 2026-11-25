import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryCanvas } from './gallery-canvas.tsx'
import {
  type GalleryControls,
  galleryControlArgs,
  galleryControlArgTypes,
} from './gallery-controls.ts'
import { ComposedGallery } from './gallery-layouts.tsx'

const meta = {
  args: galleryControlArgs,
  argTypes: galleryControlArgTypes,
  decorators: [GalleryCanvas],
  parameters: { controls: { exclude: ['empty', 'loading'] } },
  render: (args) => <ComposedGallery {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Gallery/Variants',
} satisfies Meta<GalleryControls>

export default meta

type Story = StoryObj<GalleryControls>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}
