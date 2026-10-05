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

const interactiveDescendants =
  '[&_:is(a[href],button,input,select,textarea,summary,label,[role=button],[role=checkbox],[role=combobox],[role=link],[role=menuitem],[role=option],[role=radio],[role=slider],[role=spinbutton],[role=switch],[role=tab],[role=textbox],[tabindex]:not([tabindex="-1"]),[contenteditable]:not([contenteditable=false]))]:pointer-events-auto'

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
        <Fragment key={isValidElement(node) ? node.key : String(node)}>
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
