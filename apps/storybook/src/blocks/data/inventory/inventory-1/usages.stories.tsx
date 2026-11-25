import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Inventory1,
  type Inventory1Drafts,
  type Inventory1Product,
} from '@tc96/ui/blocks/data/inventory/inventory-1'
import { useState } from 'react'
import { apiUrl, fetchJson } from '../../../../mocks/api.ts'
import { inventory1Handlers } from '../../../../mocks/inventory-1.ts'
import { rowActions } from '../fixtures/inventory-1.ts'
import { applyDrafts } from './inventory-1-layouts.tsx'

const queryKey = ['data', 'products']

const ProductInventory = () => {
  const queryClient = useQueryClient()
  const [drafts, setDrafts] = useState<Inventory1Drafts>({})
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Inventory1Product[]>('/data/products'),
    queryKey,
  })
  const save = useMutation({
    mutationFn: async (next: Inventory1Drafts) => {
      const response = await fetch(apiUrl('/data/products'), {
        body: JSON.stringify(next),
        method: 'PATCH',
      })
      if (!response.ok) throw new Error(String(response.status))
      return next
    },
    onSuccess: (next) => {
      queryClient.setQueryData<Inventory1Product[]>(queryKey, (current) =>
        current ? applyDrafts(current, next) : current,
      )
      setDrafts({})
    },
  })

  return (
    <Inventory1
      drafts={drafts}
      error={isError}
      onDiscard={() => setDrafts({})}
      onDraftsChange={setDrafts}
      onRetry={() => refetch()}
      onRowAction={() => undefined}
      onSave={(next) => save.mutate(next)}
      onVisibleChange={(id, visible) =>
        queryClient.setQueryData<Inventory1Product[]>(queryKey, (current) =>
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
  title: 'Blocks/Data/Inventory/Inventory1/Usages',
} satisfies Meta<typeof ProductInventory>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory1Handlers.loaded, inventory1Handlers.save)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory1Handlers.empty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory1Handlers.error)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(inventory1Handlers.pending)
  },
}
