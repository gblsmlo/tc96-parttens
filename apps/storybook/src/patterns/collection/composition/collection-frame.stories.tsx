import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameFooter,
  CollectionFrameHeader,
  type CollectionFrameMode,
  CollectionFrameOverlay,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'

function Frame({ mode }: Readonly<{ mode?: CollectionFrameMode }>) {
  return (
    <div className="flex h-64 flex-col p-4">
      <CollectionFrame mode={mode}>
        <CollectionFrameHeader>Toolbar</CollectionFrameHeader>
        <CollectionFrameBody aria-label="Tarefas">
          Registros
        </CollectionFrameBody>
        <CollectionFrameFooter>
          Paginação
          <CollectionFrameOverlay>Ações</CollectionFrameOverlay>
        </CollectionFrameFooter>
      </CollectionFrame>
    </div>
  )
}

const meta = {
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Composition/Frame',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Fill: Story = {
  render: () => <Frame />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = canvas.getByRole('region', { name: 'Tarefas' })

    await expect(getComputedStyle(body).overflowY).toBe('auto')
    await expect(
      getComputedStyle(canvas.getByText('Paginação')).position,
    ).not.toBe('sticky')
  },
}

export const Flow: Story = {
  render: () => <Frame mode="flow" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = canvas.getByRole('region', { name: 'Tarefas' })

    await expect(getComputedStyle(body).overflowY).toBe('visible')
    await expect(getComputedStyle(canvas.getByText('Paginação')).position).toBe(
      'sticky',
    )
  },
}

export const PartsInReadingOrder: Story = {
  render: () => <Frame />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByText('Toolbar')
    const body = canvas.getByRole('region', { name: 'Tarefas' })
    const footer = canvas.getByText('Paginação')

    await expect(
      header.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      body.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(footer.contains(canvas.getByText('Ações'))).toBe(true)
  },
}
