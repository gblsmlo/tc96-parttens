export const comboboxSizeNames = ['sm', 'default', 'lg'] as const

export type ComboboxSizeName = (typeof comboboxSizeNames)[number]

export interface ComboboxOption {
  label: string
  value: string
}

export const comboboxOptions: ComboboxOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape', value: 'grape' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
]

export interface ComboboxOptionGroup {
  items: ComboboxOption[]
  value: string
}

export const comboboxOptionGroups: ComboboxOptionGroup[] = [
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
