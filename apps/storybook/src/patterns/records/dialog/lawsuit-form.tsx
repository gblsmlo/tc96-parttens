import { Badge } from '@tc96/ui/badge'
import {
  PersonProperty,
  RecordGroup,
  RecordGroupRow,
  type RecordStatus,
  SelectProperty,
  TextProperty,
  useRecordDraft,
} from '@tc96/ui/patterns'
import { Skeleton } from '@tc96/ui/skeleton'
import { Switch } from '@tc96/ui/switch'
import { type ReactNode, useEffect, useState } from 'react'
import {
  initialLawsuitValues,
  LAWSUIT_NUMBER_DIGITS,
  type LawsuitField,
  type LawsuitLookup,
  type LawsuitSource,
  type LawsuitSourceId,
  type LawsuitValues,
  lawsuitClients,
  lawsuitDigits,
  lawsuitFieldLabels,
  lawsuitInstanceOptions,
  lawsuitOwners,
  lawsuitParties,
  lawsuitPhaseOptions,
  lawsuitSourceNames,
  lawsuitSourceOf,
  lawsuitSourceResults,
} from './lawsuit-record'

export const LAWSUIT_SOURCE_IDS: readonly LawsuitSourceId[] = [
  'djen',
  'datajud',
  'court',
]

const FIELDS: readonly LawsuitField[] = [
  'action',
  'subject',
  'court',
  'venue',
  'division',
]

const sourcesWith = (status: RecordStatus) =>
  Object.fromEntries(
    LAWSUIT_SOURCE_IDS.map((id) => [id, { elapsed: 0, id, status }]),
  ) as Record<LawsuitSourceId, LawsuitSource>

function useLawsuitLookup(lookup: LawsuitLookup) {
  const [run, setRun] = useState({ count: 0, retried: false })
  const [sources, setSources] = useState(() => sourcesWith('pending'))

  useEffect(() => {
    if (run.count === 0) return
    setSources(sourcesWith('running'))
    const settle = (id: LawsuitSourceId, status: RecordStatus) =>
      setSources((current) => ({
        ...current,
        [id]: { ...current[id], status },
      }))
    const timers = [
      setTimeout(() => settle('court', 'skipped'), 400),
      setTimeout(() => settle('djen', 'done'), 800),
    ]
    if (lookup !== 'slow' || run.retried)
      timers.push(
        setTimeout(
          () =>
            settle(
              'datajud',
              lookup === 'failing' && !run.retried ? 'failed' : 'done',
            ),
          1600,
        ),
      )
    const tick = setInterval(
      () =>
        setSources((current) => {
          const next = { ...current }
          for (const id of LAWSUIT_SOURCE_IDS)
            if (next[id].status === 'running')
              next[id] = { ...next[id], elapsed: next[id].elapsed + 1 }
          return next
        }),
      1000,
    )
    return () => {
      for (const timer of timers) clearTimeout(timer)
      clearInterval(tick)
    }
  }, [lookup, run])

  return {
    reset: () => {
      setRun({ count: 0, retried: false })
      setSources(sourcesWith('pending'))
    },
    retry: () =>
      setRun((current) => ({ count: current.count + 1, retried: true })),
    sources,
    start: () =>
      setRun((current) => ({ count: current.count + 1, retried: false })),
  }
}

const SOURCE_COPY: Record<
  LawsuitSourceId,
  { done: string; running: string; skipped: string }
> = {
  court: {
    done: 'foro',
    running: 'buscando foro',
    skipped: 'sem consulta direta para o TJSP',
  },
  datajud: {
    done: 'ação e objeto',
    running: 'buscando ação e objeto',
    skipped: 'sem consulta',
  },
  djen: {
    done: '2 partes, tribunal e vara',
    running: 'buscando partes, tribunal e vara',
    skipped: 'sem consulta',
  },
}

function sourceDetail({ elapsed, id, status }: LawsuitSource) {
  if (status === 'failed') return 'não respondeu'
  if (status === 'done') return SOURCE_COPY[id].done
  if (status === 'skipped') return SOURCE_COPY[id].skipped
  if (elapsed < 10) return SOURCE_COPY[id].running
  const shown = Math.floor(elapsed / 10) * 10
  return `${SOURCE_COPY[id].running} · há ${shown} s · pode levar até 2 min`
}

