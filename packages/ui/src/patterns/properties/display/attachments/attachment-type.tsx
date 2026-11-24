import {
  FileIcon,
  FileTextIcon,
  LinkIcon,
  WaveformIcon,
} from '@phosphor-icons/react'
import { cn } from '@tc96/utils'
import {
  type PropertyIcon,
  type PropertyTone,
  propertyToneClassName,
} from '../../shared/property-catalog'

export type AttachmentType = 'audio' | 'doc' | 'link' | 'pdf'

interface AttachmentTypePreset {
  icon: PropertyIcon
  label: string
  tone: PropertyTone
}

export const attachmentTypeCatalog: Record<
  AttachmentType,
  AttachmentTypePreset
> = {
  audio: { icon: WaveformIcon, label: 'Áudio', tone: 'warning' },
  doc: { icon: FileIcon, label: 'Documento', tone: 'info' },
  link: { icon: LinkIcon, label: 'Link', tone: 'neutral' },
  pdf: { icon: FileTextIcon, label: 'PDF', tone: 'danger' },
}

export interface AttachmentTypeIconProps {
  type: AttachmentType
  className?: string
}

export function AttachmentTypeIcon({
  className,
  type,
}: Readonly<AttachmentTypeIconProps>) {
  const preset = attachmentTypeCatalog[type]
  const Icon = preset.icon

  return (
    <Icon
      aria-hidden="true"
      className={cn(
        'size-4 shrink-0',
        propertyToneClassName[preset.tone],
        className,
      )}
      data-attachment-type={type}
      data-slot="attachment-type-icon"
    />
  )
}
