'use client'

import { cn } from '@tc96/utils'
import {
  Children,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from 'react'
import { PropertyAddTrigger } from '../../shared/property-add-trigger'
import { PropertyRow } from '../../shared/property-row'

export interface AttachmentsPropertyAction {
  label: string
  onSelect: () => void
  disabled?: boolean
  icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export interface AttachmentsPropertyProps {
  children?: ReactNode
  action?: AttachmentsPropertyAction
  ariaLabel?: string
  className?: string
}

export function AttachmentsProperty({
  action,
  ariaLabel,
  children,
  className,
}: Readonly<AttachmentsPropertyProps>) {
  const hasAttachments = Children.count(children) > 0

  return (
    <PropertyRow
      ariaLabel={ariaLabel}
      className={cn('flex flex-wrap items-center gap-x-1 gap-y-0.5', className)}
      slot="attachments-property"
    >
      {children}
      {action ? (
        <PropertyAddTrigger
          addLabel={action.label}
          className="text-muted-foreground"
          disabled={action.disabled}
          hasValue={hasAttachments}
          icon={action.icon}
          muted={false}
          onClick={action.onSelect}
          placeholder={action.label}
        />
      ) : null}
    </PropertyRow>
  )
}
