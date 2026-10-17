import { useState } from 'react'
import type { EntryParser } from '../shared/lib/entry-parser'
import { diffValues } from '../shared/lib/property-options'

export interface EntryListChange {
  added: string | null
  previousValue: readonly string[]
  removed: string | null
}

export interface UseEntryListEditorOptions {
  duplicateMessage: string
  limit: number
  onCommit: (next: readonly string[], change: EntryListChange) => void
  parse: EntryParser
  value: readonly string[]
}

export function useEntryListEditor({
  duplicateMessage,
  limit,
  onCommit,
  parse,
  value,
}: UseEntryListEditorOptions) {
  const [open, setOpen] = useState(false)
  const [drafts, setDrafts] = useState<readonly string[]>([])
  const [errors, setErrors] = useState<readonly (string | null)[]>([])

  const onOpenChange = (next: boolean) => {
    if (next) {
      setDrafts(value.length > 0 ? [...value] : [''])
      setErrors([])
    }
    setOpen(next)
  }

  const setDraft = (index: number, next: string) => {
    setDrafts((current) =>
      current.map((draft, at) => (at === index ? next : draft)),
    )
    setErrors((current) =>
      current.map((error, at) => (at === index ? null : error)),
    )
  }

  const removeDraft = (index: number) => {
    setDrafts((current) => current.filter((_, at) => at !== index))
    setErrors((current) => current.filter((_, at) => at !== index))
  }

  const addDraft = () => setDrafts((current) => [...current, ''])

  const canAddAnother =
    drafts.length < limit &&
    drafts.every((draft) => parse(draft.trim()).success)

  const save = () => {
    const nextErrors: (string | null)[] = []
    const saved: string[] = []

    for (const draft of drafts) {
      const raw = draft.trim()
      if (!raw) {
        nextErrors.push(null)
        continue
      }

      const parsed = parse(raw)
      if (!parsed.success) {
        nextErrors.push(parsed.message)
        continue
      }
      if (saved.includes(parsed.value)) {
        nextErrors.push(duplicateMessage)
        continue
      }

      nextErrors.push(null)
      saved.push(parsed.value)
    }

    setErrors(nextErrors)
    if (nextErrors.some(Boolean)) return

    onCommit(saved, { ...diffValues(value, saved), previousValue: value })
    setOpen(false)
  }

  return {
    addDraft,
    canAddAnother,
    drafts,
    errors,
    onOpenChange,
    open,
    removeDraft,
    save,
    setDraft,
  }
}
