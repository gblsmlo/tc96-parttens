import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  DataGrid4,
  type DataGrid4Drafts,
  type DataGrid4Product,
} from '@tc96/ui/blocks/data/data-grid/data-grid-4'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { apiUrl, fetchJson } from '../../../../mocks/api.ts'
import { dataGrid4Handlers } from '../../../../mocks/data-grid-4.ts'
import { rowActions } from '../fixtures/data-grid-4.ts'
import { applyDrafts } from './data-grid-4-layouts.tsx'

const queryKey = ['data', 'products']

const ProductInventory = () => {
  const queryClient = useQueryClient()
  const [drafts, setDrafts] = useState<DataGrid4Drafts>({})
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<DataGrid4Product[]>('/data/products'),
    queryKey,
  })
  const save = useMutation({
    mutationFn: async (next: DataGrid4Drafts) => {
      const response = await fetch(apiUrl('/data/products'), {
        body: JSON.stringify(next),
        method: 'PATCH',
      })
      if (!response.ok) throw new Error(String(response.status))
      return next
    },
    onSuccess: (next) => {
      queryClient.setQueryData<DataGrid4Product[]>(queryKey, (current) =>
        current ? applyDrafts(current, next) : current,
      )
      setDrafts({})
    },
  })

  return (
    <DataGrid4
      drafts={drafts}
      error={isError}
      onDiscard={() => setDrafts({})}
      onDraftsChange={setDrafts}
      onRetry={() => refetch()}
      onRowAction={() => undefined}
      onSave={(next) => save.mutate(next)}
      onVisibleChange={(id, visible) =>
        queryClient.setQueryData<DataGrid4Product[]>(queryKey, (current) =>
          current?.map((product) =>
            product.id === id ? { ...product, visible } : product,
          ),
        )
      }
      pending={isPending}
      products={data ?? []}
      rowActions={rowActions}
      saving={save.isPending}
    />
  )
}

const meta = {
  component: ProductInventory,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/DataGrid/DataGrid4/Usages',
} satisfies Meta<typeof ProductInventory>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid4Handlers.loaded, dataGrid4Handlers.save)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Camiseta de algodão')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: /^Estoque: 7/ }))
    await userEvent.type(
      await canvas.findByRole('textbox'),
      '{Control>}a{/Control}25{Enter}',
    )
    await expect(canvas.getByText('1 alteração não salva')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Salvar alterações' }),
    )
    await expect(
      await canvas.findByText('Todas as alterações salvas'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: /^Estoque: 25/ }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid4Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum produto para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid4Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os produtos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(dataGrid4Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando produtos'),
    ).toBeVisible()
    await expect(
      canvas.getByRole('heading', { name: 'Inventário de produtos' }),
    ).toBeVisible()
  },
}
