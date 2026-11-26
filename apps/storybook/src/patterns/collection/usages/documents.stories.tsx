import { FileTextIcon, GridFourIcon, RowsIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconFrameStyle } from '@tc96/ui/icon-frame'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import {
  Action,
  CollectionFrame,
  CollectionFrameBody,
  CollectionFrameHeader,
  type CollectionLayout,
  CollectionLayoutOutlet,
  type CollectionPreferences,
  CollectionProvider,
  CollectionToolbar,
  GalleryView,
  useCollectionPreferences,
  ViewSettings,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/ui/patterns'
import { type ReactElement, type ReactNode, useMemo, useState } from 'react'
import { expect, fn, within } from 'storybook/test'
import {
  type DocumentActions,
  renderDocumentCard,
  renderDocumentListRow,
  renderPinnedDocumentCard,
} from '../fixtures/document-renderers'
import {
  createDocumentCollection,
  type DocumentKind,
  type DocumentRecord,
  kindOptionOf,
  kindOptions,
  initialDocuments as seedDocuments,
} from '../fixtures/documents'
import { ViewSwitcherPicker } from '../fixtures/view-switcher-picker'

type DocumentLayout = Extract<CollectionLayout, 'gallery' | 'list'>

const documentLayouts: readonly ViewSettingsMode<DocumentLayout>[] = [
  { icon: RowsIcon, label: 'Lista', value: 'list' },
  { icon: GridFourIcon, label: 'Galeria', value: 'gallery' },
]

const isDocumentLayout = (value: CollectionLayout): value is DocumentLayout =>
  documentLayouts.some((mode) => mode.value === value)

const onOpen = fn()

const byRecentlyCreated = (a: DocumentRecord, b: DocumentRecord) =>
  b.createdAt.localeCompare(a.createdAt)

interface DocumentView {
  icon?: ReactNode
  id: string
  kinds: readonly DocumentKind[]
  label: string
}

const kindViewIcon = (kind: DocumentKind) => {
  const { color, icon: Icon } = kindOptionOf(kind)
  return (
    <span
      className="inline-flex size-4 items-center justify-center rounded-sm"
      style={iconFrameStyle(color, 'color')}
    >
      <Icon aria-hidden="true" className="size-3" />
    </span>
  )
}

const kindView = (kind: DocumentKind, label: string): DocumentView => ({
  icon: kindViewIcon(kind),
  id: `${kind}s`,
  kinds: [kind],
  label,
})

const initialViews: readonly DocumentView[] = [
  { id: 'all', kinds: [], label: 'Todos' },
  kindView('note', 'Notas'),
  kindView('document', 'Documentos'),
  kindView('bookmark', 'Bookmarks'),
]

const toggle = <TValue,>(values: readonly TValue[], value: TValue) =>
  values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value]

function SectionHeading({
  children,
  id,
}: Readonly<{ children: string; id: string }>): ReactElement {
  return (
    <h2 className="font-medium text-muted-foreground text-sm" id={id}>
      {children}
    </h2>
  )
}

