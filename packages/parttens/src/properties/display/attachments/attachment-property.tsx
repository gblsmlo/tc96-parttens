'use client'

import { cn } from '@tc96/utils'
import { XIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { PropertySurface } from '../../shared/property-surface'
import { type AttachmentType, AttachmentTypeIcon } from './attachment-type'

export interface AttachmentPropertyProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'download'> {
  action?: 'anchor' | 'download'
  label: ReactNode
  /** Ausente, o anexo não oferece remoção — é o chip de quem só pode ler. */
  onRemove?: () => void
  removeLabel?: string
  type?: AttachmentType
}

/**
 * Um anexo é uma property navegável, na anatomia do chip de `TagsProperty`:
 * ícone de tipo à esquerda, rótulo, e o `×` de remover à direita. O pill é o
 * wrapper e o link mora dentro dele — botão dentro de âncora é marcação
 * inválida, e o leitor de tela anunciaria um controle só.
 *
 * A afordância da direita é sempre a mesma, remover; `anchor` e `download`
 * decidem só como o destino abre. Um ícone de download ali competiria com o `×`
 * pelo mesmo canto e faria dois chips iguais parecerem diferentes.
 *
 * Singular é o item; `AttachmentsProperty` é a fileira que o hospeda.
 */
export function AttachmentProperty({
  action = 'anchor',
  className,
  label,
  onRemove,
  removeLabel,
  type,
  ...props
}: Readonly<AttachmentPropertyProps>) {
  return (
    <PropertySurface
      className={cn('max-w-full', onRemove && 'pe-0', className)}
      data-slot="attachment-property"
    >
      <IconLabelProperty
        label={label}
        leading={type ? <AttachmentTypeIcon type={type} /> : null}
        render={
          <a
            data-slot="attachment-property-link"
            download={action === 'download' ? true : undefined}
            {...props}
          />
        }
        variant="plain"
      />
      {onRemove ? (
        <button
          aria-label={removeLabel ?? 'Remover anexo'}
          className="h-full shrink-0 cursor-pointer px-1.5 opacity-80 transition-opacity hover:opacity-100"
          data-slot="attachment-property-remove"
          onClick={onRemove}
          type="button"
        >
          <XIcon aria-hidden="true" />
        </button>
      ) : null}
    </PropertySurface>
  )
}
