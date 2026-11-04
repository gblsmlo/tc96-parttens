import type { Meta, StoryObj } from '@storybook/react-vite'
import { iconFrameStyle } from '@tc96/elements/icon-frame'
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
  MenuCheckboxOption,
  useCollectionPreferences,
  ViewSettingsMenu,
  type ViewSettingsMode,
  ViewSettingsSection,
} from '@tc96/parttens'
import {
  MenuGroup,
  MenuGroupLabel,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { FileTextIcon, LayoutGridIcon, Rows3Icon } from 'lucide-react'
import { type ReactElement, type ReactNode, useMemo, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
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
  { icon: Rows3Icon, label: 'Lista', value: 'list' },
  { icon: LayoutGridIcon, label: 'Galeria', value: 'gallery' },
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
            endSlot={
              <>
                <ViewSettingsMenu
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
                            <MenuCheckboxOption
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
                            </MenuCheckboxOption>
                          ))}
                        </MenuGroup>
                      </MenuSubPopup>
                    </MenuSub>
                  </ViewSettingsSection>
                </ViewSettingsMenu>
                <Action label="Nova nota" onClick={addNote} />
              </>
            }
            startSlot={
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
            variant="plain"
          />
        </CollectionFrameHeader>

        <CollectionFrameBody aria-label="Notas e documentos" className="gap-6">
          {hasPinned ? (
            <section aria-labelledby="pinned-documents" className="grid gap-1">
              <SectionHeading id="pinned-documents">Fixados</SectionHeading>
              <GalleryView
                collection={pinnedDocuments}
                loading={loading}
                loadingRecordCount={3}
                loadingRecordLabel="Carregando item fixado"
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
                loadingRecordCount: 8,
                loadingRecordLabel: 'Carregando documento',
              }}
              list={{
                emptyMessage: 'Nenhuma nota ou documento por aqui.',
                loading,
                loadingRecordCount: 6,
                loadingRecordLabel: 'Carregando documento',
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
    docs: {
      description: {
        component: [
          'Notes and documents of a product team as one `CollectionFrame`: the toolbar, then **Fixados**, a `GalleryView` of the pinned items, then the rest ordered by creation date, newest first in the active layout.',
          'The toolbar follows `Patterns/Toolbar`: the view switcher (Todos, Notas, Documentos, Bookmarks) on the left, and **Exibição** and the **Nova nota** action on the right. Each item carries a three-dots menu: Abrir opens it, Fixar or Desafixar moves it between the two blocks, and Arquivar (destructive, after a divider) removes it; the pinned flag is the consumer record, so the pattern only renders what it receives. The `ViewSettingsMenu` switches the rest between **Lista** (`ListView` with `ListRow`) and **Galeria** (`GalleryView` with the card of `Patterns/Collection/Layouts/Gallery`), and filters by type; the type filter applies to the rest, not to Fixados.',
        ].join('\n\n'),
      },
    },
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
  title: 'Patterns/Collection/Usages/Documents',
} satisfies Meta<DocumentsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Gallery: Story = {
  args: { defaultLayout: 'gallery' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { initialDocuments: [] },
}

const pinnedSection = (canvasElement: HTMLElement) =>
  within(within(canvasElement).getByRole('region', { name: 'Fixados' }))

const collectionBody = (canvasElement: HTMLElement) =>
  within(
    within(canvasElement).getByRole('region', {
      name: 'Recentes',
    }),
  )

const openMenu = async (
  canvasElement: HTMLElement,
  scope: ReturnType<typeof within>,
  title: string,
  item: string,
) => {
  await userEvent.click(
    scope.getByRole('button', { name: `Ações de ${title}` }),
  )
  await userEvent.click(
    await within(canvasElement.ownerDocument.body).findByRole('menuitem', {
      name: item,
    }),
  )
}

export const PinAndUnpin: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fixar in the three-dots menu of a recent item moves it to Fixados, and Desafixar there brings it back to the collection.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const title = 'Ideias para o editor'

    await openMenu(canvasElement, collectionBody(canvasElement), title, 'Fixar')
    await waitFor(() =>
      expect(
        pinnedSection(canvasElement).getByRole('article', { name: title }),
      ).toBeVisible(),
    )
    await expect(collectionBody(canvasElement).queryByText(title)).toBeNull()

    await openMenu(
      canvasElement,
      pinnedSection(canvasElement),
      title,
      'Desafixar',
    )
    await waitFor(() =>
      expect(collectionBody(canvasElement).getByText(title)).toBeVisible(),
    )
    await expect(pinnedSection(canvasElement).queryByText(title)).toBeNull()
  },
}

export const Archive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Arquivar in the three-dots menu removes the item from the collection and from Fixados.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const recent = 'Pendências da semana'
    const pinned = 'Reunião semanal de produto'

    await openMenu(
      canvasElement,
      collectionBody(canvasElement),
      recent,
      'Arquivar',
    )
    await waitFor(() =>
      expect(collectionBody(canvasElement).queryByText(recent)).toBeNull(),
    )

    await openMenu(
      canvasElement,
      pinnedSection(canvasElement),
      pinned,
      'Arquivar',
    )
    await waitFor(() =>
      expect(pinnedSection(canvasElement).queryByText(pinned)).toBeNull(),
    )
  },
}

