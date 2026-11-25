import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Documents1,
  type Documents1Mode,
  type Documents1Record,
  type Documents1Sort,
  type Documents1Type,
  type Documents1View,
} from '@tc96/ui/blocks/data/documents/documents-1'
import { useEffect, useState } from 'react'
import { expect, fireEvent, waitFor, within } from 'storybook/test'
import { apiUrl, fetchJson } from '../../../../mocks/api.ts'
import {
  type Documents1UploadBody,
  documents1Handlers,
} from '../../../../mocks/documents-1.ts'
import {
  type Documents1Page,
  pageSize,
  people,
  typeColors,
} from '../fixtures/documents-1.ts'
import { uploadingRecord } from './documents-1-layouts.tsx'

const sendUpload = async (record: Documents1Record) => {
  const body: Documents1UploadBody = {
    contentType: record.kind === 'file' ? record.contentType : '',
    name: record.name,
    size: record.kind === 'file' ? (record.size ?? '') : '',
  }
  const response = await fetch(apiUrl('/data/documents/uploads'), {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.message)
  return payload as Documents1Record
}

const useUploads = () => {
  const [uploads, setUploads] = useState<Documents1Record[]>([])
  const replace = (id: string, next: Documents1Record | null) =>
    setUploads((current) =>
      next
        ? current.map((item) => (item.id === id ? next : item))
        : current.filter((item) => item.id !== id),
    )
  const upload = useMutation({
    mutationFn: sendUpload,
    onError: (error, record) =>
      replace(record.id, {
        ...record,
        upload: { error: error.message, status: 'failed' },
      } as Documents1Record),
    onSuccess: (saved, record) => replace(record.id, saved),
  })
  const uploading = uploads.some(
    (item) => item.kind === 'file' && item.upload?.status === 'uploading',
  )

  useEffect(() => {
    if (!uploading) return
    const timer = window.setInterval(
      () =>
        setUploads((current) =>
          current.map((item) =>
            item.kind === 'file' && item.upload?.status === 'uploading'
              ? {
                  ...item,
                  upload: {
                    progress: Math.min(90, item.upload.progress + 15),
                    status: 'uploading',
                  },
                }
              : item,
          ),
        ),
      150,
    )
    return () => window.clearInterval(timer)
  }, [uploading])

  return {
    remove: (id: string) => replace(id, null),
    start: (files: File[]) => {
      const records = files.map(uploadingRecord)
      setUploads((current) => [...records, ...current])
      for (const record of records) upload.mutate(record)
    },
    uploads,
  }
}

const DocumentsLibrary = () => {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Documents1Mode>('table')
  const [view, setView] = useState<Documents1View>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<Documents1Sort | null>(null)
  const [typeFilter, setTypeFilter] = useState<Documents1Type[]>([])
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({
    limit: String(pageSize),
    page: String(page),
    view,
  })
  if (search) params.set('q', search)
  if (sort) params.set('sort', sort)
  for (const type of typeFilter) params.append('type', type)
  const queryKey = ['data', 'documents', 'library', params.toString()]

  const { data, isError, isPending, refetch } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () =>
      fetchJson<Documents1Page>(`/data/documents/library?${params}`),
    queryKey,
  })
  const files = useUploads()
  const update = (id: string, change: Partial<Documents1Record>) =>
    queryClient.setQueryData<Documents1Page>(queryKey, (current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item.id === id
                ? ({ ...item, ...change } as Documents1Record)
                : item,
            ),
          }
        : current,
    )
  const firstPage = () => setPage(1)

  return (
    <Documents1
      counts={data?.counts}
      error={isError}
      filtered={Boolean(search || typeFilter.length)}
      mode={mode}
      onDelete={(id) => {
        files.remove(id)
        queryClient.setQueryData<Documents1Page>(queryKey, (current) =>
          current
            ? {
                ...current,
                items: current.items.filter((item) => item.id !== id),
              }
            : current,
        )
      }}
      onModeChange={setMode}
      onPageChange={setPage}
      onPinnedChange={(id, pinned) => update(id, { pinned })}
      onRetry={() => refetch()}
      onSearchChange={(next) => {
        setSearch(next)
        firstPage()
      }}
      onSortChange={setSort}
      onTypeFilterChange={(next) => {
        setTypeFilter(next)
        firstPage()
      }}
      onUpload={files.start}
      onViewChange={(next) => {
        setView(next)
        firstPage()
      }}
      page={page}
      pageCount={Math.max(1, Math.ceil((data?.total ?? 0) / pageSize))}
      pageSize={pageSize}
      pending={isPending}
      people={people}
      records={[...files.uploads, ...(data?.items ?? [])]}
      search={search}
      sort={sort}
      total={data?.total}
      typeColors={typeColors}
      typeFilter={typeFilter}
      view={view}
    />
  )
}

const meta = {
  component: DocumentsLibrary,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Data/Documents/Documents1/Usages',
} satisfies Meta<typeof DocumentsLibrary>

export default meta

type Story = StoryObj<typeof meta>

const pickFile = (canvasElement: HTMLElement, name: string) => {
  const input = canvasElement.querySelector<HTMLInputElement>(
    '[data-slot="documents-1-upload-input"]',
  ) as HTMLInputElement
  const data = new DataTransfer()
  data.items.add(new File(['conteúdo'], name, { type: 'application/pdf' }))
  input.files = data.files
  fireEvent.change(input)
}

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(documents1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Contrato de fornecimento assinado.pdf'),
    ).toBeVisible()
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(documents1Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Nenhuma nota, documento ou mídia por aqui.',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(documents1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByLabelText('Carregando documentos'),
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(documents1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível listar os documentos',
      ),
    ).toBeVisible()
  },
}

export const UploadSucceeds: Story = {
  beforeEach: ({ msw }) => {
    msw.use(documents1Handlers.loaded, documents1Handlers.uploadSucceeds)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Contrato de fornecimento assinado.pdf')
    pickFile(canvasElement, 'Parecer técnico.pdf')
    await expect(
      await canvas.findByRole('progressbar', {
        name: 'Envio de Parecer técnico.pdf',
      }),
    ).toBeVisible()
    await waitFor(
      () =>
        expect(
          canvas.queryByRole('progressbar', {
            name: 'Envio de Parecer técnico.pdf',
          }),
        ).toBeNull(),
      { timeout: 3000 },
    )
    await expect(canvas.getByText('Parecer técnico.pdf')).toBeVisible()
  },
}

export const UploadFails: Story = {
  beforeEach: ({ msw }) => {
    msw.use(documents1Handlers.loaded, documents1Handlers.uploadFails)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Contrato de fornecimento assinado.pdf')
    pickFile(canvasElement, 'Vídeo da audiência.pdf')
    await expect(
      await canvas.findByText(
        'O arquivo não cabe no seu espaço de armazenamento.',
        undefined,
        { timeout: 3000 },
      ),
    ).toBeVisible()
    await expect(
      canvas.getByRole('img', { name: 'O arquivo não foi enviado' }),
    ).toBeVisible()
  },
}
