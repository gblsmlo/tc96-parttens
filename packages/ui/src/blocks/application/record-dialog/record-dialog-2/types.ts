import type {
  PeoplePropertyLabels,
  PropertyOption,
  SchedulePropertyLabels,
  TextPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export interface RecordDialog2Slot {
  date: string
  end: string
  start: string
}

export type RecordDialog2Availability = 'busy' | 'free'
export type RecordDialog2Calendar = 'appointments' | 'sales' | 'personal'
export type RecordDialog2Type = 'meeting' | 'video' | 'call'

export interface RecordDialog2Values {
  allDay: boolean
  availability: RecordDialog2Availability
  calendar: RecordDialog2Calendar
  description: string
  end: string
  frequency: string | null
  guests: readonly string[]
  link: string
  location: string
  phones: readonly string[]
  reminderMinutes: readonly number[]
  start: string
  title: string
  type: RecordDialog2Type
  until: string | null
}

export type RecordDialog2Person = PersonPropertyOption

export interface RecordDialog2Labels {
  availability: string
  availabilityBusy: string
  availabilityFree: string
  calendar: string
  calendarAppointments: string
  calendarPersonal: string
  calendarSales: string
  cancel: string
  createMore: string
  date: string
  description: string
  descriptionPlaceholder: string
  endBeforeStart: string
  guests: string
  guestsPlaceholder: string
  link: string
  linkFallback: string
  location: string
  locationFallback: string
  missingTime: string
  peoplePicker: PeoplePropertyLabels
  phone: string
  phonePlaceholder: string
  saveFailed: string
  schedule: Partial<SchedulePropertyLabels>
  submit: string
  submitting: string
  text: Partial<TextPropertyLabels>
  title: string
  titleAncestor: string
  titleCall: string
  titleMeeting: string
  titlePlaceholder: string
  titleVideo: string
  type: string
  typeCall: string
  typeMeeting: string
  typeVideo: string
}

export interface RecordDialog2Props {
  availabilityOptions?: readonly PropertyOption[]
  calendarOptions?: readonly PropertyOption[]
  className?: string
  labels?: Partial<RecordDialog2Labels>
  locale?: string
  onCreate: (values: RecordDialog2Values) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  people: readonly RecordDialog2Person[]
  slot?: RecordDialog2Slot
  timeZone?: string
  typeOptions?: readonly PropertyOption[]
}
