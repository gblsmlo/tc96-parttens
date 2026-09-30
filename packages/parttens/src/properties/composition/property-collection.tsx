'use client'

import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { EllipsisIcon } from 'lucide-react'
import type React from 'react'
import { Fragment, useState } from 'react'
import type { PropertyIcon } from '../shared/property-catalog'
import { PropertySurface } from '../shared/property-surface'

export interface PropertyCollectionItem {
  id: string
  /** Nome da propriedade no menu de preferência. */
  label: string
  /** Ícone da propriedade no menu de preferência. */
  icon?: PropertyIcon
  /** Entra visível antes de qualquer preferência do usuário. */
  defaultVisible?: boolean
  /** A Property renderizada quando visível; o estado vazio é affordance dela. */
  render: () => React.ReactNode
}

export interface PropertyCollectionProps {
  /** Catálogo de propriedades da collection, na ordem de exibição. */
  items: readonly PropertyCollectionItem[]
  ariaLabel?: string
  className?: string
  /** Ids visíveis no modo não controlado; sobrepõe os `defaultVisible` dos itens. */
  defaultVisible?: readonly string[]
  /** Título do menu de preferência. */
  menuLabel?: string
  /** Oculta o trigger de preferência; a fileira mostra só os visíveis. */
  readOnly?: boolean
  /** Rótulo acessível do trigger de preferência. */
  triggerLabel?: string
  /** Ids visíveis no modo controlado. */
  visible?: readonly string[]
  onVisibleChange?: (visible: readonly string[]) => void
}

export function PropertyCollection({
  ariaLabel,
  className,
  defaultVisible,
  items,
  menuLabel = 'Propriedades',
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
    // A visibilidade muda, a posição não: o resultado segue a ordem do
    // catálogo, para religar uma propriedade devolvê-la ao mesmo lugar.
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
    <fieldset
      aria-label={ariaLabel}
      className={cn(
        'flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5',
        className,
      )}
      data-slot="property-collection"
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
            <MenuGroup>
              <MenuGroupLabel>{menuLabel}</MenuGroupLabel>
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
            </MenuGroup>
          </MenuPopup>
        </Menu>
      )}
    </fieldset>
  )
}
