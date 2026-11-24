import { Card6, type Card6Props } from '@tc96/ui/blocks/application/card/card-6'
import { useState } from 'react'
import { jobs } from '../fixtures/card-6.ts'
import type { Card6Controls } from './card-6-controls.ts'

interface ComposedCard6Props extends Card6Controls {
  onApply?: Card6Props['onApply']
  onSaveChange?: Card6Props['onSaveChange']
}

export const ComposedCard6 = ({
  empty,
  onApply,
  onSaveChange,
  title,
  withApply,
  withSave,
}: Readonly<ComposedCard6Props>) => {
  const [saved, setSaved] = useState<string[]>(['data'])

  return (
    <Card6
      jobs={empty ? [] : jobs}
      labels={{ title }}
      onApply={withApply ? (jobId) => onApply?.(jobId) : undefined}
      onSaveChange={
        withSave
          ? (jobId, next) => {
              setSaved((current) =>
                next
                  ? [...current, jobId]
                  : current.filter((id) => id !== jobId),
              )
              onSaveChange?.(jobId, next)
            }
          : undefined
      }
      saved={saved}
    />
  )
}
