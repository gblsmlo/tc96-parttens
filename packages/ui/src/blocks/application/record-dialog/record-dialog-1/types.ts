import type {
  PeoplePropertyLabels,
  PropertyOption,
  SchedulePropertyLabels,
  TextPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export interface RecordDialog1Slot {
  date: string
  end: string
  start: string
}

export type RecordDialog1Availability = 'busy' | 'free'
export type RecordDialog1Calendar = 'appointments' | 'sales' | 'personal'
export type RecordDialog1Type = 'meeting' | 'video' | 'call'

export interface RecordDialog1Values {
  allDay: boolean
  availability: RecordDialog1Availability
  calendar: RecordDialog1Calendar
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
  type: RecordDialog1Type
  until: string | null
}

export type RecordDialog1Person = PersonPropertyOption

export interface RecordDialog1Labels {
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

export interface RecordDialog1Props {
  availabilityOptions?: readonly PropertyOption[]
  calendarOptions?: readonly PropertyOption[]
  className?: string
  labels?: Partial<RecordDialog1Labels>
  locale?: string
  onCreate: (values: RecordDialog1Values) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  people: readonly RecordDialog1Person[]
  slot?: RecordDialog1Slot
  timeZone?: string
  typeOptions?: readonly PropertyOption[]
}
