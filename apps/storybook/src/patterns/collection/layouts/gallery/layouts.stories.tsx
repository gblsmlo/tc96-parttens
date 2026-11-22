import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryCanvas } from './gallery-canvas.tsx'
import { galleryControlArgs } from './gallery-controls.ts'
import { ComposedGallery } from './gallery-layouts.tsx'

const meta = {
  decorators: [GalleryCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Gallery/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnlyCards: Story = {
  render: () => (
    <ComposedGallery
      {...galleryControlArgs}
      action={false}
      descriptionLines={0}
      eyebrow={false}
      footer={false}
    />
  ),
}

export const WithoutEyebrow: Story = {
  render: () => <ComposedGallery {...galleryControlArgs} eyebrow={false} />,
}

export const WithoutAction: Story = {
  render: () => <ComposedGallery {...galleryControlArgs} action={false} />,
}

export const WithoutDescription: Story = {
  render: () => (
    <ComposedGallery {...galleryControlArgs} descriptionLines={0} />
  ),
}

export const WithoutFooter: Story = {
  render: () => <ComposedGallery {...galleryControlArgs} footer={false} />,
}
