import type {
  PeoplePropertyLabels,
  PropertyOption,
  SchedulePropertyLabels,
  TextPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export interface Agenda1Slot {
  date: string
  end: string
  start: string
}

export type Agenda1Availability = 'busy' | 'free'
export type Agenda1Calendar = 'appointments' | 'sales' | 'personal'
export type Agenda1Type = 'meeting' | 'video' | 'call'

export interface Agenda1Values {
  allDay: boolean
  availability: Agenda1Availability
  calendar: Agenda1Calendar
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
  type: Agenda1Type
  until: string | null
}

export type Agenda1Person = PersonPropertyOption

export interface Agenda1Labels {
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

export interface Agenda1Props {
  availabilityOptions?: readonly PropertyOption[]
  calendarOptions?: readonly PropertyOption[]
  className?: string
  labels?: Partial<Agenda1Labels>
  locale?: string
  onCreate: (values: Agenda1Values) => void | Promise<void>
  onOpenChange: (open: boolean) => void
  open: boolean
  people: readonly Agenda1Person[]
  slot?: Agenda1Slot
  timeZone?: string
  typeOptions?: readonly PropertyOption[]
}