export const SwitchToGallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The Galeria tab of the `ViewSettingsMenu` mounts the `GalleryView` over the same collection, with the same three-dots menu on each card.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Galeria' }),
    )
    await userEvent.keyboard('[Escape]')

    await waitFor(() =>
      expect(
        collectionBody(canvasElement).getByRole('article', {
          name: 'Matriz de processos',
        }),
      ).toBeVisible(),
    )
    await expect(
      collectionBody(canvasElement).getByRole('button', {
        name: 'Ações de Matriz de processos',
      }),
    ).toBeVisible()
  },
}

export const FilterNotes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filtering by Nota keeps only notes in the collection; the pinned block keeps its documents.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: /Exibição/ }))
    await userEvent.click(await body.findByRole('menuitem', { name: 'Tipo' }))
    await userEvent.click(
      await body.findByRole('menuitemcheckbox', { name: 'Nota' }),
    )
    await userEvent.keyboard('[Escape][Escape]')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    await waitFor(() =>
      expect(
        collectionBody(canvasElement).queryByText('Matriz de processos'),
      ).toBeNull(),
    )
    await expect(
      collectionBody(canvasElement).getByText('Ideias para o editor'),
    ).toBeVisible()
    await expect(
      pinnedSection(canvasElement).getByRole('article', {
        name: 'Plano técnico de publicações',
      }),
    ).toBeVisible()
  },
}

export const SwitchView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Picking Notas in the view switcher keeps only notes in the collection; Nova nota adds an untitled note at the top.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: /Todos/ }))
    await userEvent.click(await body.findByRole('button', { name: 'Notas' }))
    await waitFor(() =>
      expect(
        collectionBody(canvasElement).queryByText('Matriz de processos'),
      ).toBeNull(),
    )
    await expect(
      collectionBody(canvasElement).getByText('Ideias para o editor'),
    ).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Nova nota' }))
    await expect(
      await collectionBody(canvasElement).findByText('Nota sem título'),
    ).toBeVisible()
  },
}

export const ItemMenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The three-dots menu of an item lists Abrir and Fixar, a divider, then Arquivar as a destructive item.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      collectionBody(canvasElement).getByRole('button', {
        name: 'Ações de Núcleo modular',
      }),
    )
    const menu = within(await body.findByRole('menu'))

    await expect(
      menu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Abrir', 'Fixar', 'Arquivar'])
    await expect(menu.getByRole('separator')).toBeInTheDocument()
    await expect(
      menu.getByRole('menuitem', { name: 'Arquivar' }),
    ).toHaveAttribute('data-variant', 'destructive')
  },
}

export const OpenPinned: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Clicking a pinned card opens it; the three-dots menu stays clickable above the card.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    onOpen.mockClear()

    await userEvent.click(
      pinnedSection(canvasElement).getByRole('button', {
        name: 'Abrir Plano técnico de publicações',
      }),
    )
    await expect(onOpen).toHaveBeenCalledWith('publishing-architecture')

    onOpen.mockClear()
    await userEvent.click(
      pinnedSection(canvasElement).getByRole('button', {
        name: 'Ações de Plano técnico de publicações',
      }),
    )
    await expect(onOpen).not.toHaveBeenCalled()
  },
}
