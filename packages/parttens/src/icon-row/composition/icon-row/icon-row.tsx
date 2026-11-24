'use client'

import { useRender } from '@base-ui/react/use-render'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { IconRowProps } from '../../core'
import {
  iconRowActionsClassName,
  iconRowContentClassName,
  iconRowDescriptionClassName,
  iconRowRootVariants,
} from '../../lib/variants'

export function IconRow({
  actions,
  className,
  description,
  icon,
  iconColor,
  render,
  title,
  variant = 'outline',
}: Readonly<IconRowProps>): ReactElement {
  return useRender({
    defaultTagName: 'div',
    props: {
      children: (
        <>
          <IconFrame color={iconColor} shape="rounded" size="sm">
            {icon}
          </IconFrame>
          <span
            className={iconRowContentClassName}
            data-slot="icon-row-content"
          >
            <Text data-slot="icon-row-title" size="sm" truncate weight="medium">
              {title}
            </Text>
            {description ? (
              <Text
                className={iconRowDescriptionClassName}
                data-slot="icon-row-description"
                foreground="muted"
                size="sm"
              >
                {description}
              </Text>
            ) : null}
          </span>
          {actions ? (
            <span
              className={iconRowActionsClassName}
              data-slot="icon-row-actions"
            >
              {actions}
            </span>
          ) : null}
        </>
      ),
      className: cn(iconRowRootVariants({ variant }), className),
      'data-slot': 'icon-row',
      'data-variant': variant,
    },
    render,
  })
}
