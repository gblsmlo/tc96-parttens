'use client'

import { cn } from '@tc96/utils'
import { PlusIcon } from 'lucide-react'
import {
  Children,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from 'react'
import { PropertySurface } from '../../shared/property-surface'

export interface AttachmentsPropertyAction {
  label: string
  onSelect: () => void
  disabled?: boolean
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export interface AttachmentsPropertyProps {
  children?: ReactNode
  /**
   * O caminho de adição da fileira. É **um** — como o `+` de `TagsProperty`.
   * Dois gatilhos colapsados viram dois `+` idênticos lado a lado, que não
   * dizem qual adiciona o quê. Fileiras que aceitam coisas diferentes são
   * fileiras diferentes, cada uma com seu rótulo.
   */
  action?: AttachmentsPropertyAction
  ariaLabel?: string
  className?: string
}

/**
 * A fileira de anexos: os `AttachmentProperty` que ela recebe, seguidos do
 * caminho de adição. Diferente de `TagsProperty`, o conteúdo vem por composição
 * e não de um catálogo de opções — um anexo nasce de um upload ou de um
 * diálogo, não de uma lista para escolher.
 */
export function AttachmentsProperty({
  action,
  ariaLabel,
  children,
  className,
}: Readonly<AttachmentsPropertyProps>) {
  const hasAttachments = Children.count(children) > 0
  // Com anexos na fileira o gatilho colapsa para o `+`; vazia, ele precisa
  // dizer o que adiciona, senão o estado inicial não tem afordância nenhuma.
  const Icon = hasAttachments ? PlusIcon : action?.icon

  return (
    <fieldset
      aria-label={ariaLabel}
      className={cn(
        'flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5',
        className,
      )}
      data-slot="attachments-property"
    >
      {children}
      {action ? (
        <PropertySurface
          className={cn('text-muted-foreground', hasAttachments && 'w-6 px-0')}
          render={
            <button
              aria-label={action.label}
              disabled={action.disabled}
              onClick={action.onSelect}
              type="button"
            />
          }
        >
          {Icon ? <Icon aria-hidden className="size-3.5" /> : null}
          {hasAttachments ? null : (
            <span className="truncate">{action.label}</span>
          )}
        </PropertySurface>
      ) : null}
    </fieldset>
  )
}
