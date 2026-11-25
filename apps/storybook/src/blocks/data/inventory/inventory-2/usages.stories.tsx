import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Inventory2,
  type Inventory2Drafts,
  type Inventory2Product,
} from '@tc96/ui/blocks/data/inventory/inventory-2'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { apiUrl, fetchJson } from '../../../../mocks/api.ts'
import { inventory2Handlers } from '../../../../mocks/inventory-2.ts'
import { rowActions } from '../fixtures/inventory-2.ts'
import { applyDrafts } from './inventory-2-layouts.tsx'

const queryKey = ['data', 'table', 'products']

const ProductInventory = () => {
  const queryClient = useQueryClient()
  const [drafts, setDrafts] = useState<Inventory2Drafts>({})
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Inventory2Product[]>('/data/table/products'),
    queryKey,
  })
  const save = useMutation({
    mutationFn: async (next: Inventory2Drafts) => {
      const response = await fetch(apiUrl('/data/table/products'), {
        body: JSON.stringify(next),
        method: 'PATCH',
      })
      if (!response.ok) throw new Error(String(response.status))
      return next
    },
    onSuccess: (next) => {
      queryClient.setQueryData<Inventory2Product[]>(queryKey, (current) =>
        current ? applyDrafts(current, next) : current,
      )
      setDrafts({})
    },
  })

  return (
    <Inventory2
      drafts={drafts}
      error={isError}
      onDiscard={() => setDrafts({})}
      onDraftsChange={setDrafts}
      onRetry={() => refetch()}
      onRowAction={() => undefined}
      onSave={(next) => save.mutate(next)}
      onVisibleChange={(id, visible) =>
        queryClient.setQueryData<Inventory2Product[]>(queryKey, (current) =>
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
  title: 'Blocks/Data/Inventory/Inventory2/Usages',
} satisfies Meta<typeof ProductInventory>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory2Handlers.loaded, inventory2Handlers.save)
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
    msw.use(inventory2Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum produto para exibir.'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory2Handlers.error)
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
    msw.use(inventory2Handlers.pending)
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
