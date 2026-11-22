export interface CommandEntry {
  label: string
  shortcut?: string
  value: string
}

export interface CommandEntryGroup {
  items: CommandEntry[]
  value: string
}

export const commandGroups: CommandEntryGroup[] = [
  {
    items: [
      { label: 'Calendar', value: 'calendar' },
      { label: 'Search emoji', value: 'search-emoji' },
      { label: 'Calculator', value: 'calculator' },
    ],
    value: 'Suggestions',
  },
  {
    items: [
      { label: 'Profile', shortcut: '⌘P', value: 'profile' },
      { label: 'Billing', shortcut: '⌘B', value: 'billing' },
      { label: 'Keyboard shortcuts', shortcut: '⌘/', value: 'shortcuts' },
    ],
    value: 'Settings',
  },
]

export const commandEntries: CommandEntry[] = commandGroups.flatMap(
  (group) => group.items,
)

export const disabledCommandValue = 'billing'
