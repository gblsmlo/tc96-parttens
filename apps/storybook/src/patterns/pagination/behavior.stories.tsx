import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPagination } from '@tc96/parttens'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  args: {
    label: 'Paginação',
    onPageChange: fn((_page: number) => {}),
    page: 1,
    pageCount: 3,
  },
  component: CollectionPagination,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Pagination/Behavior',
} satisfies Meta<typeof CollectionPagination>

export default meta

type Story = StoryObj<typeof meta>

const button = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('button', { name })

export const NamesNavigationAndShowsPageOverCount: Story = {
  args: { label: 'Paginação de contatos', page: 2, pageCount: 4 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('navigation', { name: 'Paginação de contatos' }),
    ).toBeVisible()
    await expect(canvas.getByText('2 / 4')).toBeVisible()
    await expect(canvas.queryByText(/ de /)).toBeNull()
  },
}

export const SummarizesVisibleRange: Story = {
  args: { page: 3, pageCount: 3, pageSize: 25, total: 57 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('51–57 de 57')).toBeVisible()
  },
}

export const FirstPageDisablesLeadingControls: Story = {
  args: { page: 1, pageCount: 3 },
  play: async ({ canvasElement }) => {
    await expect(button(canvasElement, 'Primeira página')).toBeDisabled()
    await expect(button(canvasElement, 'Página anterior')).toBeDisabled()
    await expect(button(canvasElement, 'Próxima página')).toBeEnabled()
    await expect(button(canvasElement, 'Última página')).toBeEnabled()
  },
}

export const LastPageDisablesTrailingControls: Story = {
  args: { page: 3, pageCount: 3 },
  play: async ({ canvasElement }) => {
    await expect(button(canvasElement, 'Próxima página')).toBeDisabled()
    await expect(button(canvasElement, 'Última página')).toBeDisabled()
    await expect(button(canvasElement, 'Primeira página')).toBeEnabled()
  },
}

export const ReportsTargetPageNeverDelta: Story = {
  args: { page: 2, pageCount: 5 },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(button(canvasElement, 'Primeira página'))
    await userEvent.click(button(canvasElement, 'Página anterior'))
    await userEvent.click(button(canvasElement, 'Próxima página'))
    await userEvent.click(button(canvasElement, 'Última página'))

    await expect(
      (args.onPageChange as ReturnType<typeof fn>).mock.calls.map(
        ([page]) => page,
      ),
    ).toEqual([1, 1, 3, 5])
  },
}

export const ClampsOutOfRangePage: Story = {
  args: { page: 9, pageCount: 0 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 / 1')).toBeVisible()
    await expect(button(canvasElement, 'Próxima página')).toBeDisabled()
  },
}
