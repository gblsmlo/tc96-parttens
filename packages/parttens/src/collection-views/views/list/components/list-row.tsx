import { IconFrame, type IconFrameProps } from '@tc96/elements/icon-frame'
import { Text } from '@tc96/elements/text'
import { cn } from '@tc96/utils'
import {
  Children,
  Fragment,
  isValidElement,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react'

import { interactiveDescendants } from '../../../shared/lib/interactive-descendants'
import {
  ListItem,
  ListItemAction,
  ListItemBody,
  ListItemDescription,
  ListItemField,
  ListItemLeading,
  type ListItemProps,
  ListItemTitle,
  ListItemTitleTrigger,
  ListItemTrailing,
} from './list-item'

export type ListRowIconFrame = Pick<
  IconFrameProps,
  'color' | 'shape' | 'size' | 'variant'
>

export interface ListRowProps extends Omit<ListItemProps, 'title'> {
  actions?: ReactNode
  description?: ReactNode | readonly ReactNode[]
  icon?: ReactNode
  iconFrame?: ListRowIconFrame
  onClick?: MouseEventHandler<HTMLButtonElement>
  openDisabled?: boolean
  openLabel?: string
  properties?: ReactNode
  title: ReactNode
  value?: ReactNode
}

function ListRowDescription({
  description,
}: Readonly<{ description: ReactNode | readonly ReactNode[] }>) {
  const nodes = Children.toArray(description)

  if (nodes.length === 0) return null

  return (
    <ListItemDescription>
      {nodes.map((node, position) => (
        <Fragment
          key={isValidElement(node) ? node.key : `${position}:${String(node)}`}
        >
          {position > 0 ? (
            <span aria-hidden="true" className="px-1">
              ·
            </span>
          ) : null}
          {node}
        </Fragment>
      ))}
    </ListItemDescription>
  )
}

export function ListRow({
  actions,
  className,
  description,
  icon,
  iconFrame,
  interactive,
  onClick,
  openDisabled,
  openLabel,
  properties,
  title,
  value,
  ...props
}: ListRowProps): ReactElement {
  return (
    <ListItem
      className={cn('relative', className)}
      interactive={interactive ?? onClick !== undefined}
      {...props}
    >
      {icon ? (
        <ListItemLeading>
          <IconFrame shape="rounded" {...iconFrame}>
            {icon}
          </IconFrame>
        </ListItemLeading>
      ) : null}
      <ListItemBody>
        <ListItemTitle>
          {onClick ? (
            <ListItemTitleTrigger
              aria-label={openLabel}
              disabled={openDisabled}
              className="outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring"
              onClick={onClick}
            >
              {title}
            </ListItemTitleTrigger>
          ) : (
            title
          )}
        </ListItemTitle>
        {description ? <ListRowDescription description={description} /> : null}
      </ListItemBody>
      {value || properties || actions ? (
        <ListItemTrailing>
          {value ? (
            <Text className="tabular-nums" size="sm" truncate weight="medium">
              {value}
            </Text>
          ) : null}
          {properties ? (
            <ListItemField
              always
              className={cn(
                'relative z-10 pointer-events-none',
                interactiveDescendants,
              )}
            >
              {properties}
            </ListItemField>
          ) : null}
          {actions ? (
            <ListItemAction className="relative z-10">{actions}</ListItemAction>
          ) : null}
        </ListItemTrailing>
      ) : null}
    </ListItem>
  )
}
