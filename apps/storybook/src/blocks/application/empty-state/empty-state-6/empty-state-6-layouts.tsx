import { EmptyState6 } from '@tc96/ui/blocks/application/empty-state/empty-state-6'
import { useState } from 'react'
import { tabs } from '../fixtures/empty-state-6.ts'
import type { EmptyState6Controls } from './empty-state-6-controls.ts'

export const ComposedEmptyState6 = ({
  tab: initialTab,
  tabs: tabsLabel,
}: Readonly<EmptyState6Controls>) => {
  const [tab, setTab] = useState(initialTab)

  return (
    <EmptyState6
      labels={{ tabs: tabsLabel }}
      onSetup={() => {}}
      onTabChange={setTab}
      tab={tab}
      tabs={tabs}
    />
  )
}
