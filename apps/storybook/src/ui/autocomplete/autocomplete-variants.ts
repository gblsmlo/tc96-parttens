export const autocompleteSizeNames = ['sm', 'default', 'lg'] as const

export type AutocompleteSizeName = (typeof autocompleteSizeNames)[number]

export const triggerLabel = 'Show suggestions'

export const clearLabel = 'Clear text'

export const moreResultsText = (count: number) =>
  `${count} more, keep typing to narrow the list`

export interface AutocompleteOption {
  label: string
  value: string
}

export const autocompleteOptions: AutocompleteOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
]

export interface AutocompleteOptionGroup {
  items: AutocompleteOption[]
  value: string
}

export const autocompleteOptionGroups: AutocompleteOptionGroup[] = [
  {
    items: [
      { label: 'Apple', value: 'apple' },
      { label: 'Pear', value: 'pear' },
    ],
    value: 'Pome fruits',
  },
  {
    items: [
      { label: 'Cherry', value: 'cherry' },
      { label: 'Peach', value: 'peach' },
    ],
    value: 'Stone fruits',
  },
  {
    items: [
      { label: 'Banana', value: 'banana' },
      { label: 'Mango', value: 'mango' },
    ],
    value: 'Tropical fruits',
  },
]