function sourceAnnouncement({ id, status }: LawsuitSource) {
  const name = lawsuitSourceNames[id]
  if (status === 'done') return `${name} respondeu: ${SOURCE_COPY[id].done}`
  if (status === 'failed') return `${name} não respondeu`
  return undefined
}

export type LawsuitNumberState = 'incomplete' | 'checking' | 'free' | 'taken'

export const lawsuitNumberHints: Record<
  LawsuitNumberState,
  string | undefined
> = {
  checking: 'Conferindo o número…',
  free: undefined,
  incomplete: `Digite os ${LAWSUIT_NUMBER_DIGITS} dígitos.`,
  taken: 'Este número já está cadastrado.',
}

export function useLawsuitForm(lookup: LawsuitLookup) {
  const [manual, setManual] = useState(false)
  const [creating, setCreating] = useState(false)
  const [checkedNumber, setCheckedNumber] = useState<string | null>(null)
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set())
  const { latest, reset, update, draft } = useRecordDraft(initialLawsuitValues)
  const search = useLawsuitLookup(lookup)
  const { sources } = search

  const complete = lawsuitDigits(draft.number) === LAWSUIT_NUMBER_DIGITS

  useEffect(() => {
    if (!complete || checkedNumber === draft.number) return
    const timer = setTimeout(() => setCheckedNumber(draft.number), 500)
    return () => clearTimeout(timer)
  }, [checkedNumber, complete, draft.number])

  const numberState: LawsuitNumberState = !complete
    ? 'incomplete'
    : checkedNumber !== draft.number
      ? 'checking'
      : lookup === 'duplicate'
        ? 'taken'
        : 'free'

  const touch = (key: string) =>
    setTouched((current) => new Set(current).add(key))

  const sourced = (field: LawsuitField) => {
    if (manual || touched.has(field)) return null
    const id = lawsuitSourceOf[field]
    if (sources[id].status !== 'done') return null
    const value = lawsuitSourceResults[id][field]
    return value ? { from: lawsuitSourceNames[id], value } : null
  }

  const partiesReady = !manual && sources.djen.status === 'done'
  const suggestedTitle = lawsuitParties.map((party) => party.name).join(' × ')
  const title = touched.has('title')
    ? draft.title
    : draft.title || (partiesReady ? suggestedTitle : '')
  const clientId =
    draft.clientId ?? (!touched.has('clientId') && partiesReady ? 'ada' : null)

  return {
    begin: (withLookup: boolean) => {
      setManual(!withLookup)
      if (withLookup) search.start()
      else search.reset()
    },
    clientId,
    creating,
    draft,
    manual,
    numberState,
    partiesReady,
    reset: () => {
      setManual(false)
      setCheckedNumber(null)
      setTouched(new Set())
      reset()
      search.reset()
    },
    resolved: (): LawsuitValues => {
      const values = { ...latest.current }
      for (const field of FIELDS)
        values[field] ??= sourced(field)?.value ?? null
      if (!touched.has('clientId') && partiesReady) values.clientId ??= 'ada'
      if (!touched.has('title') && partiesReady && values.title === '')
        values.title = suggestedTitle
      return values
    },
    retry: search.retry,
    searching: LAWSUIT_SOURCE_IDS.some(
      (id) => sources[id].status === 'running',
    ),
    setCreating,
    setTitle: (next: string) => {
      touch('title')
      update({ title: next })
    },
    sourceRows: LAWSUIT_SOURCE_IDS.map((id) => ({
      announcement: sourceAnnouncement(sources[id]),
      detail: sourceDetail(sources[id]),
      id,
      status: sources[id].status,
      title: lawsuitSourceNames[id],
    })),
    sourced,
    sources,
    title,
    touch,
    update,
  }
}

export type LawsuitForm = ReturnType<typeof useLawsuitForm>

function SourceBadge({ children }: Readonly<{ children: ReactNode }>) {
  return <Badge variant="outline">{children}</Badge>
}

