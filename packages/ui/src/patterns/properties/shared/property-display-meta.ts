import {
  BuildingsIcon,
  CalendarBlankIcon,
  CalendarDotsIcon,
  CalendarIcon,
  CellSignalHighIcon,
  CircleHalfIcon,
  CubeIcon,
  EnvelopeSimpleIcon,
  FileIcon,
  FileTextIcon,
  LinkIcon,
  MapPinIcon,
  PackageIcon,
  PhoneIcon,
  ShapesIcon,
  TagIcon,
  UserIcon,
  UserPlusIcon,
  UsersThreeIcon,
  VideoCameraIcon,
  WaveformIcon,
} from '@phosphor-icons/react'
import type { PropertyIcon, PropertyOption } from './property-catalog'

export type AttachmentType = 'audio' | 'doc' | 'link' | 'pdf'

export type ReferencePropertyKind = 'account' | 'product' | 'record'

export type PropertyDisplayMeta = Required<
  Pick<PropertyOption, 'icon' | 'tone'>
> &
  Pick<PropertyOption, 'weight'>

export const propertyDisplayIcons = {
  date: CalendarDotsIcon,
  dateRange: CalendarIcon,
  email: EnvelopeSimpleIcon,
  link: LinkIcon,
  location: MapPinIcon,
  meeting: UsersThreeIcon,
  person: UserIcon,
  personAdd: UserPlusIcon,
  phone: PhoneIcon,
  priority: CellSignalHighIcon,
  schedule: CalendarBlankIcon,
  status: CircleHalfIcon,
  tags: TagIcon,
  type: ShapesIcon,
  video: VideoCameraIcon,
} as const satisfies Record<string, PropertyIcon>

export const referenceKindIcons = {
  account: BuildingsIcon,
  product: PackageIcon,
  record: CubeIcon,
} as const satisfies Record<ReferencePropertyKind, PropertyIcon>

export const attachmentTypeMeta = {
  audio: { icon: WaveformIcon, tone: 'warning' },
  doc: { icon: FileIcon, tone: 'info' },
  link: { icon: LinkIcon, tone: 'neutral' },
  pdf: { icon: FileTextIcon, tone: 'danger' },
} as const satisfies Record<AttachmentType, PropertyDisplayMeta>
