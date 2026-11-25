import { Flow4, type Flow4Props } from '@tc96/ui/blocks/application/flow/flow-4'
import { links, nodes } from '../fixtures/flow-4.ts'
import type { Flow4Controls } from './flow-4-controls.ts'

interface ComposedFlow4Props extends Flow4Controls {
  onNodeSelect?: Flow4Props['onNodeSelect']
  onRetry?: Flow4Props['onRetry']
}

export const ComposedFlow4 = ({
  empty,
  error,
  onNodeSelect,
  onRetry,
  owners,
  pending,
  selectedId,
  title,
  values,
}: Readonly<ComposedFlow4Props>) => (
  <Flow4
    error={error}
    labels={{ title }}
    links={empty ? [] : links}
    nodes={
      empty
        ? []
        : nodes.map((node) => ({
            ...node,
            owner: owners ? node.owner : undefined,
            valueText: values ? node.valueText : undefined,
          }))
    }
    onNodeSelect={onNodeSelect}
    onRetry={onRetry}
    pending={pending}
    selectedId={selectedId === 'none' ? null : selectedId}
  />
)
