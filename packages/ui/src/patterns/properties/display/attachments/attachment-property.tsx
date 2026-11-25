'use client'

import { XIcon } from '@phosphor-icons/react'
import { cn } from '@tc96/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import {
  type AttachmentPropertyLabels,
  defaultPropertyLabels,
  resolvePropertyLabels,
} from '../../shared/property-labels'
import { PropertySurface } from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import { type AttachmentType, AttachmentTypeIcon } from './attachment-type'

export interface AttachmentPropertyProps
  extends Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'download'> {
  action?: 'anchor' | 'download'
  label: ReactNode
  labels?: Partial<AttachmentPropertyLabels>
  onRemove?: () => void
  type?: AttachmentType
}

export function AttachmentProperty({
  action = 'anchor',
  className,
  label,
  labels: labelOverrides,
  onRemove,
  type,
  ...props
}: Readonly<AttachmentPropertyProps>) {
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.attachment,
    labelOverrides,
  )

  return (
    <PropertySurface
      className={cn('max-w-full', onRemove && 'pe-0', className)}
      data-slot="attachment-property"
    >
      <IconLabelProperty
        label={label}
        leading={
          type ? <AttachmentTypeIcon aria-hidden="true" type={type} /> : null
        }
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
          aria-label={labels.remove}
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
