import { List4 } from '@tc96/ui/blocks/application/list/list-4'
import { integrations } from '../fixtures/list-4.ts'
import type { List4Controls } from './list-4-controls.ts'

export const ComposedList4 = ({
  connectable,
  empty,
  title,
}: Readonly<List4Controls>) => (
  <List4
    integrations={empty ? [] : integrations}
    labels={{ title }}
    onConnect={connectable ? () => {} : undefined}
  />
)
