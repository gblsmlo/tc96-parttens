import type {
  RecordDialog1Person,
  RecordDialog1Slot,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-1'

export const recordDialog1People: readonly RecordDialog1Person[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
  { fallback: 'CM', label: 'Carla Mendes', value: 'carla' },
]

export const recordDialog1Slot: RecordDialog1Slot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '10:00',
  start: '09:00',
}
