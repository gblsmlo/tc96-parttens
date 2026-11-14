import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionDefinition,
  CollectionPagination,
  GalleryView,
  type GalleryViewProps,
} from '@tc96/parttens'
import { Card } from '@tc96/ui/card'
import { type ReactElement, useEffect, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../.storybook/docs-page.tsx'
import { sleep } from '../../../test-utils/sleep'
import { renderDocumentCard } from '../fixtures/document-renderers'
import {
  createDocumentCollection,
  type DocumentRecord,
  initialDocuments,
} from '../fixtures/documents'

type GalleryArgs = GalleryViewProps<DocumentRecord> & { empty: boolean }

const DocumentsGallery = GalleryView as (
  props: GalleryViewProps<DocumentRecord>,
) => ReactElement

const hidden = { table: { disable: true } } as const

const actions = { onArchive: fn(), onOpen: fn(), onTogglePin: fn() }

const documentCardAnatomy = {
  action: true,
  density: 'compact',
  descriptionLines: 3,
} as const

interface AnatomyRecord {
  id: string
}

const anatomyCollection = (
  count: number,
): CollectionDefinition<AnatomyRecord> => ({
  getKey: (record) => record.id,
  getLabel: (record) => record.id,
  groupings: [],
  records: Array.from({ length: count }, (_, position) => ({
    id: `record-${position + 1}`,
  })),
})

const usage = `
import { CollectionPagination, GalleryView } from '@acme/patterns'

<GalleryView
  collection={pageOfDocuments}
  emptyMessage="Nenhum documento."
  loading={isLoading}
  loadingRecordAnatomy={{ action: true, density: 'compact', descriptionLines: 3 }}
  pageSize={9}
  renderRecord={(document) => <Card render={<article />}>{/* card */}</Card>}
/>
<CollectionPagination
  label="Paginação de documentos"
  onPageChange={setPage}
  page={page}
  pageCount={pageCount}
  pageSize={9}
  total={total}
/>
`

const docs = {
  api: [
    {
      description:
        'Controlled responsive grid of a collection, in the order the consumer passed: one column, two from `sm`, three from `lg`. It never groups, sorts or paginates, and it owns no card anatomy: `renderRecord` returns the whole card and runs in a memoized leaf. `pageSize` (3, 6, 9 or 12, whole rows of three) sizes the page the consumer passes: the loading state renders that many skeletons, and the grid keeps the rows of a full page, so a partial last page does not shrink it. Without `pageSize`, loading renders `loadingRecordCount` skeletons. An empty collection renders `emptyMessage` in the COSS `Empty` block.',
      name: 'GalleryView',
    },
    {
      description:
        'Loading card shaped like the consumer card: `eyebrow` and `action` on the first row, `titleLines`, `descriptionLines` and `footer`, at the real line heights of the COSS `Card`; `density` is `comfortable` (the COSS padding) or `compact` (`p-4`). `GalleryView` renders it from `loadingRecordAnatomy`. Clamp the card text to the same line counts so the grid keeps its height.',
      name: 'GalleryRowSkeleton',
    },
    {
      description:
        'The consumer paginates: slice the records for the current page and pass the same `pageSize` to the gallery and to `CollectionPagination`.',
      name: 'CollectionPagination',
    },
  ],
  description: {
    component:
      '`GalleryView` renders a page of a collection as a grid of cards the consumer composes, in three columns. `Anatomy` shows the grid, the record slot and the empty message, driven by the controls. `Usage` is the Documents gallery paginated with `CollectionPagination`. `Behavior` is the usage under test: it starts loading and shows the documents after a simulated delay, keeping the size of the cards and of the page; the pagination goes forward and back with the four buttons while a partial last page keeps the height of a full page, the order follows the collection and a card menu opens its record.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const slotClassName =
  'flex h-6 min-w-16 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

function Documents({
  empty,
  loading = false,
  pageSize = 9,
}: Readonly<Pick<GalleryArgs, 'empty' | 'loading' | 'pageSize'>>) {
  const [page, setPage] = useState(1)
  const records = empty ? [] : initialDocuments
  const pageCount = Math.max(Math.ceil(records.length / pageSize), 1)
  const currentPage = Math.min(page, pageCount)
  const pageOfDocuments = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <div className="grid gap-3" data-usage="documents">
      <DocumentsGallery
        collection={createDocumentCollection(pageOfDocuments)}
        emptyMessage="Nenhum documento para exibir."
        loading={loading}
        loadingRecordAnatomy={documentCardAnatomy}
        loadingRecordLabel="Carregando documento"
        pageSize={pageSize}
        renderRecord={renderDocumentCard(actions)}
      />
      {records.length > 0 && !loading ? (
        <CollectionPagination
          label="Paginação de documentos"
          onPageChange={setPage}
          page={currentPage}
          pageCount={pageCount}
          pageSize={pageSize}
          total={records.length}
        />
      ) : null}
    </div>
  )
}

const LOAD_DELAY = 2000

function LoadingDocuments(
  props: Readonly<Pick<GalleryArgs, 'empty' | 'pageSize'>>,
) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    sleep(LOAD_DELAY).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return <Documents {...props} loading={loading} />
}

const meta = {
  args: {
    collection: createDocumentCollection(initialDocuments),
    empty: false,
    loading: false,
    pageSize: 9,
    renderRecord: renderDocumentCard(actions),
  },
  argTypes: {
    collection: hidden,
    empty: { control: 'boolean' },
    loading: { control: 'boolean' },
    pageSize: { control: 'inline-radio', options: [3, 6, 9, 12] },
    renderRecord: hidden,
  },
  component: DocumentsGallery,
  decorators: [
    (Story) => (
      <div className="w-5xl max-w-full p-4">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Collection/Layouts/Gallery',
} satisfies Meta<GalleryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  play: async ({ args, canvasElement }) => {
    if (args.loading || args.empty) return
    await expect(
      within(canvasElement).getAllByText('renderRecord'),
    ).toHaveLength(args.pageSize ?? 9)
  },
  render: ({ empty, loading, pageSize }) => (
    <GalleryView<AnatomyRecord>
      collection={anatomyCollection(empty ? 0 : (pageSize ?? 9))}
      emptyMessage={<span className={slotClassName}>emptyMessage</span>}
      loading={loading}
      {...(pageSize ? { pageSize } : {})}
      renderRecord={() => (
        <Card className="flex min-h-52 items-center justify-center">
          <span className={slotClassName}>renderRecord</span>
        </Card>
      )}
    />
  ),
}

export const Usage: Story = {
  render: (args) => <Documents {...args} />,
}

export const Behavior: Story = {
  argTypes: { empty: hidden, loading: hidden, pageSize: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const gallery = canvasElement.querySelector<HTMLElement>(
      '[data-slot="gallery-view"]',
    )
    if (!gallery) throw new Error('The story did not render the gallery.')
    const pageOne = initialDocuments.slice(0, 9)

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
    await expect(
      canvas.getAllByRole('heading').map((heading) => heading.textContent),
    ).toEqual(pageOne.map((document) => document.title))
    await expect(gallery.getBoundingClientRect().height).toBe(loadingHeight)
    await expect(
      gallery.querySelector('[data-slot="card"]')?.getBoundingClientRect()
        .height,
    ).toBe(skeletonHeight)

    actions.onOpen.mockClear()
    const [menu] = canvas.getAllByRole('button', { name: /^Ações de / })
    if (!menu) throw new Error('The first card did not render its menu.')
    await userEvent.click(menu)
    await userEvent.click(await body.findByRole('menuitem', { name: 'Abrir' }))
    await expect(actions.onOpen).toHaveBeenCalledWith(pageOne[0]?.id)

    const pageTwo = initialDocuments.slice(9)
    const titles = async () =>
      (await canvas.findAllByRole('heading')).map(
        (heading) => heading.textContent,
      )
    const button = (name: string) => canvas.getByRole('button', { name })
    const goTo = async (name: string, page: readonly DocumentRecord[]) => {
      await sleep(LOAD_DELAY)
      await userEvent.click(button(name))
      await waitFor(async () =>
        expect(await titles()).toEqual(page.map((document) => document.title)),
      )
      await expect(gallery.getBoundingClientRect().height).toBe(loadingHeight)
    }

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
  render: () => <LoadingDocuments empty={false} pageSize={9} />,
}
