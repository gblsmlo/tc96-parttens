import { List5 } from '@tc96/ui/blocks/application/list/list-5'
import { modules } from '../fixtures/list-5.ts'
import type { List5Controls } from './list-5-controls.ts'

export const ComposedList5 = ({
  addable,
  browsable,
  title,
}: Readonly<List5Controls>) => (
  <List5
    labels={{ title }}
    modules={modules}
    onAdd={addable ? () => {} : undefined}
    onBrowseMore={browsable ? () => {} : undefined}
  />
)
