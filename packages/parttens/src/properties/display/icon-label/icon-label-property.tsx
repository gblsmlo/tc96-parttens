'use client'

import { cn } from '@tc96/utils'
import type React from 'react'
import type { ReactNode } from 'react'
import {
  PropertySurface,
  type PropertySurfaceProps,
  type PropertyVariant,
} from '../../shared/property-surface'

export type IconLabelPropertyIcon = React.ComponentType<
  React.SVGProps<SVGSVGElement>
>

export type IconLabelPropertyTrailingVisibility = 'always' | 'hover'

export interface IconLabelPropertyProps {
  label: ReactNode
  ariaLabel?: string
  className?: string
  icon?: IconLabelPropertyIcon
  iconClassName?: string
  leading?: ReactNode
  /** A superfície mostra ausência, não valor: o texto recua para o tom secundário. */
  muted?: boolean
  render?: PropertySurfaceProps['render']
  trailing?: ReactNode
  /**
   * `hover` guarda a afordância até o ponteiro chegar. Numa lateral onde toda
   * fileira oferece a mesma ação, os ícones repetidos disputam a leitura com os
   * valores. O espaço continua reservado — é opacidade, não remoção —, então a
   * fileira não salta; foco e ponteiro grosso revelam sem hover.
   */
  trailingVisibility?: IconLabelPropertyTrailingVisibility
  variant?: PropertyVariant
}

/**
 * Base compartilhada por toda property de ícone opcional + rótulo truncado:
 * `TextProperty`, `FlagProperty` e `ReferenceProperty` renderizavam essa mesma
 * forma cada uma com sua própria cópia. O que muda entre elas é de onde vem o
 * ícone e o rótulo — um catálogo fechado, um booleano ativo/inativo, um valor
 * anulável — não a superfície.
 *
 * `leading` e `trailing` abrem os dois lados para conteúdo que não é ícone de
 * catálogo (avatar, afordância de ação, indicador de cópia); `render` troca o
 * elemento raiz quando a property é navegável ou acionável.
 */
export function IconLabelProperty({
  ariaLabel,
  className,
  icon: Icon,
  iconClassName,
  label,
  leading,
  muted = false,
  render,
  trailing,
  trailingVisibility = 'always',
  variant = 'badge',
}: Readonly<IconLabelPropertyProps>) {
  const hidesTrailing = Boolean(trailing) && trailingVisibility === 'hover'

  return (
    <PropertySurface
      aria-label={
        ariaLabel
          ? `${ariaLabel}: ${typeof label === 'string' ? label : ''}`.trim()
          : undefined
      }
      className={cn('max-w-full', hidesTrailing && 'group/property', className)}
      muted={muted}
      render={render}
      // Com afordância dentro, a superfície não pode ser `img`: filho de `img` é
      // presentacional para a árvore de acessibilidade, e o botão sumiria dela.
      // `group` mantém o nome e deixa o botão alcançável.
      role={trailing && ariaLabel ? 'group' : undefined}
      variant={variant}
    >
      {leading}
      {Icon ? (
        <Icon aria-hidden className={cn('size-3', iconClassName)} />
      ) : null}
      <span className="truncate">{label}</span>
      {hidesTrailing ? (
        <span
          // Teclado e toque não têm hover: sem `focus-within` a afordância seria
          // inalcançável pelo `Tab`, e sem `pointer-coarse` sumiria no celular.
          className="pointer-coarse:opacity-100 flex shrink-0 self-stretch items-center opacity-0 transition-opacity group-focus-within/property:opacity-100 group-hover/property:opacity-100"
          data-slot="property-trailing"
        >
          {trailing}
        </span>
      ) : (
        trailing
      )}
    </PropertySurface>
  )
}
