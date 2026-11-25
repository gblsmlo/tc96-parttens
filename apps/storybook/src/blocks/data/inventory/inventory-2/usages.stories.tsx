import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Inventory2,
  type Inventory2Drafts,
  type Inventory2Product,
} from '@tc96/ui/blocks/data/inventory/inventory-2'
import { useState } from 'react'
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
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory2Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory2Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory2Handlers.pending)
  },
}
