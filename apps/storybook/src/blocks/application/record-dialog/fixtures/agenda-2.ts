import type {
  Agenda2Person,
  Agenda2Slot,
} from '@tc96/ui/blocks/application/record-dialog/agenda-2'

export const agenda2People: readonly Agenda2Person[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
  { fallback: 'CM', label: 'Carla Mendes', value: 'carla' },
]

export const agenda2Slot: Agenda2Slot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '10:00',
  start: '09:00',
}
