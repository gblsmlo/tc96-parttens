'use client'

import { cn } from '@tc96/utils'
import { XIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { PropertySurface } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { type AttachmentType, AttachmentTypeIcon } from './attachment-type'

export interface AttachmentPropertyProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'download'> {
  action?: 'anchor' | 'download'
  label: ReactNode
  onRemove?: () => void
  removeLabel?: string
  type?: AttachmentType
}

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
