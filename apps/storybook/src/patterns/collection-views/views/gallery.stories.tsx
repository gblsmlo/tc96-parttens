import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '@tc96/elements/text'
import {
  DateProperty,
  GalleryView,
  PersonProperty,
  type PersonPropertyOption,
} from '@tc96/parttens'
import { Card } from '@tc96/ui/card'
import { Separator } from '@tc96/ui/separator'
import { FileTextIcon } from 'lucide-react'
import type { ReactElement } from 'react'

interface DocumentRecord {
  description: string
  id: string
  ownerId: DocumentOwnerId
  source: string
  title: string
  updatedAt: string
  updatedAtLabel: string
}

type DocumentOwnerId = 'gabriel'

const owners: readonly PersonPropertyOption<DocumentOwnerId>[] = [
  {
    fallback: 'GM',
    label: 'Gabriel Melo',
    value: 'gabriel',
  },
]

const documents: readonly DocumentRecord[] = [
  {
    description: 'This note has no content.',
    id: 'deal-test',
    ownerId: 'gabriel',
    source: 'Deal test',
    title: 'Untitled note',
    updatedAt: '2026-09-30',
    updatedAtLabel: 'September 30, 2026',
  },
  {
    description: 'This note has no content.',
    id: 'paypal',
    ownerId: 'gabriel',
    source: 'PayPal',
    title: 'Untitled note',
    updatedAt: '2026-09-17',
    updatedAtLabel: 'September 17, 2026',
  },
  {
    description: 'This note has no content.',
    id: 'google-16',
    ownerId: 'gabriel',
    source: 'Google',
    title: 'Untitled note',
    updatedAt: '2026-09-16',
    updatedAtLabel: 'September 16, 2026',
  },
  {
    description: 'This note has no content.',
    id: 'google-15',
    ownerId: 'gabriel',
    source: 'Google',
    title: 'Untitled note',
    updatedAt: '2026-09-15',
    updatedAtLabel: 'September 15, 2026',
  },
]

const createCollection = (items: readonly DocumentRecord[]) => ({
  getKey: (document: DocumentRecord) => document.id,
  getLabel: (document: DocumentRecord) => document.title,
  groupings: [],
  items,
})

const renderDocument = (document: DocumentRecord) => (
  <Card className="h-full min-h-52 overflow-hidden" render={<article />}>
    <div className="flex flex-1 flex-col p-4">
      <Text className="flex min-w-0 items-center gap-1" size="xs" truncate>
        <FileTextIcon aria-hidden="true" className="size-3" />
        <span className="truncate">{document.source}</span>
      </Text>

      <div className="mt-3 grid gap-0.5">
        <Text render={<h2>{document.title}</h2>} size="sm" weight="medium" />
        <Text
          foreground="muted"
          render={<p>{document.description}</p>}
          size="sm"
        />
      </div>

      <div className="mt-auto pt-4">
        <Separator />
        <div className="flex min-w-0 items-center justify-between gap-3 pt-3">
          <DateProperty
            ariaLabel="Updated at"
            displayLabel={document.updatedAtLabel}
            readOnly
            value={document.updatedAt}
            variant="plain"
          />
          <PersonProperty
            ariaLabel="Owner"
            display="avatar"
            options={owners}
            readOnly
            value={document.ownerId}
            variant="plain"
          />
        </div>
      </div>
    </div>
  </Card>
)

interface GalleryExampleProps {
  empty?: boolean
  loading?: boolean
}

function GalleryExample({
  empty = false,
  loading = false,
}: Readonly<GalleryExampleProps>): ReactElement {
  return (
    <div className="min-w-0 p-3">
      <GalleryView
        collection={createCollection(empty ? [] : documents)}
        emptyMessage="No documents to show."
        loading={loading}
        loadingItemCount={4}
        loadingItemLabel="Loading document"
        renderItem={renderDocument}
      />
    </div>
  )
}

const meta = {
  args: {
    empty: false,
    loading: false,
  },
  component: GalleryExample,
  parameters: {
    docs: {
      description: {
        component:
          'Gallery building block. The view owns the responsive grid, loading and empty states; the consumer composes every record card from existing UI and element components.',
      },
    },
    layout: 'fullscreen',
  },
  title: 'Patterns/CollectionViews/Views/Gallery',
} satisfies Meta<typeof GalleryExample>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}
