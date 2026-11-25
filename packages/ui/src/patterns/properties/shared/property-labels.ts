export interface DatePropertyLabels {
  clear: string
  fallback: string
}

export interface DateRangePropertyLabels {
  clear: string
  fallback: string
  from: string
  until: string
}

export interface SchedulePropertyLabels {
  addReminder: string
  allDay: string
  back: string
  clearUntil: string
  daily: string
  end: string
  fallback: string
  frequency: string
  monthly: string
  nextWeek: string
  noDate: string
  noReminders: string
  noRepeat: string
  oneDayBefore: string
  oneHourBefore: string
  presets: string
  reminders: string
  removeReminder: string
  repeat: string
  start: string
  tenMinutesBefore: string
  thirtyMinutesBefore: string
  thisWeekend: string
  time: string
  today: string
  tomorrow: string
  until: string
  untilFallback: string
  weekdays: string
  weekly: string
  yearly: string
}

export interface SelectPropertyLabels {
  emptyOption: string
  fallback: string
}

export interface TextPropertyLabels {
  copy: string
  fallback: string
  add?: string
  inputPlaceholder?: string
}

export interface PropertyEntryListLabels {
  add: string
  addAnother: string
  duplicate: string
  entries: readonly string[]
  invalid: string
  remove: string
  removeEntry: (entry: string) => string
  save: string
  inputPlaceholder?: string
}

export type EmailPropertyLabels = PropertyEntryListLabels

export interface PhoneInputLabels {
  country: string
  countryEmpty: string
  countryList: string
  countrySearch: string
}

export interface PhonePropertyLabels
  extends PropertyEntryListLabels,
    PhoneInputLabels {
  required: string
}

export interface PeoplePropertyLabels {
  add: string
  empty: string
  loading: string
  remove: string
}

export interface TagsPropertyLabels {
  add: string
  count: (count: number) => string
  empty: string
  loading: string
  remove: string
}

export interface AttachmentPropertyLabels {
  remove: string
}

export interface PropertyCollectionLabels {
  trigger: string
}

export interface PropertyLabels {
  attachment: AttachmentPropertyLabels
  collection: PropertyCollectionLabels
  date: DatePropertyLabels
  dateRange: DateRangePropertyLabels
  email: EmailPropertyLabels
  people: PeoplePropertyLabels
  phone: PhonePropertyLabels
  phoneInput: PhoneInputLabels
  schedule: SchedulePropertyLabels
  select: SelectPropertyLabels
  tags: TagsPropertyLabels
  text: TextPropertyLabels
}

const phoneInputLabels: PhoneInputLabels = {
  country: 'Country',
  countryEmpty: 'No country found.',
  countryList: 'Select country',
  countrySearch: 'Search country',
}

export const defaultPropertyLabels: PropertyLabels = {
  attachment: { remove: 'Remove attachment' },
  collection: { trigger: 'Adjust properties' },
  date: { clear: 'Clear date', fallback: 'No date' },
  dateRange: {
    clear: 'Clear period',
    fallback: 'No period',
    from: 'From',
    until: 'Until',
  },
  email: {
    add: 'Add email',
    addAnother: 'Add another',
    duplicate: 'This email is already in the list.',
    entries: ['Primary', 'Secondary'],
    inputPlaceholder: 'name@example.com',
    invalid: 'Enter a valid email.',
    remove: 'Remove email',
    removeEntry: (entry) => `Remove ${entry} email`,
    save: 'Save',
  },
  people: {
    add: 'Add person',
    empty: 'No people found.',
    loading: 'Loading people…',
    remove: 'Remove',
  },
  phone: {
    ...phoneInputLabels,
    add: 'Add phone',
    addAnother: 'Add another',
    duplicate: 'This phone is already in the list.',
    entries: ['Primary', 'Secondary'],
    invalid: 'Enter a valid phone number.',
    remove: 'Remove phone',
    removeEntry: (entry) => `Remove ${entry} phone`,
    required: 'Enter a phone number.',
    save: 'Save',
  },
  phoneInput: phoneInputLabels,
  schedule: {
    addReminder: 'Add reminder',
    allDay: 'All day',
    back: 'Back',
    clearUntil: 'Clear date',
    daily: 'Daily',
    end: 'End',
    fallback: 'No date',
    frequency: 'Frequency',
    monthly: 'Monthly',
    nextWeek: 'Next week',
    noDate: 'No date',
    noReminders: 'No reminders found.',
    noRepeat: 'Does not repeat',
    oneDayBefore: '1 day before',
    oneHourBefore: '1 hour before',
    presets: 'Date shortcuts',
    reminders: 'Reminders',
    removeReminder: 'Remove reminder',
    repeat: 'Repeat',
    start: 'Start',
    tenMinutesBefore: '10 min before',
    thirtyMinutesBefore: '30 min before',
    thisWeekend: 'This weekend',
    time: 'Time',
    today: 'Today',
    tomorrow: 'Tomorrow',
    until: 'Until',
    untilFallback: 'No end',
    weekdays: 'Weekdays',
    weekly: 'Weekly',
    yearly: 'Yearly',
  },
  select: { emptyOption: 'None', fallback: '—' },
  tags: {
    add: 'Add tag',
    count: (count) => `${count} ${count === 1 ? 'Tag' : 'Tags'}`,
    empty: 'No tags found.',
    loading: 'Loading tags…',
    remove: 'Remove tag',
  },
  text: { copy: 'Copy', fallback: 'Not set' },
}

export const defaultPropertyAriaLabels = {
  assigned: 'Assignee',
  date: 'Date',
  dateRange: 'Period',
  email: 'Emails',
  people: 'People',
  person: 'Person',
  phone: 'Phones',
  tags: 'Tags',
} as const

export const defaultPropertyPlaceholders = {
  assigned: 'No assignee',
  email: 'No email',
  people: 'Add person',
  person: 'No assignee',
  phone: 'No phone',
  tags: 'Add a tag',
} as const

export function resolvePropertyLabels<TLabels extends object>(
  defaults: TLabels,
  overrides: Partial<TLabels> | undefined,
): TLabels {
  const resolved = { ...defaults }

  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (value !== undefined) Object.assign(resolved, { [key]: value })
  }

  return resolved
}
