import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { DocumentActions } from '../collection/fixtures/document-renderers'
import {
  type DocumentRecord,
  initialDocuments,
} from '../collection/fixtures/documents'
import { GalleryCanvas } from './gallery-canvas.tsx'
import { galleryControlArgs } from './gallery-controls.ts'
import { LOAD_DELAY } from './gallery-data.ts'
import { ComposedGallery, DocumentsGallery } from './gallery-layouts.tsx'

const meta = {
  args: { onArchive: fn(), onOpen: fn(), onTogglePin: fn() },
  decorators: [GalleryCanvas],
  render: (args) => <DocumentsGallery actions={args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Gallery/Behavior',
} satisfies Meta<DocumentActions>

export default meta

type Story = StoryObj<DocumentActions>

const pageOne = initialDocuments.slice(0, 9)
const pageTwo = initialDocuments.slice(9)

const galleryIn = (canvasElement: HTMLElement) => {
  const gallery = canvasElement.querySelector<HTMLElement>(
    '[data-slot="gallery-view"]',
  )
  if (!gallery) throw new Error('The story did not render the gallery.')
  return gallery
}

const headingTitles = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getAllByRole('heading')
    .map((heading) => heading.textContent)

const titlesOf = (documents: readonly DocumentRecord[]) =>
  documents.map((document) => document.title)

export const LoadingKeepsPageHeight: Story = {
  render: (args) => <DocumentsGallery actions={args} loadingFor={LOAD_DELAY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gallery = galleryIn(canvasElement)

    await expect(gallery).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvas.getAllByRole('status', { name: 'Carregando documento' }),
    ).toHaveLength(9)
    await expect(canvas.queryByText('Nenhum documento para exibir.')).toBeNull()
    const loadingHeight = gallery.getBoundingClientRect().height
    const skeletonHeight = gallery
      .querySelector('[data-slot="card"]')
      ?.getBoundingClientRect().height

    await canvas.findByRole(
      'heading',
      { name: pageOne[0]?.title },
      { timeout: LOAD_DELAY * 2 },
    )
    await expect(gallery).not.toHaveAttribute('aria-busy')
    await expect(canvas.queryAllByRole('status')).toHaveLength(0)
    await expect(gallery.getBoundingClientRect().height).toBe(loadingHeight)
    await expect(
      gallery.querySelector('[data-slot="card"]')?.getBoundingClientRect()
        .height,
    ).toBe(skeletonHeight)
  },
}

export const SkeletonFollowsAnatomy: Story = {
  render: () => (
    <ComposedGallery
      {...galleryControlArgs}
      density="compact"
      descriptionLines={3}
      loading
    />
  ),
  play: async ({ canvasElement }) => {
    const skeletons = within(canvasElement).getAllByRole('status', {
      name: 'Carregando registro',
    })

    await expect(skeletons).toHaveLength(4)
    for (const skeleton of skeletons) {
      await expect(skeleton).toHaveAttribute('aria-busy', 'true')
      await expect(skeleton).toHaveAttribute('data-density', 'compact')
      await expect(skeleton).toHaveAttribute('data-description-lines', '3')
    }
    await expect(galleryIn(canvasElement)).not.toHaveAttribute('data-page-size')
  },
}

export const PageSizeSetsSkeletonCount: Story = {
  render: () => (
    <ComposedGallery {...galleryControlArgs} loading pageSize={6} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByRole('status', {
        name: 'Carregando registro',
      }),
    ).toHaveLength(6)
    await expect(galleryIn(canvasElement)).toHaveAttribute(
      'data-page-size',
      '6',
    )
  },
}

export const RecordsInCollectionOrder: Story = {
  play: async ({ canvasElement }) => {
    await expect(headingTitles(canvasElement)).toEqual(titlesOf(pageOne))
  },
}

export const RecordControlsKeepTheirClick: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      canvas.getByRole('button', { name: `Ações de ${pageOne[0]?.title}` }),
    )
    await userEvent.click(await body.findByRole('menuitem', { name: 'Abrir' }))

    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith(pageOne[0]?.id)
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())
    await expect(args.onArchive).not.toHaveBeenCalled()
    await expect(args.onTogglePin).not.toHaveBeenCalled()
  },
}

export const PartialPageKeepsHeight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const gallery = galleryIn(canvasElement)
    const fullPageHeight = gallery.getBoundingClientRect().height
    const button = (name: string) => canvas.getByRole('button', { name })
    const goTo = async (name: string, page: readonly DocumentRecord[]) => {
      await userEvent.click(button(name))
      await waitFor(() =>
        expect(headingTitles(canvasElement)).toEqual(titlesOf(page)),
      )
      await expect(gallery.getBoundingClientRect().height).toBe(fullPageHeight)
    }

    await expect(pageTwo.length).toBeLessThan(pageOne.length)
    await expect(button('Primeira página')).toBeDisabled()
    await expect(button('Página anterior')).toBeDisabled()

    await goTo('Próxima página', pageTwo)
    await expect(button('Próxima página')).toBeDisabled()
    await expect(button('Última página')).toBeDisabled()
    await goTo('Página anterior', pageOne)

    await goTo('Última página', pageTwo)
    await goTo('Primeira página', pageOne)
    await expect(button('Página anterior')).toBeDisabled()
  },
}

export const EmptyShowsMessage: Story = {
  render: () => <ComposedGallery {...galleryControlArgs} empty />,
  play: async ({ canvasElement }) => {
    const gallery = galleryIn(canvasElement)

    await expect(
      within(gallery).getByText(galleryControlArgs.emptyMessage),
    ).toBeVisible()
    await expect(within(gallery).queryAllByRole('heading')).toHaveLength(0)
    await expect(gallery).not.toHaveAttribute('aria-busy')
  },
}
