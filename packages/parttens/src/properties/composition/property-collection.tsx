'use client'

import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { EllipsisIcon } from 'lucide-react'
import type React from 'react'
import { Fragment, useState } from 'react'
import { MenuCheckboxOption } from '../../shared/components/menu-selection-item'
import type { PropertyIcon } from '../shared/property-catalog'
import { PropertyRow } from '../shared/property-row'
import { PropertySurface } from '../shared/property-surface'

export interface PropertyCollectionItem {
  id: string
  label: string
  icon?: PropertyIcon
  defaultVisible?: boolean
  render: () => React.ReactNode
}

export interface PropertyCollectionProps {
  items: readonly PropertyCollectionItem[]
  ariaLabel?: string
  className?: string
  defaultVisible?: readonly string[]
  readOnly?: boolean
  triggerLabel?: string
  visible?: readonly string[]
  onVisibleChange?: (visible: readonly string[]) => void
}

export function PropertyCollection({
  ariaLabel,
  className,
  defaultVisible,
  items,
  onVisibleChange,
  readOnly = false,
  triggerLabel = 'Ajustar propriedades',
  visible,
}: Readonly<PropertyCollectionProps>) {
  const [uncontrolledVisible, setUncontrolledVisible] = useState<
    readonly string[]
  >(
    () =>
      defaultVisible ??
      items.filter((item) => item.defaultVisible).map((item) => item.id),
  )

  const visibleIds = visible ?? uncontrolledVisible
  const visibleSet = new Set(visibleIds)

  const toggle = (id: string) => {
    const next = items
      .filter((item) =>
        item.id === id ? !visibleSet.has(id) : visibleSet.has(item.id),
      )
      .map((item) => item.id)
    if (visible === undefined) {
      setUncontrolledVisible(next)
    }
    onVisibleChange?.(next)
  }

  return (
    <PropertyRow
      ariaLabel={ariaLabel}
      className={cn('flex flex-wrap items-center gap-x-1 gap-y-0.5', className)}
      slot="property-collection"
    >
      {items
        .filter((item) => visibleSet.has(item.id))
        .map((item) => (
          <Fragment key={item.id}>{item.render()}</Fragment>
        ))}
      {readOnly ? null : (
        <Menu>
          <MenuTrigger
            aria-label={triggerLabel}
            render={
              <PropertySurface
                className="text-muted-foreground"
                render={<button type="button" />}
              />
            }
          >
            <EllipsisIcon aria-hidden className="size-3.5" />
          </MenuTrigger>
          <MenuPopup align="start">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <MenuCheckboxOption
                  checked={visibleSet.has(item.id)}
                  closeOnClick={false}
                  key={item.id}
                  onCheckedChange={() => toggle(item.id)}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {Icon ? (
                      <Icon
                        aria-hidden
                        className="size-4 text-muted-foreground"
                      />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </span>
                </MenuCheckboxOption>
              )
            })}
          </MenuPopup>
        </Menu>
      )}
    </PropertyRow>
  )
}
