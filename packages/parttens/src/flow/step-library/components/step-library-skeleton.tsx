'use client'

import { Skeleton } from '@tc96/ui/skeleton'
import type { ReactElement } from 'react'
import {
  flowStepGroupClassName,
  flowStepLibraryGroupsClassName,
} from '../lib/variants'

const groups = [0, 1]
const items = [0, 1, 2]

export function FlowStepLibrarySkeleton(): ReactElement {
  return (
    <div
      className={flowStepLibraryGroupsClassName}
      data-slot="flow-step-library-skeleton"
    >
      {groups.map((group) => (
        <div className={flowStepGroupClassName} key={group}>
          <Skeleton className="mx-2 h-3 w-24" />
          {items.map((item) => (
            <Skeleton className="h-10 w-full" key={item} />
          ))}
        </div>
      ))}
    </div>
  )
}
