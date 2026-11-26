import {
  AddressBookIcon,
  BankIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingsIcon,
  FileTextIcon,
  FlagIcon,
  GearIcon,
  HashIcon,
  type Icon as PhosphorIcon,
  ScalesIcon,
  StackIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { RecordDialog6FieldId, RecordDialog6SectionId } from './types'

export type RecordDialog6Control =
  | 'instance'
  | 'partyRole'
  | 'partyContact'
  | 'owner'
  | 'phase'
  | 'contract'
  | 'text'
  | 'toggle'

export interface RecordDialog6Row {
  control: RecordDialog6Control
  icon: PhosphorIcon
  id: RecordDialog6FieldId
}

export interface RecordDialog6Section {
  icon: PhosphorIcon
  id: RecordDialog6SectionId
  rows: readonly RecordDialog6Row[]
}

export const recordDialog6Sections: readonly RecordDialog6Section[] = [
  {
    icon: BankIcon,
    id: 'lawsuit',
    rows: [
      { control: 'text', icon: HashIcon, id: 'number' },
      { control: 'text', icon: ScalesIcon, id: 'action' },
      { control: 'text', icon: BookOpenIcon, id: 'subject' },
      { control: 'text', icon: BankIcon, id: 'venue' },
      { control: 'text', icon: BuildingsIcon, id: 'division' },
      { control: 'instance', icon: StackIcon, id: 'instance' },
    ],
  },
  {
    icon: UsersIcon,
    id: 'party',
    rows: [
      { control: 'text', icon: UserIcon, id: 'partyName' },
      { control: 'partyRole', icon: TagIcon, id: 'partyRole' },
      { control: 'partyContact', icon: AddressBookIcon, id: 'partyContact' },
    ],
  },
  {
    icon: BriefcaseIcon,
    id: 'office',
    rows: [
      { control: 'owner', icon: UserIcon, id: 'owner' },
      { control: 'phase', icon: FlagIcon, id: 'phase' },
      { control: 'contract', icon: FileTextIcon, id: 'contract' },
    ],
  },
  {
    icon: GearIcon,
    id: 'settings',
    rows: [{ control: 'toggle', icon: BellIcon, id: 'monitor' }],
  },
]
