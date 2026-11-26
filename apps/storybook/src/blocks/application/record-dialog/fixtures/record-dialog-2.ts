import type {
  RecordDialog2Person,
  RecordDialog2Slot,
} from '@tc96/ui/blocks/application/record-dialog/record-dialog-2'

export const recordDialog2People: readonly RecordDialog2Person[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
  { fallback: 'CM', label: 'Carla Mendes', value: 'carla' },
]

export const recordDialog2Slot: RecordDialog2Slot = {
  date: '2026-10-14T12:00:00.000Z',
  end: '10:00',
  start: '09:00',
}
