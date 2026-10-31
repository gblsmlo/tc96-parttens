import type { Meta, StoryObj } from '@storybook/react-vite'
import { CollectionPagination } from '@tc96/parttens'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { collectionPaginationArgTypes } from '../../test-utils/story-arg-types'

const meta = {
  args: {
    label: 'Paginação de contatos',
    onPageChange: fn((_page: number) => {}),
    page: 2,
    pageCount: 4,
  },
  argTypes: collectionPaginationArgTypes,
  component: CollectionPagination,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl rounded-lg border border-border">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A paginação de uma coleção: primeira, anterior, `página / total`, próxima e última, com o resumo do recorte visível (`1–25 de 57`) quando `total` e `pageSize` são conhecidos. Serve a coleção paginada pelo servidor (Contatos, Casos e processos) e a tabela — `DataGridPagination` só traduz o modelo TanStack para estas props. O consumer decide quando mostrá-la; o pacote fixa anatomia, rótulos e as pontas desabilitadas.',
      },
    },
    layout: 'padded',
  },
  render: function Pagination({ onPageChange, ...args }) {
    const [page, setPage] = useState(args.page)

    return (
      <CollectionPagination
        {...args}
        onPageChange={(next) => {
          setPage(next)
          onPageChange(next)
        }}
        page={page}
      />
    )
  },
  title: 'Patterns/Pagination',
} satisfies Meta<typeof CollectionPagination>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('2 / 4')).toBeInTheDocument()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenLastCalledWith(3)
    await expect(canvas.getByText('3 / 4')).toBeInTheDocument()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Primeira página' }),
    )
    await expect(args.onPageChange).toHaveBeenLastCalledWith(1)
    await expect(
      canvas.getByRole('button', { name: 'Página anterior' }),
    ).toBeDisabled()
  },
  tags: interaction,
}

export const WithRangeSummary: Story = {
  args: { page: 1, pageCount: 3, pageSize: 25, total: 57 },
}

export const WithRangeSummaryInteraction: Story = {
  ...WithRangeSummary,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('1–25 de 57')).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Primeira página' }),
    ).toBeDisabled()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Próxima página' }),
    )
    await expect(canvas.getByText('2 / 3')).toBeInTheDocument()
    await expect(canvas.getByText('26–50 de 57')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Última página' }))
    await expect(args.onPageChange).toHaveBeenLastCalledWith(3)
    await expect(canvas.getByText('51–57 de 57')).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'Próxima página' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'Última página' }),
    ).toBeDisabled()
  },
  tags: interaction,
}
