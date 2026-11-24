import { EmptyState3 } from '@tc96/blocks/application/empty-state/empty-state-3'
import { templates } from '../fixtures/empty-state-3.ts'
import type { EmptyState3Controls } from './empty-state-3-controls.ts'

interface ComposedEmptyState3Props extends EmptyState3Controls {
  onCreate?: () => void
  onImport?: () => void
  onTemplate?: (id: string) => void
}

export const ComposedEmptyState3 = ({
  create,
  description,
  import: showImport,
  onCreate,
  onImport,
  onTemplate,
  templates: showTemplates,
  title,
}: Readonly<ComposedEmptyState3Props>) => (
  <EmptyState3
    labels={{ description, title }}
    onCreate={create ? onCreate : undefined}
    onImport={showImport ? onImport : undefined}
    onTemplate={onTemplate}
    templates={showTemplates ? templates : []}
  />
)
