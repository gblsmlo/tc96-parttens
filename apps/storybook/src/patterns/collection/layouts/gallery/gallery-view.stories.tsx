import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryView } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

interface DocumentRecord {
  id: string
  title: string
}

const collectionOf = (records: readonly DocumentRecord[]) => ({
  getKey: (record: DocumentRecord) => record.id,
  getLabel: (record: DocumentRecord) => record.title,
  groupings: [],
  records: [...records],
})

const threeDocuments = collectionOf([
  { id: 'a', title: 'Alpha' },
  { id: 'b', title: 'Beta' },
  { id: 'c', title: 'Gamma' },
])

const renderSpy = fn((record: DocumentRecord) => (
  <article>{record.title}</article>
))

const renderStable = (record: DocumentRecord) => {
  renderSpy(record)
  return <article>{record.title}</article>
}

const renderedIds = () =>
  [...new Set(renderSpy.mock.calls.map(([record]) => record.id))].sort()

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Layouts/Gallery/View',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function RerenderHarness() {
  const [ticks, setTicks] = useState(0)

  return (
    <div className="min-w-0 p-3">
      <p className="text-muted-foreground text-sm">
        Atualizações do pai: {ticks}
      </p>
      <button onClick={() => setTicks((count) => count + 1)} type="button">
        Atualizar pai
      </button>
      <GalleryView<DocumentRecord>
        collection={threeDocuments}
        renderRecord={renderStable}
      />
    </div>
  )
}

export const CollectionOrder: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getAllByText(/^(Alpha|Beta|Gamma)$/)
        .map((node) => node.textContent),
    ).toEqual(['Alpha', 'Beta', 'Gamma'])
  },
  render: () => (
    <div className="min-w-0 p-3">
      <GalleryView<DocumentRecord>
        collection={threeDocuments}
        renderRecord={(record) => <article>{record.title}</article>}
      />
    </div>
  ),
}

export const StableRenderersSkipOnParentRerender: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Alpha')
    renderSpy.mockClear()
    await userEvent.click(canvas.getByRole('button', { name: 'Atualizar pai' }))
    await canvas.findByText('Atualizações do pai: 1')
    await expect(renderedIds()).toEqual([])
  },
  render: () => <RerenderHarness />,
}

export const EmptyMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('No documents found.')).toBeVisible()
    await expect(canvas.queryByRole('article')).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-3">
      <GalleryView<DocumentRecord>
        collection={collectionOf([])}
        emptyMessage="No documents found."
        renderRecord={(record) => <article>{record.title}</article>}
      />
    </div>
  ),
}

export const LoadingSkeletonCount: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getAllByRole('status', { name: 'Loading document' }),
    ).toHaveLength(3)
    await expect(canvas.queryByText('Alpha')).toBeNull()
    await expect(canvas.queryByText('No items to show.')).toBeNull()
  },
  render: () => (
    <div className="min-w-0 p-3">
      <GalleryView<DocumentRecord>
        collection={threeDocuments}
        loading
        loadingRecordCount={3}
        loadingRecordLabel="Loading document"
        renderRecord={(record) => <article>{record.title}</article>}
      />
    </div>
  ),
}
