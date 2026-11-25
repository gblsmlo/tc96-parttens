import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiUrl, fetchJson } from '../../../mocks/api.ts'
import type { LegalSavedViewRecord } from './fixtures/saved-views.ts'

export interface LegalSavedViewCallbacks {
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string | null) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
}

export interface LegalSavedViewProps extends LegalSavedViewCallbacks {
  savedViewId: string | null
  savedViewModified: boolean
  savedViews: LegalSavedViewRecord<unknown>[] | undefined
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
}

interface LegalSavedViewsOptions<TConfig> {
  apply: (config: TConfig) => void
  config: TConfig
  reset?: () => void
}

const sameConfig = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b)

export function useLocalSavedViews<TConfig>(
  initial: readonly LegalSavedViewRecord<TConfig>[],
  { apply, config, reset }: LegalSavedViewsOptions<TConfig>,
  callbacks: LegalSavedViewCallbacks = {},
) {
  const [views, setViews] = useState<LegalSavedViewRecord<TConfig>[]>([
    ...initial,
  ])
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const [created, setCreated] = useState(0)
  const active = views.find((view) => view.id === savedViewId)

  const add = (label: string, viewConfig: TConfig) => {
    const id = `local-view-${created + 1}`
    setCreated(created + 1)
    setViews((current) => [...current, { config: viewConfig, id, label }])
    setSavedViewId(id)
  }

  const props: LegalSavedViewProps = {
    onSavedViewCreate: () => {
      add(`Minha visão ${created + 1}`, config)
      callbacks.onSavedViewCreate?.()
    },
    onSavedViewDelete: (id) => {
      setViews((current) => current.filter((view) => view.id !== id))
      if (id === savedViewId) setSavedViewId(null)
      callbacks.onSavedViewDelete?.(id)
    },
    onSavedViewDuplicate: (id) => {
      const view = views.find((item) => item.id === id)
      if (view) add(`${view.label} (cópia)`, view.config)
      callbacks.onSavedViewDuplicate?.(id)
    },
    onSavedViewRename: (id) => callbacks.onSavedViewRename?.(id),
    onSavedViewSelect: (id) => {
      const view = views.find((item) => item.id === id)
      setSavedViewId(view ? view.id : null)
      if (view) apply(view.config)
      else reset?.()
      callbacks.onSavedViewSelect?.(id)
    },
    onSavedViewUpdate: () => {
      setViews((current) =>
        current.map((view) =>
          view.id === savedViewId ? { ...view, config } : view,
        ),
      )
      callbacks.onSavedViewUpdate?.()
    },
    onSavePreference: () => {
      add(`Minha visão ${created + 1}`, config)
      callbacks.onSavePreference?.()
    },
    savedViewId,
    savedViewModified: Boolean(active && !sameConfig(active.config, config)),
    savedViews: views,
  }

  return { clear: () => setSavedViewId(null), props }
}

const send = async <T>(path: string, method: string, body?: unknown) => {
  const response = await fetch(apiUrl(path), {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method,
  })
  if (!response.ok) throw new Error(`${response.status} ${path}`)
  return (response.status === 204 ? undefined : response.json()) as Promise<T>
}

export function useSavedViewsQuery<TConfig>(
  collection: string,
  { apply, config, reset }: LegalSavedViewsOptions<TConfig>,
  enabled = true,
) {
  const queryClient = useQueryClient()
  const path = `/data/legal/saved-views/${collection}`
  const queryKey = ['data', 'legal', 'saved-views', collection]
  const [savedViewId, setSavedViewId] = useState<string | null>(null)
  const list = useQuery({
    enabled,
    queryFn: () => fetchJson<LegalSavedViewRecord<TConfig>[]>(path),
    queryKey,
  })
  const create = useMutation({
    mutationFn: (view: Omit<LegalSavedViewRecord<TConfig>, 'id'>) =>
      send<LegalSavedViewRecord<TConfig>>(path, 'POST', view),
    onSuccess: async (view) => {
      await queryClient.invalidateQueries({ queryKey })
      setSavedViewId(view.id)
    },
  })
  const update = useMutation({
    mutationFn: (view: LegalSavedViewRecord<TConfig>) =>
      send<LegalSavedViewRecord<TConfig>>(`${path}/${view.id}`, 'PUT', view),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
  const remove = useMutation({
    mutationFn: (id: string) => send<undefined>(`${path}/${id}`, 'DELETE'),
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey })
      setSavedViewId((current) => (current === id ? null : current))
    },
  })
  const views = list.data ?? []
  const active = views.find((view) => view.id === savedViewId)
  const createCurrent = () =>
    create.mutate({ config, label: `Minha visão ${views.length + 1}` })

  const props: LegalSavedViewProps = {
    onSavedViewCreate: createCurrent,
    onSavedViewDelete: (id) => remove.mutate(id),
    onSavedViewDuplicate: (id) => {
      const view = views.find((item) => item.id === id)
      if (view)
        create.mutate({ config: view.config, label: `${view.label} (cópia)` })
    },
    onSavedViewSelect: (id) => {
      const view = views.find((item) => item.id === id)
      setSavedViewId(view ? view.id : null)
      if (view) apply(view.config)
      else reset?.()
    },
    onSavedViewUpdate: () => {
      if (active) update.mutate({ ...active, config })
    },
    onSavePreference: createCurrent,
    savedViewId,
    savedViewModified: Boolean(active && !sameConfig(active.config, config)),
    savedViews: list.data,
    savedViewsLoading: list.isPending,
    savedViewsPending: create.isPending || update.isPending || remove.isPending,
  }

  return { clear: () => setSavedViewId(null), props }
}
