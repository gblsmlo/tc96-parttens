import type {
  Agenda1Person,
  Agenda1Slot,
} from '@tc96/ui/blocks/application/record-dialog/agenda-1'

export const agenda1People: readonly Agenda1Person[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
  { fallback: 'CM', label: 'Carla Mendes', value: 'carla' },
]

export const agenda1Slot: Agenda1Slot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '10:00',
  start: '09:00',
}
