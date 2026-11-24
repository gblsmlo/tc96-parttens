import { List6, type List6Mover } from '@tc96/ui/blocks/application/list/list-6'
import { useState } from 'react'
import { movers } from '../fixtures/list-6.ts'
import type { List6Controls } from './list-6-controls.ts'

export const filterMovers = (rows: readonly List6Mover[], query: string) =>
  rows.filter((mover) =>
    mover.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

export const ComposedList6 = ({
  currency,
  empty,
  locale,
  title,
}: Readonly<List6Controls>) => {
  const [query, setQuery] = useState('')

  return (
    <List6
      currency={currency}
      labels={{ title }}
      locale={locale}
      movers={empty ? [] : filterMovers(movers, query)}
      onQueryChange={setQuery}
      query={query}
    />
  )
}
