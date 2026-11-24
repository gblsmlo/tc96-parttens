import {
  ImpactMap,
  type ImpactMapProps,
} from '@tc96/blocks/ai-agents/flow/impact-map'
import { links, nodes } from '../fixtures/impact-map.ts'
import type { ImpactMapControls } from './impact-map-controls.ts'

interface ComposedImpactMapProps extends ImpactMapControls {
  onNodeSelect?: ImpactMapProps['onNodeSelect']
  onRetry?: ImpactMapProps['onRetry']
}

export const ComposedImpactMap = ({
  empty,
  error,
  onNodeSelect,
  onRetry,
  owners,
  pending,
  selectedId,
  title,
  values,
}: Readonly<ComposedImpactMapProps>) => (
  <ImpactMap
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
