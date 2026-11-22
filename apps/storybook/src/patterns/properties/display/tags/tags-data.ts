import type { TagsPropertyOption } from '@tc96/parttens'

export const tagOptions: TagsPropertyOption[] = [
  { label: 'Documentos', value: 'documents' },
  { label: 'Retorno', value: 'return' },
  { label: 'Urgente', value: 'urgent' },
  { label: 'Contrato', value: 'contract' },
]

export const tagOptionLabels = Object.fromEntries(
  tagOptions.map((option) => [option.value, option.label]),
)

export const placementOptions: TagsPropertyOption[] = [
  { label: 'Feed do Instagram', value: 'instagram-feed' },
  { label: 'Stories do Instagram', value: 'instagram-stories' },
  { label: 'Feed do Facebook', value: 'facebook-feed' },
  { label: 'Rede de display', value: 'display' },
]

export const placementsCountLabel = (count: number) =>
  `${count} ${count === 1 ? 'posicionamento' : 'posicionamentos'}`