function DocumentsWorkspace({
  documents,
  loading,
  onDocumentsChange,
}: Readonly<{
  documents: readonly DocumentRecord[]
  loading: boolean
  onDocumentsChange: (
    update: (current: DocumentRecord[]) => DocumentRecord[],
  ) => void
}>): ReactElement {
  const { preferences, setPreferences } = useCollectionPreferences()
  const [kindFilter, setKindFilter] = useState<readonly DocumentKind[]>([])
  const [views, setViews] = useState(initialViews)
  const [viewId, setViewId] = useState(initialViews[0].id)

  const selectView = (view: DocumentView) => {
    setViewId(view.id)
    setKindFilter(view.kinds)
  }
  const createView = () => {
    const view: DocumentView = {
      id: `saved-${crypto.randomUUID()}`,
      kinds: kindFilter,
      label: `Nova visão ${views.length - initialViews.length + 1}`,
    }
    setViews((current) => [...current, view])
    setViewId(view.id)
  }
  const deleteView = (id: string) => {
    const remaining = views.filter((view) => view.id !== id)
    setViews(remaining)
    if (id === viewId) selectView(remaining[0])
  }
  const addNote = () =>
    onDocumentsChange((current) => [
      {
        archived: false,
        excerpt: 'Esta nota ainda não tem conteúdo.',
        id: crypto.randomUUID(),
        kind: 'note',
        createdAt: new Date().toISOString(),
        ownerId: 'ana',
        pinned: false,
        title: 'Nota sem título',
      },
      ...current,
    ])

  const actions = useMemo<DocumentActions>(
    () => ({
      onArchive: (id) =>
        onDocumentsChange((current) =>
          current.map((document) =>
            document.id === id ? { ...document, archived: true } : document,
          ),
        ),
      onOpen,
      onTogglePin: (id) =>
        onDocumentsChange((current) =>
          current.map((document) =>
            document.id === id
              ? { ...document, pinned: !document.pinned }
              : document,
          ),
        ),
    }),
    [onDocumentsChange],
  )

  const pinnedDocuments = useMemo(
    () =>
      createDocumentCollection(
        documents
          .filter((document) => document.pinned && !document.archived)
          .sort(byRecentlyCreated),
      ),
    [documents],
  )

  const collection = useMemo(() => {
    return createDocumentCollection(
      documents
        .filter(
          (document) =>
            !document.pinned &&
            !document.archived &&
            (kindFilter.length === 0 || kindFilter.includes(document.kind)),
        )
        .sort(byRecentlyCreated),
    )
  }, [documents, kindFilter])

  const renderListRecord = useMemo(
    () => renderDocumentListRow(actions),
    [actions],
  )
  const renderGalleryRecord = useMemo(
    () => renderDocumentCard(actions),
    [actions],
  )
  const renderPinnedRecord = useMemo(
    () => renderPinnedDocumentCard(actions),
    [actions],
  )

  const layout = preferences.layout
  const hasPinned = loading || pinnedDocuments.records.length > 0

  return (
    <div className="flex h-dvh min-w-0 flex-col p-3">
      <CollectionFrame>
        <CollectionFrameHeader>
          <CollectionToolbar
            aria-label="Controles de notas e documentos"
            right={
              <>
                <ViewSettings
                  activeFilterCount={kindFilter.length}
                  mode={isDocumentLayout(layout) ? layout : 'list'}
                  modes={documentLayouts}
                  onClearFilters={() => setKindFilter([])}
                  onModeChange={(nextLayout) =>
                    setPreferences(
                      (current) => ({ ...current, layout: nextLayout }),
                      'layout',
                    )
                  }
                >
                  <ViewSettingsSection label="Filtros">
                    <MenuSub>
                      <MenuSubTrigger>
                        <FileTextIcon aria-hidden="true" />
                        Tipo
                      </MenuSubTrigger>
                      <MenuSubPopup>
                        <MenuGroup>
                          <MenuGroupLabel>Tipo</MenuGroupLabel>
                          {kindOptions.map((option) => (
                            <MenuCheckboxItem
                              checked={kindFilter.includes(option.value)}
                              closeOnClick={false}
                              key={option.value}
                              onCheckedChange={() =>
                                setKindFilter((current) =>
                                  toggle(current, option.value),
                                )
                              }
                            >
                              {option.label}
                            </MenuCheckboxItem>
                          ))}
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  </ViewSettingsSection>
                </ViewSettings>
                <Action label="Nova nota" onClick={addNote} />
              </>
            }
            left={
              <ViewSwitcherPicker
                onCreate={createView}
                onDelete={views.length > 1 ? deleteView : undefined}
                onSelect={(id) => {
                  const next = views.find((view) => view.id === id)
                  if (next) selectView(next)
                }}
                selectedId={viewId}
                views={views}
              />
            }
            mode="plain"
          />
        </CollectionFrameHeader>

        <CollectionFrameBody aria-label="Notas e documentos" className="gap-6">
          {hasPinned ? (
            <section aria-labelledby="pinned-documents" className="grid gap-1">
              <SectionHeading id="pinned-documents">Fixados</SectionHeading>
              <GalleryView
                collection={pinnedDocuments}
                loading={loading}
                loadingCount={3}
                loadingLabel="Carregando item fixado"
                renderRecord={renderPinnedRecord}
              />
            </section>
          ) : null}

          <section aria-label="Recentes" className="grid gap-3">
            <CollectionLayoutOutlet
              collection={collection}
              gallery={{
                emptyMessage: 'Nenhuma nota ou documento por aqui.',
                loading,
                loadingCount: 8,
                loadingLabel: 'Carregando documento',
              }}
              list={{
                emptyMessage: 'Nenhuma nota ou documento por aqui.',
                loading,
                loadingCount: 6,
                loadingLabel: 'Carregando documento',
              }}
              renderGalleryRecord={renderGalleryRecord}
              renderKanbanRecord={() => null}
              renderListRecord={renderListRecord}
            />
          </section>
        </CollectionFrameBody>
      </CollectionFrame>
    </div>
  )
}

interface DocumentsArgs {
  defaultLayout: DocumentLayout
  initialDocuments: readonly DocumentRecord[]
  loading: boolean
}

const meta = {
  args: {
    defaultLayout: 'list',
    initialDocuments: seedDocuments,
    loading: false,
  },
  argTypes: {
    defaultLayout: {
      control: 'inline-radio',
      options: documentLayouts.map((mode) => mode.value),
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: function Documents({
    defaultLayout,
    initialDocuments,
    loading,
  }: Readonly<DocumentsArgs>): ReactElement {
    const [documents, setDocuments] = useState<DocumentRecord[]>(() => [
      ...initialDocuments,
    ])
    const [preferences, setPreferences] = useState<CollectionPreferences>({
      groupBy: null,
      layout: defaultLayout,
    })
    const collection = useMemo(
      () => createDocumentCollection(documents),
      [documents],
    )

    return (
      <CollectionProvider
        collection={collection}
        onPreferencesChange={setPreferences}
        preferences={preferences}
      >
        <DocumentsWorkspace
          documents={documents}
          loading={loading}
          onDocumentsChange={setDocuments}
        />
      </CollectionProvider>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Usages',
} satisfies Meta<DocumentsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Documents: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      within(canvas.getByRole('region', { name: 'Fixados' })).getByRole(
        'article',
        { name: 'Plano técnico de publicações' },
      ),
    ).toBeVisible()
    await expect(
      within(canvas.getByRole('region', { name: 'Recentes' })).getByText(
        'Ideias para o editor',
      ),
    ).toBeVisible()
  },
}
