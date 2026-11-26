import { BriefcaseIcon, CircleIcon, CoffeeIcon } from '@phosphor-icons/react'
import {
  type PropertyOption,
  propertyDisplayIcons,
} from '@tc96/ui/patterns/properties/core'
import type { Agenda2Labels } from './types'

export function createAgenda2TypeOptions(
  labels: Agenda2Labels,
): readonly PropertyOption[] {
  return [
    {
      icon: propertyDisplayIcons.meeting,
      label: labels.typeMeeting,
      tone: 'neutral',
      value: 'meeting',
    },
    {
      icon: propertyDisplayIcons.video,
      label: labels.typeVideo,
      tone: 'neutral',
      value: 'video',
    },
    {
      icon: propertyDisplayIcons.phone,
      label: labels.typeCall,
      tone: 'neutral',
      value: 'call',
    },
  ]
}

export function createAgenda2CalendarOptions(
  labels: Agenda2Labels,
): readonly PropertyOption[] {
  return [
    {
      icon: CircleIcon,
      label: labels.calendarAppointments,
      tone: 'danger',
      value: 'appointments',
    },
    {
      icon: CircleIcon,
      label: labels.calendarSales,
      tone: 'info',
      value: 'sales',
    },
    {
      icon: CircleIcon,
      label: labels.calendarPersonal,
      tone: 'success',
      value: 'personal',
    },
  ]
}

export function createAgenda2AvailabilityOptions(
  labels: Agenda2Labels,
): readonly PropertyOption[] {
  return [
    {
      icon: BriefcaseIcon,
      label: labels.availabilityBusy,
      tone: 'neutral',
      value: 'busy',
    },
    {
      icon: CoffeeIcon,
      label: labels.availabilityFree,
      tone: 'neutral',
      value: 'free',
    },
  ]
}

export function createAgenda2RecurrenceOptions(
  labels: Agenda2Labels['schedule'],
): readonly PropertyOption[] {
  return [
    { label: labels.daily ?? 'Daily', value: 'daily' },
    { label: labels.weekdays ?? 'Weekdays', value: 'weekdays' },
    { label: labels.weekly ?? 'Weekly', value: 'weekly' },
    { label: labels.monthly ?? 'Monthly', value: 'monthly' },
    { label: labels.yearly ?? 'Yearly', value: 'yearly' },
  ]
}

export function createAgenda2ReminderOptions(
  labels: Agenda2Labels['schedule'],
): readonly PropertyOption[] {
  return [
    { label: labels.tenMinutesBefore ?? '10 minutes before', value: '10' },
    { label: labels.thirtyMinutesBefore ?? '30 minutes before', value: '30' },
    { label: labels.oneHourBefore ?? '1 hour before', value: '60' },
    { label: labels.oneDayBefore ?? '1 day before', value: '1440' },
  ]
}
