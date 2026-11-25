import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPagination } from '@tc96/ui/patterns'
import { expect, fn, userEvent, within } from 'storybook/test'
import { StatefulPagination } from './collection-pagination-layouts.tsx'

const meta = {
  args: {
    label: 'Paginação de contatos',
    onPageChange: fn(),
    page: 1,
    pageCount: 3,
  },
  component: CollectionPagination,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/CollectionPagination/Behavior',
} satisfies Meta<typeof CollectionPagination>

export default meta

type Story = StoryObj<typeof meta>

const slotOf = (canvasElement: HTMLElement, slot: string) => {
  const root = canvasElement.querySelector(`[data-slot="${slot}"]`)
  if (!root) throw new Error(`Missing [data-slot="${slot}"]`)
  return root
}

const pageButton = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('button', { name })

const pageOverCount = (canvasElement: HTMLElement) =>
  slotOf(canvasElement, 'collection-pagination-page')

export const NamesTheNavigation: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={2}
      pageCount={4}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('navigation', { name: 'Paginação de contatos' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('navigation', { name: 'pagination' }),
    ).toBeNull()
    await expect(pageOverCount(canvasElement)).toHaveTextContent('2 / 4')
    await expect(pageOverCount(canvasElement)).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const SummarizesTheVisibleRange: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={1}
      pageCount={3}
      pageSize={25}
      total={57}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const summary = within(canvasElement).getByText('1–25 de 57')

    await expect(summary.tagName).toBe('P')
    await expect(summary).toHaveAttribute('aria-live', 'polite')

    await userEvent.click(pageButton(canvasElement, 'Próxima página'))
    await expect(summary).toHaveTextContent('26–50 de 57')

    await userEvent.click(pageButton(canvasElement, 'Última página'))
    await expect(summary).toHaveTextContent('51–57 de 57')
    await expect(args.onPageChange).toHaveBeenCalledTimes(2)
    await expect(args.onPageChange).toHaveBeenNthCalledWith(1, 2)
    await expect(args.onPageChange).toHaveBeenNthCalledWith(2, 3)
  },
}

export const SummaryNeedsTotalAndPageSize: Story = {
  render: ({ onPageChange }) => (
    <div className="flex flex-col gap-2">
      <StatefulPagination
        label="Paginação só com total"
        onPageChange={onPageChange}
        page={1}
        pageCount={3}
        total={57}
      />
      <StatefulPagination
        label="Paginação só com tamanho"
        onPageChange={onPageChange}
        page={1}
        pageCount={3}
        pageSize={25}
      />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('navigation')).toHaveLength(2)
    await expect(canvas.queryByText(/ de /)).toBeNull()
    await expect(canvasElement.querySelector('[aria-live]')).toBeNull()
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const SummaryReadsZeroOfZero: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={1}
      pageCount={0}
      pageSize={25}
      total={0}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(within(canvasElement).getByText('0 de 0')).toHaveAttribute(
      'aria-live',
      'polite',
    )
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const FirstPageDisablesTheStart: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={1}
      pageCount={3}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(pageButton(canvasElement, 'Primeira página')).toBeDisabled()
    await expect(pageButton(canvasElement, 'Página anterior')).toBeDisabled()
    await expect(pageButton(canvasElement, 'Próxima página')).toBeEnabled()
    await expect(pageButton(canvasElement, 'Última página')).toBeEnabled()
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const LastPageDisablesTheEnd: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={3}
      pageCount={3}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(pageButton(canvasElement, 'Próxima página')).toBeDisabled()
    await expect(pageButton(canvasElement, 'Última página')).toBeDisabled()
    await expect(pageButton(canvasElement, 'Primeira página')).toBeEnabled()
    await expect(pageButton(canvasElement, 'Página anterior')).toBeEnabled()
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const ReportsTheTargetPage: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={3}
      pageCount={5}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(pageButton(canvasElement, 'Próxima página'))
    await userEvent.click(pageButton(canvasElement, 'Página anterior'))
    await userEvent.click(pageButton(canvasElement, 'Última página'))
    await userEvent.click(pageButton(canvasElement, 'Primeira página'))

    await expect(args.onPageChange).toHaveBeenCalledTimes(4)
    await expect(args.onPageChange).toHaveBeenNthCalledWith(1, 4)
    await expect(args.onPageChange).toHaveBeenNthCalledWith(2, 3)
    await expect(args.onPageChange).toHaveBeenNthCalledWith(3, 5)
    await expect(args.onPageChange).toHaveBeenNthCalledWith(4, 1)
    await expect(pageOverCount(canvasElement)).toHaveTextContent('1 / 5')
  },
}

export const ClampsTheOutOfRangePage: Story = {
  render: ({ onPageChange }) => (
    <StatefulPagination
      label="Paginação de contatos"
      onPageChange={onPageChange}
      page={9}
      pageCount={0}
    />
  ),
  play: async ({ args, canvasElement }) => {
    await expect(pageOverCount(canvasElement)).toHaveTextContent('1 / 1')
    for (const name of [
      'Primeira página',
      'Página anterior',
      'Próxima página',
      'Última página',
    ]) {
      await expect(pageButton(canvasElement, name)).toBeDisabled()
    }
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const PageSizeSelectorNeedsItsThreeProps: Story = {
  render: ({ onPageChange }) => (
    <div className="flex flex-col gap-2">
      <StatefulPagination
        label="Paginação sem rótulo do seletor"
        onPageChange={onPageChange}
        onPageSizeChange={() => undefined}
        page={1}
        pageCount={3}
        pageSizeOptions={[10, 25, 50]}
      />
      <StatefulPagination
        label="Paginação com seletor"
        onPageChange={onPageChange}
        onPageSizeChange={() => undefined}
        page={1}
        pageCount={3}
        pageSize={25}
        pageSizeLabel="Linhas por página"
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const selectors = canvasElement.querySelectorAll(
      '[data-slot="collection-pagination-page-size"]',
    )
    await expect(selectors).toHaveLength(1)
    await expect(
      within(canvasElement).getByText('Linhas por página'),
    ).toBeVisible()
  },
}
