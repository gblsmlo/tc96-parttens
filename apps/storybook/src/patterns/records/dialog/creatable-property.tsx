import { PropertySurface } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxTrigger,
  useComboboxFilter,
} from '@tc96/ui/combobox'
import { type LucideIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'

export interface CreatablePropertyLabels {
  create: (draft: string) => string
  createEmpty: string
  empty: string
  list: string
  search: string
  searchPlaceholder: string
}

const isSameItem = (a: string, b: string) =>
  a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }) === 0

export function CreatableProperty({
  ariaLabel,
  icon: Icon,
  items,
  labels,
  onCreate,
  onValueChange,
  value,
}: Readonly<{
  ariaLabel: string
  icon: LucideIcon
  items: readonly string[]
  labels: CreatablePropertyLabels
  onCreate: (item: string) => void
  onValueChange: (item: string | null) => void
  value: string | null
}>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const filter = useComboboxFilter({ sensitivity: 'base' })
  const draft = query.trim()
  const canCreate =
    draft !== '' && !items.some((item) => isSameItem(item, draft))
  const hasMatch = items.some((item) => filter.contains(item, query))

  const create = () => {
    if (!canCreate) return
    onCreate(draft)
    setOpen(false)
    setQuery('')
  }

  return (
    <Combobox
      autoHighlight
      filter={filter.contains}
      inputValue={query}
      items={items}
      onInputValueChange={setQuery}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery('')
      }}
      onValueChange={onValueChange}
      open={open}
      value={value}
    >
      <ComboboxTrigger
        aria-label={value ? `${ariaLabel}: ${value}` : ariaLabel}
        render={
          <PropertySurface muted={!value} render={<button type="button" />} />
        }
      >
        <Icon aria-hidden className="size-3.5" />
        <span className="truncate">{value ?? ariaLabel}</span>
      </ComboboxTrigger>
      <ComboboxPopup aria-label={ariaLabel} className="w-64">
        <ComboboxInput
          aria-label={labels.search}
          className="border-transparent! bg-transparent! shadow-none before:hidden has-focus-visible:ring-0"
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || hasMatch || !canCreate) return
            event.preventDefault()
            create()
          }}
          placeholder={labels.searchPlaceholder}
          showTrigger={false}
          startAddon={<SearchIcon />}
        />
        <ComboboxSeparator className="mx-0 my-0" />
        <ComboboxEmpty>{labels.empty}</ComboboxEmpty>
        <ComboboxList aria-label={labels.list}>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxSeparator className="mx-0 my-0" />
        <div className="p-1">
          <Button
            className="w-full justify-start"
            disabled={!canCreate}
            onClick={create}
            size="sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon aria-hidden />
            <span className="truncate">
              {canCreate ? labels.create(draft) : labels.createEmpty}
            </span>
          </Button>
        </div>
      </ComboboxPopup>
    </Combobox>
  )
}
