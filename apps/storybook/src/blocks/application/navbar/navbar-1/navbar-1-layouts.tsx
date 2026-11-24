import { Navbar1 } from '@tc96/ui/blocks/application/navbar/navbar-1'
import { useEffect, useState } from 'react'
import { breadcrumbs, collaborators, tabs } from '../fixtures/navbar-1.ts'
import type { Navbar1Controls } from './navbar-1-controls.ts'

export const ComposedNavbar1 = ({
  collaboratorCount,
  share,
  shareable,
  tab,
}: Readonly<Navbar1Controls>) => {
  const [current, setCurrent] = useState(tab)

  useEffect(() => setCurrent(tab), [tab])

  return (
    <Navbar1
      breadcrumbs={breadcrumbs}
      collaborators={collaborators.slice(0, collaboratorCount)}
      labels={{ share }}
      onShare={shareable ? () => {} : undefined}
      onTabChange={setCurrent}
      tab={current}
      tabs={tabs}
    />
  )
}
