'use client'

import { useRender } from '@base-ui/react/use-render'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { ListProps } from '../../core'
import {
  listActionsClassName,
  listContentClassName,
  listDescriptionClassName,
  listRootVariants,
} from '../../lib/variants'

export function List({
  actions,
  className,
  description,
  icon,
  iconColor,
  render,
  title,
  variant = 'outline',
}: Readonly<ListProps>): ReactElement {
  return useRender({
    defaultTagName: 'div',
    props: {
      children: (
        <>
          <IconFrame color={iconColor} shape="rounded" size="sm">
            {icon}
          </IconFrame>
          <span className={listContentClassName} data-slot="list-content">
            <Text data-slot="list-title" size="sm" truncate weight="medium">
              {title}
            </Text>
            {description ? (
              <Text
                className={listDescriptionClassName}
                data-slot="list-description"
                foreground="muted"
                size="sm"
              >
                {description}
              </Text>
            ) : null}
          </span>
          {actions ? (
            <span className={listActionsClassName} data-slot="list-actions">
              {actions}
            </span>
          ) : null}
        </>
      ),
      className: cn(listRootVariants({ variant }), className),
      'data-slot': 'list',
      'data-variant': variant,
    },
    render,
  })
}
