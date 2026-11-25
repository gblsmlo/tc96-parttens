import { cn } from '@tc96/utils'
import { propertyToneClassName } from '../../shared/property-catalog'
import {
  type AttachmentType,
  attachmentTypeMeta,
} from '../../shared/property-display-meta'

export type { AttachmentType }

export interface AttachmentTypeIconProps {
  type: AttachmentType
  className?: string
}

export function AttachmentTypeIcon({
  className,
  type,
}: Readonly<AttachmentTypeIconProps>) {
  const { icon: Icon, tone } = attachmentTypeMeta[type]

  return (
    <Icon
      aria-hidden="true"
      className={cn('size-4 shrink-0', propertyToneClassName[tone], className)}
      data-attachment-type={type}
      data-slot="attachment-type-icon"
    />
  )
}
