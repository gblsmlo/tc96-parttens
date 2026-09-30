'use client'

import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { badgeVariants } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import type React from 'react'

export type PropertyVariant = 'badge' | 'plain'

/**
 * Superfície de badge das properties: pílula de 24px, mesma altura do gatilho
 * de `TagsProperty` e `PhoneProperty`. O `size` do Badge do consumidor varia
 * (o COSS upstream cai para 18px em `sm`); a fileira de propriedades precisa de
 * uma métrica só, então ela mora aqui e não no primitive.
 */
export const propertyBadgeClassName = cn(
  badgeVariants({ variant: 'secondary' }),
  'h-6 min-w-6 rounded-full px-[calc(--spacing(2.5)-1px)] text-sm sm:h-6 sm:min-w-6 sm:text-sm',
)

export interface PropertySurfaceProps extends useRender.ComponentProps<'span'> {
  variant?: PropertyVariant
  /**
   * A superfície mostra ausência — placeholder ou fallback — e não um valor. O
   * texto recua para o tom secundário, como o placeholder de um campo: assim a
   * fileira de propriedades diz de relance o que foi preenchido e o que não.
   */
  muted?: boolean
}

export function PropertySurface({
  className,
  muted = false,
  render,
  variant = 'badge',
  ...props
}: PropertySurfaceProps): React.ReactElement {
  const mutedClassName = muted ? 'text-muted-foreground' : undefined
  const defaultProps = {
    className:
      variant === 'badge'
        ? cn(propertyBadgeClassName, mutedClassName, className)
        : cn(
            mutedClassName,
            'inline-flex min-w-0 max-w-full items-center gap-1 whitespace-nowrap text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [button&,a&]:cursor-pointer [button&,a&]:hover:text-foreground',
            className,
          ),
    'data-slot': 'property-surface',
    'data-variant': variant,
    ...(muted ? { 'data-empty': 'true' } : {}),
    /**
     * `aria-label` num `span` sem papel e atributo proibido: o nome acessivel nao
     * tem onde se apoiar, e o axe reprova. Quando a superficie recebe rotulo e nao
     * declara papel, ela e um composto de icone e texto — `img` e o papel que
     * aceita nome e mantem a leitura correta. So vale para a superficie padrao:
     * com `render`, quem decide o papel e o elemento pedido — um `button` que
     * virasse `img` perderia o proprio papel.
     */
    ...(props['aria-label'] && !props.role && !render ? { role: 'img' } : {}),
  }

  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(defaultProps, props),
    render,
  })
}
