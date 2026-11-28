'use client'

import { DotsThreeIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { Skeleton } from '@tc96/ui/skeleton'
import { cn } from '@tc96/utils'
import type React from 'react'
import { Fragment, useState } from 'react'
import type { PropertyIcon } from '../shared/property-catalog'
import {
  defaultPropertyLabels,
  type PropertyCollectionLabels,
  resolvePropertyLabels,
} from '../shared/property-labels'
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
  error?: boolean
  labels?: Partial<PropertyCollectionLabels>
  loading?: boolean
  readOnly?: boolean
  visible?: readonly string[]
  onRetry?: () => void
  onVisibleChange?: (visible: readonly string[]) => void
}

export function PropertyCollection({
  ariaLabel,
  className,
  defaultVisible,
  error = false,
  items,
  labels: labelOverrides,
  loading = false,
  onRetry,
  onVisibleChange,
  readOnly = false,
  visible,
}: Readonly<PropertyCollectionProps>) {
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.collection,
    labelOverrides,
  )
  const [uncontrolledVisible, setUncontrolledVisible] = useState<
    readonly string[]
  >(
    () =>
      defaultVisible ??
      items.filter((item) => item.defaultVisible).map((item) => item.id),
  )

  const visibleIds = visible ?? uncontrolledVisible
  const visibleSet = new Set(visibleIds)
  const visibleItems = items.filter((item) => visibleSet.has(item.id))
  const failed = error && !loading

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
      aria-busy={loading ? 'true' : undefined}
      ariaLabel={ariaLabel}
      className={cn('flex flex-wrap items-center gap-x-1 gap-y-0.5', className)}
      slot="property-collection"
    >
      {loading ? (
        <output
          aria-busy="true"
          aria-label={labels.loading}
          className="contents"
          data-slot="property-collection-loading"
        >
          {visibleItems.map((item) => (
            <Skeleton aria-hidden className="h-6 w-20" key={item.id} />
          ))}
        </output>
      ) : failed ? (
        <>
          <span
            className="inline-flex h-6 min-w-0 items-center gap-1.5 text-destructive-foreground text-sm"
            data-slot="property-collection-error"
            role="alert"
          >
            <WarningCircleIcon aria-hidden className="size-4 shrink-0" />
            {labels.error}
          </span>
          {onRetry ? (
            <PropertySurface
              onClick={onRetry}
              render={<button type="button" />}
            >
              {labels.retry}
            </PropertySurface>
          ) : null}
        </>
      ) : (
        visibleItems.map((item) => (
          <Fragment key={item.id}>{item.render()}</Fragment>
        ))
      )}
      {readOnly || loading || failed ? null : (
        <Menu>
          <MenuTrigger
            aria-label={labels.trigger}
            render={
              <PropertySurface
                className="text-muted-foreground"
                render={<button type="button" />}
              />
            }
          >
            <DotsThreeIcon aria-hidden className="size-4" />
          </MenuTrigger>
          <MenuPopup align="start">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <MenuCheckboxItem
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
                </MenuCheckboxItem>
              )
            })}
          </MenuPopup>
        </Menu>
      )}
    </PropertyRow>
  )
}
