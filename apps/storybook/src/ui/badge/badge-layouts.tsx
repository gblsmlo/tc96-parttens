import { CheckIcon } from '@phosphor-icons/react'
import { Badge, type BadgeProps } from '@tc96/ui/badge'
import type { BadgeControls } from './badge-controls.ts'
import type { BadgeElementName } from './badge-variants.ts'

const elementRenders: Record<BadgeElementName, BadgeProps['render']> = {
  button: <button type="button" />,
  link: (props) => <a {...props} href="#badge" />,
  span: undefined,
}

export const ComposedBadge = ({
  element,
  icon,
  label,
  size,
  variant,
}: Readonly<BadgeControls>) => (
  <Badge render={elementRenders[element]} size={size} variant={variant}>
    {icon ? <CheckIcon aria-hidden="true" /> : null}
    {label}
  </Badge>
)
