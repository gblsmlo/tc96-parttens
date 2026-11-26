import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { documents2ControlArgs } from './documents-2-controls.ts'
import { ComposedDocuments2 } from './documents-2-layouts.tsx'

const meta = {
  args: {
    ...documents2ControlArgs,
    onBulkDelete: fn(),
    onBulkPinnedChange: fn(),
    onOpen: fn(),
    onPinnedChange: fn(),
  },
  component: ComposedDocuments2,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Data/Documents/Documents2/Behavior',
} satisfies Meta<typeof ComposedDocuments2>

export default meta

type Story = StoryObj<typeof meta>

const contract = 'Contrato de fornecimento assinado.pdf'
const power = 'Procuração ad judicia.docx'

const pinnedRow = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('region', { name: 'Fixados' })

const pickLayout = async (canvasElement: HTMLElement, layout: string) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Visualização' }),
  )
  await userEvent.click(
    await screen.findByRole('menuitemradio', { name: layout }),
  )
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const PinnedRowSitsBetweenToolbarAndBody: Story = {
  play: async ({ canvasElement }) => {
    const toolbar = within(canvasElement).getByRole('toolbar', {
      name: 'Controles dos documentos',
    })
    const pinned = pinnedRow(canvasElement)
    const body = canvasElement.querySelector('[data-slot="data-collection"]')
    await expect(body).not.toBeNull()
    await expect(body?.contains(pinned)).toBe(false)
    await expect(
      toolbar.compareDocumentPosition(pinned) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(
      pinned.compareDocumentPosition(body as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    await expect(within(pinned).getAllByRole('listitem')).toHaveLength(3)
  },
}

export const PinnedCardOpensAndUnpins: Story = {
  play: async ({ args, canvasElement }) => {
    const pinned = pinnedRow(canvasElement)
    await userEvent.click(
      within(pinned).getByRole('button', { name: `Abrir ${contract}` }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('doc-201')
    await userEvent.click(
      within(pinned).getByRole('button', { name: `Desafixar ${contract}` }),
    )
    await expect(args.onPinnedChange).toHaveBeenCalledWith('doc-201', false)
    await waitFor(() =>
      expect(
        within(pinnedRow(canvasElement)).getAllByRole('listitem'),
      ).toHaveLength(2),
    )
  },
}

export const PinnedRowStaysInEveryLayout: Story = {
  play: async ({ canvasElement }) => {
    await pickLayout(canvasElement, 'Tabela')
    await waitFor(() =>
      expect(within(canvasElement).getByRole('table')).toBeVisible(),
    )
    await expect(pinnedRow(canvasElement)).toBeVisible()
    await pickLayout(canvasElement, 'Galeria')
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="gallery-view"]'),
      ).not.toBeNull(),
    )
    await expect(pinnedRow(canvasElement)).toBeVisible()
  },
}

export const GalleryCardShowsPreviewAndOpens: Story = {
  args: { mode: 'gallery' },
  play: async ({ args, canvasElement }) => {
    const gallery = canvasElement.querySelector(
      '[data-slot="gallery-view"]',
    ) as HTMLElement
    const photo = within(gallery).getByRole('article', {
      name: 'Foto da fachada do imóvel.jpg',
    })
    await expect(
      photo.querySelector('[data-slot="documents-2-preview"] img'),
    ).not.toBeNull()
    const note = within(gallery).getByRole('article', {
      name: 'Pendências da audiência',
    })
    await expect(within(note).getByText('Nota')).toBeVisible()
    await userEvent.click(
      within(note).getByRole('button', {
        name: 'Abrir Pendências da audiência',
      }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('note-302')
  },
}

export const ListSelectionOpensActionBar: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('toolbar', {
        name: 'Ações dos documentos selecionados',
      }),
    ).toBeNull()
    await userEvent.click(
      canvas.getByRole('checkbox', { name: `Selecionar ${power}` }),
    )
    const bar = await canvas.findByRole('toolbar', {
      name: 'Ações dos documentos selecionados',
    })
    await expect(within(bar).getByText('1 documento selecionado')).toBeVisible()
    await userEvent.click(within(bar).getByRole('button', { name: 'Fixar' }))
    await expect(args.onBulkPinnedChange).toHaveBeenCalledWith(
      ['doc-205'],
      true,
    )
    await waitFor(() =>
      expect(
        within(pinnedRow(canvasElement)).getAllByRole('listitem'),
      ).toHaveLength(4),
    )
  },
}

export const TableSelectionOpensActionBar: Story = {
  args: { mode: 'table' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('checkbox', { name: `Selecionar ${power}` }),
    )
    const bar = await canvas.findByRole('toolbar', {
      name: 'Ações dos documentos selecionados',
    })
    await userEvent.click(within(bar).getByRole('button', { name: 'Excluir' }))
    await expect(args.onBulkDelete).toHaveBeenCalledWith(['doc-205'])
    await waitFor(() => expect(canvas.queryByText(power)).toBeNull())
  },
}

export const PinnedRowHiddenWhilePending: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('region', { name: 'Fixados' }),
    ).toBeNull()
  },
}

export const PinnedRowHiddenWithoutPinned: Story = {
  args: { pinned: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('region', { name: 'Fixados' }),
    ).toBeNull()
    await expect(
      within(canvasElement).getByRole('heading', { name: contract }),
    ).toBeVisible()
  },
}
