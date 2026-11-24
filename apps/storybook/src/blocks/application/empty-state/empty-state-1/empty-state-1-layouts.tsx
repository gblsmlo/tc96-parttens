import { EmptyState1 } from '@tc96/ui/blocks/application/empty-state/empty-state-1'
import { guides } from '../fixtures/empty-state-1.ts'
import type { EmptyState1Controls } from './empty-state-1-controls.ts'

interface ComposedEmptyState1Props extends EmptyState1Controls {
  onCreate?: () => void
  onImport?: () => void
}

export const ComposedEmptyState1 = ({
  create,
  description,
  guides: showGuides,
  import: showImport,
  onCreate,
  onImport,
  title,
}: Readonly<ComposedEmptyState1Props>) => (
  <EmptyState1
    guides={showGuides ? guides : []}
    labels={{ description, title }}
    onCreate={create ? onCreate : undefined}
    onImport={showImport ? onImport : undefined}
  />
)
