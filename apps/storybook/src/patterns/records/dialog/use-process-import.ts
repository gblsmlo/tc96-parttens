import { useCallback, useRef, useState } from 'react'
import { delay } from './delay'
import {
  emptyFields,
  type ImportedData,
  type ImportSource,
  type ImportStatus,
  importSources,
  normalizeSource,
  type ProcessField,
  type ProcessFields,
  type ProcessParty,
  type ProcessPole,
  processTitle,
} from './process-record'

export interface ImportSimulation {
  failOnce: readonly ImportSource[]
  latency: number
}

const latencyWeight: Record<ImportSource, number> = {
  court: 1,
  datajud: 0.6,
  djen: 1.4,
}

const idleStatus: Record<ImportSource, ImportStatus | 'idle'> = {
  court: 'idle',
  datajud: 'idle',
  djen: 'idle',
}

export type ImportStatusMap = Record<ImportSource, ImportStatus | 'idle'>

export type ImportedBySource = Partial<Record<ImportSource, ImportedData>>

export function useProcessImport({ failOnce, latency }: ImportSimulation) {
  const [status, setStatus] = useState<ImportStatusMap>(idleStatus)
  const [data, setData] = useState<ImportedBySource>({})
  const attempts = useRef(new Map<ImportSource, number>())
  const generation = useRef(0)

  const retry = useCallback(
    async (source: ImportSource) => {
      const runGeneration = generation.current
      const attempt = (attempts.current.get(source) ?? 0) + 1
      attempts.current.set(source, attempt)
      setStatus((current) => ({ ...current, [source]: 'loading' }))
      await delay(latency * latencyWeight[source])
      if (runGeneration !== generation.current) return
      if (attempt === 1 && failOnce.includes(source)) {
        setStatus((current) => ({ ...current, [source]: 'error' }))
        return
      }
      setData((current) => ({ ...current, [source]: normalizeSource(source) }))
      setStatus((current) => ({ ...current, [source]: 'success' }))
    },
    [failOnce, latency],
  )

  const reset = useCallback(() => {
    generation.current += 1
    attempts.current.clear()
    setStatus(idleStatus)
    setData({})
  }, [])

  const start = useCallback(() => {
    reset()
    for (const source of importSources) void retry(source)
  }, [reset, retry])

  const pending = importSources.filter((source) => status[source] === 'loading')

  const failed = importSources.filter((source) => status[source] === 'error')

  return { data, failed, pending, reset, retry, start, status }
}

const fieldKeys = Object.keys(emptyFields) as ProcessField[]

export function useProcessDraft(data: ImportedBySource) {
  const [edits, setEdits] = useState<Partial<ProcessFields>>({})
  const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set())
  const [kept, setKept] = useState<ReadonlySet<string>>(new Set())
  const [poles, setPoles] = useState<Record<string, ProcessPole>>({})
  const [titleEdit, setTitleEdit] = useState<string | null>(null)

  const imported: Partial<ProcessFields> = {
    ...data.datajud?.fields,
    ...data.court?.fields,
  }
  const fields = Object.fromEntries(
    fieldKeys.map((field) => [
      field,
      Object.hasOwn(edits, field)
        ? edits[field]
        : (imported[field] ?? emptyFields[field]),
    ]),
  ) as unknown as ProcessFields
  const parties: ProcessParty[] = (data.djen?.parties ?? [])
    .filter((party) => !removed.has(party.id))
    .map((party) => ({
      ...party,
      pole: poles[party.id] ?? party.pole,
      suspectedLawyer: party.suspectedLawyer && !kept.has(party.id),
    }))
  const lawyers = data.djen?.lawyers ?? []

  return {
    fields,
    keepParty: (id: string) => setKept((current) => new Set([...current, id])),
    isEdited: (field: ProcessField) =>
      Object.hasOwn(edits, field) &&
      imported[field] !== undefined &&
      edits[field] !== imported[field],
    lawyers,
    moveSuspectedLawyers: () =>
      setRemoved(
        (current) =>
          new Set([
            ...current,
            ...parties
              .filter((party) => party.suspectedLawyer)
              .map((party) => party.id),
          ]),
      ),
    parties,
    removeParty: (id: string) =>
      setRemoved((current) => new Set([...current, id])),
    reset: () => {
      setEdits({})
      setRemoved(new Set())
      setKept(new Set())
      setPoles({})
      setTitleEdit(null)
    },
    restoreField: (field: ProcessField) =>
      setEdits(({ [field]: _restored, ...rest }) => rest),
    setField: (field: ProcessField, value: string | null) =>
      setEdits((current) => ({ ...current, [field]: value })),
    setPole: (id: string, pole: ProcessPole) =>
      setPoles((current) => ({ ...current, [id]: pole })),
    setTitle: setTitleEdit,
    title: titleEdit ?? processTitle({ className: fields.className, parties }),
  }
}

export type ProcessDraftState = ReturnType<typeof useProcessDraft>