export function LawsuitOffice({
  form,
  monitor,
}: Readonly<{ form: LawsuitForm; monitor: boolean }>) {
  const { creating, draft, update } = form

  return (
    <RecordGroup collapsible={false} title="Escritório">
      <RecordGroupRow label="Responsável">
        <PersonProperty
          ariaLabel="Responsável"
          onValueChange={(ownerId) => update({ ownerId })}
          options={lawsuitOwners}
          readOnly={creating}
          value={draft.ownerId}
        />
      </RecordGroupRow>
      <RecordGroupRow label="Fase">
        <SelectProperty
          ariaLabel="Fase"
          onValueChange={(phase) => update({ phase: phase ?? 'initial' })}
          options={lawsuitPhaseOptions}
          value={draft.phase}
        />
      </RecordGroupRow>
      {monitor ? (
        <RecordGroupRow label="Monitoramento">
          <Switch
            aria-label="Monitoramento no tribunal"
            checked={draft.monitor}
            disabled={creating}
            onCheckedChange={(next) => update({ monitor: next })}
          />
        </RecordGroupRow>
      ) : null}
    </RecordGroup>
  )
}

export function LawsuitFields({ form }: Readonly<{ form: LawsuitForm }>) {
  const {
    clientId,
    creating,
    draft,
    manual,
    partiesReady,
    sourced,
    sources,
    touch,
    update,
  } = form

  const fieldRow = (field: LawsuitField) => {
    const { fallback, label } = lawsuitFieldLabels[field]
    const source = sourced(field)
    const value = draft[field] ?? source?.value ?? null
    const sourceId = lawsuitSourceOf[field]
    const waiting =
      !manual && value === null && sources[sourceId].status === 'running'
    return (
      <RecordGroupRow key={field} label={label}>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <TextProperty
            ariaLabel={label}
            disabled={creating}
            editing="inline"
            fallback={fallback}
            onCommit={(next) => {
              touch(field)
              update({ [field]: next } as Partial<LawsuitValues>)
            }}
            value={value}
            variant="plain"
          />
          {source && draft[field] === null ? (
            <SourceBadge>{source.from}</SourceBadge>
          ) : null}
          {waiting ? (
            <span className="ms-auto text-muted-foreground text-xs">
              aguardando {lawsuitSourceNames[sourceId]}
            </span>
          ) : null}
        </span>
      </RecordGroupRow>
    )
  }

  return (
    <>
      <RecordGroup collapsible={false} title="Processo">
        <RecordGroupRow label="Número">
          {manual ? (
            <TextProperty
              ariaLabel="Número"
              disabled={creating}
              editing="inline"
              fallback="Adicionar número"
              onCommit={(number) => update({ number: number ?? '' })}
              value={draft.number || null}
              variant="plain"
            />
          ) : (
            <span className="text-sm tabular-nums">{draft.number}</span>
          )}
        </RecordGroupRow>
        {FIELDS.map(fieldRow)}
        <RecordGroupRow label="Instância">
          <SelectProperty
            ariaLabel="Instância"
            onValueChange={(instance) =>
              update({ instance: instance ?? 'first' })
            }
            options={lawsuitInstanceOptions}
            value={draft.instance}
          />
        </RecordGroupRow>
      </RecordGroup>
      <RecordGroup collapsible={false} title="Partes">
        <RecordGroupRow label="Cliente">
          <PersonProperty
            ariaLabel="Cliente"
            onValueChange={(next) => {
              touch('clientId')
              update({ clientId: next })
            }}
            options={lawsuitClients}
            placeholder="Escolher contato"
            readOnly={creating}
            value={clientId}
          />
        </RecordGroupRow>
        {manual
          ? null
          : partiesReady
            ? lawsuitParties.map((party) => (
                <RecordGroupRow key={party.name} label={party.pole}>
                  <span className="flex items-center gap-2 text-sm">
                    {party.name}
                    <SourceBadge>DJEN</SourceBadge>
                  </span>
                </RecordGroupRow>
              ))
            : lawsuitParties.map((party) => (
                <div
                  aria-hidden="true"
                  className="flex items-center gap-3 py-2"
                  key={party.name}
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-44" />
                </div>
              ))}
      </RecordGroup>
      <LawsuitOffice form={form} monitor />
    </>
  )
}
