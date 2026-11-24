import { TagIcon, XIcon } from '@phosphor-icons/react'
import {
  IconLabelProperty,
  type IconLabelPropertyProps,
} from '@tc96/ui/patterns'
import type {
  IconLabelControls,
  IconLabelElement,
} from './icon-label-controls.ts'

export interface ComposedIconLabelProps extends IconLabelControls {
  onRemove?: () => void
}

const renderFor = (
  element: IconLabelElement,
): IconLabelPropertyProps['render'] => {
  if (element === 'button')
    return (props) => <button {...props} type="button" />
  if (element === 'link') return (props) => <a {...props} href="#origin" />
  return undefined
}

export const ComposedIconLabel = ({
  ariaLabel,
  element,
  icon,
  label,
  leading,
  muted,
  onRemove,
  trailing,
  trailingVisibility,
  variant,
}: Readonly<ComposedIconLabelProps>) => (
  <IconLabelProperty
    ariaLabel={ariaLabel || undefined}
    icon={icon ? TagIcon : undefined}
    label={label}
    leading={
      leading ? (
        <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
      ) : undefined
    }
    muted={muted}
    render={renderFor(element)}
    trailing={
      trailing && element === 'span' ? (
        <button
          aria-label={`Remover ${label}`}
          className="flex size-5 items-center justify-center rounded-full text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onRemove}
          type="button"
        >
          <XIcon aria-hidden="true" className="size-3" />
        </button>
      ) : undefined
    }
    trailingVisibility={trailingVisibility}
    variant={variant}
  />
)
