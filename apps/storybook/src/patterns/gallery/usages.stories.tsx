import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { initialDocuments } from '../collection/fixtures/documents'
import { GalleryCanvas } from './gallery-canvas.tsx'
import { DocumentsGallery } from './gallery-layouts.tsx'

const meta = {
  decorators: [GalleryCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Gallery/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Documents: Story = {
  render: () => <DocumentsGallery />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: initialDocuments[0]?.title }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('navigation', { name: 'Paginação de documentos' }),
    ).toBeVisible()
  },
}
