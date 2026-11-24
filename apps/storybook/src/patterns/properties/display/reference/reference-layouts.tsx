import { ReferenceProperty } from '@tc96/ui/patterns'
import type { ReferenceControls } from './reference-controls.ts'

export const ComposedReference = ({
  ariaLabel,
  ...props
}: Readonly<ReferenceControls>) => (
  <ReferenceProperty {...props} ariaLabel={ariaLabel || undefined} />
)
