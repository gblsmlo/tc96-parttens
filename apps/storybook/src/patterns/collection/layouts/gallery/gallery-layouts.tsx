import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import { CollectionPagination, GalleryView } from '@tc96/ui/patterns'
import { Separator } from '@tc96/ui/separator'
import { Text } from '@tc96/ui/text'
import { useEffect, useState } from 'react'
import { sleep } from '../../../../test-utils/sleep'
import {
  type DocumentActions,
  renderDocumentCard,
} from '../../fixtures/document-renderers'
import {
  createDocumentCollection,
  initialDocuments,
} from '../../fixtures/documents'
import type { GalleryControls } from './gallery-controls.ts'
import {
  documentCardAnatomy,
  type SampleRecord,
  sampleCollection,
  sampleRecords,
} from './gallery-data.ts'

export function useSimulatedLoading(delay: number | undefined) {
  const [loading, setLoading] = useState(delay !== undefined)

  useEffect(() => {
    if (delay === undefined) return
    let active = true
    sleep(delay).then(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [delay])

  return loading
}

type CardControls = Pick<
  GalleryControls,
  | 'action'
  | 'density'
  | 'descriptionLines'
  | 'eyebrow'
  | 'footer'
  | 'titleLines'
>

const descriptionClamp = [
  'hidden',
  'line-clamp-1',
  'line-clamp-2',
  'line-clamp-3',
  'line-clamp-4',
] as const

export function SampleCard({
  action,
  density,
  descriptionLines,
  eyebrow,
  footer,
  record,
  titleLines,
}: Readonly<CardControls & { record: SampleRecord }>) {
  const compact = density === 'compact'

  return (
    <Card className="h-full min-h-52" render={<article />}>
      <CardHeader className={compact ? 'p-4' : undefined}>
        {eyebrow || action ? (
          <div className="flex min-w-0 items-center justify-between gap-2">
            {eyebrow ? (
              <Text foreground="muted" size="xs">
                Categoria
              </Text>
            ) : (
              <span />
            )}
            {action ? (
              <Button
                aria-label={`Ações de ${record.title}`}
                size="icon-xs"
                variant="ghost"
              >
                <DotsThreeIcon aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        ) : null}
        <CardTitle
          className={titleLines === 2 ? 'line-clamp-2' : 'truncate'}
          render={(props) => <h2 {...props} />}
        >
          {titleLines === 2
            ? `${record.title}, com um título longo o bastante para ocupar duas linhas`
            : record.title}
        </CardTitle>
        {descriptionLines > 0 ? (
          <CardDescription
            className={descriptionClamp[Math.min(descriptionLines, 4)]}
          >
            Descrição do registro, longa o bastante para ocupar as linhas que o
            card mostra antes de cortar o texto com reticências, e mais algumas
            palavras para chegar à quarta linha do card.
          </CardDescription>
        ) : null}
      </CardHeader>
      {footer ? (
        <>
          <Separator className="mt-auto" />
          <CardFooter
            className={
              compact
                ? 'justify-between gap-3 px-4 py-3'
                : 'justify-between gap-3'
            }
          >
            <Text foreground="muted" size="xs">
              Atualizado hoje
            </Text>
            <Text foreground="muted" size="xs">
              Ana Souza
            </Text>
          </CardFooter>
        </>
      ) : null}
    </Card>
  )
}

export const ComposedGallery = ({
  action,
  density,
  descriptionLines,
  empty,
  emptyMessage,
  eyebrow,
  footer,
  loading,
  pageSize,
  titleLines,
}: Readonly<GalleryControls>) => (
  <GalleryView<SampleRecord>
    collection={sampleCollection(
      empty
        ? []
        : sampleRecords.slice(0, pageSize === 'none' ? undefined : pageSize),
    )}
    emptyMessage={emptyMessage}
    loading={loading}
    loadingRecordAnatomy={{
      action,
      density,
      descriptionLines,
      eyebrow,
      footer,
      titleLines,
    }}
    loadingRecordLabel="Carregando registro"
    {...(pageSize === 'none' ? {} : { pageSize })}
    renderRecord={(record) => (
      <SampleCard
        action={action}
        density={density}
        descriptionLines={descriptionLines}
        eyebrow={eyebrow}
        footer={footer}
        record={record}
        titleLines={titleLines}
      />
    )}
  />
)

const DOCUMENTS_PAGE_SIZE = 9

const ignore = () => undefined

const noActions: DocumentActions = {
  onArchive: ignore,
  onOpen: ignore,
  onTogglePin: ignore,
}

export function PaginatedDocumentsGallery({
  actions = noActions,
  loadingFor,
}: Readonly<{ actions?: DocumentActions; loadingFor?: number }>) {
  const loading = useSimulatedLoading(loadingFor)
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(initialDocuments.length / DOCUMENTS_PAGE_SIZE)
  const pageOfDocuments = initialDocuments.slice(
    (page - 1) * DOCUMENTS_PAGE_SIZE,
    page * DOCUMENTS_PAGE_SIZE,
  )

  return (
    <div className="grid gap-3">
      <GalleryView
        collection={createDocumentCollection(pageOfDocuments)}
        emptyMessage="Nenhum documento para exibir."
        loading={loading}
        loadingRecordAnatomy={documentCardAnatomy}
        loadingRecordLabel="Carregando documento"
        pageSize={DOCUMENTS_PAGE_SIZE}
        renderRecord={renderDocumentCard(actions)}
      />
      {loading ? null : (
        <CollectionPagination
          label="Paginação de documentos"
          onPageChange={setPage}
          page={page}
          pageCount={pageCount}
          pageSize={DOCUMENTS_PAGE_SIZE}
          total={initialDocuments.length}
        />
      )}
    </div>
  )
}
