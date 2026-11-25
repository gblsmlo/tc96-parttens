import type { Meta, StoryObj } from '@storybook/react-vite'
import { Documents1 } from '@tc96/ui/blocks/data/documents/documents-1'
import {
  expect,
  fireEvent,
  fn,
  screen,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'
import { people, records } from '../fixtures/documents-1.ts'
import {
  type Documents1Controls,
  documents1ControlArgs,
} from './documents-1-controls.ts'
import { ComposedDocuments1 } from './documents-1-layouts.tsx'

const callbacks = {
  onCollapsedGroupIdsChange: fn(),
  onCreateLink: fn(),
  onCreateNote: fn(),
  onCreatePage: fn(),
  onDelete: fn(),
  onDownload: fn(),
  onGroupByChange: fn(),
  onModeChange: fn(),
  onOpen: fn(),
  onPageChange: fn(),
  onPinnedChange: fn(),
  onRename: fn(),
  onRetry: fn(),
  onSavedViewCreate: fn(),
  onSavedViewSelect: fn(),
  onSavePreference: fn(),
  onSearchChange: fn(),
  onShare: fn(),
  onSortChange: fn(),
  onTypeFilterChange: fn(),
  onUpload: fn(),
  onViewChange: fn(),
}

const meta = {
  args: { ...documents1ControlArgs, ...callbacks },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDocuments1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Documents/Documents1/Behavior',
} satisfies Meta<
  Documents1Controls & Record<keyof typeof callbacks, () => void>
>

export default meta

type Story = StoryObj<typeof meta>

const pdfName = 'Contrato de fornecimento assinado.pdf'
const pageName = 'Minuta de aditivo contratual'
const noteName = 'Pauta da reunião com a Moinho Santa Clara'
const lockedName = 'Certidão de óbito.pdf'
const uploadingName = 'Laudo pericial.pdf'
const failedName = 'Vídeo da vistoria.mov'

const toolbarOf = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('toolbar', {
    name: 'Controles de documentos',
  })

const rowsOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('[data-slot="data-table"] tbody tr')

const rowOf = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByText(name).closest('tr') as HTMLElement

const listRowOf = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement)
    .getByRole('button', { name: `Abrir ${name}` })
    .closest('[data-slot="list-row"]') as HTMLElement

const waitForMenusToClose = () =>
  waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

const openDisplayMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: /^Exibição/ }),
  )
  return screen.findByRole('menu')
}

const chooseInSubmenu = async (
  canvasElement: HTMLElement,
  submenu: string,
  role: 'menuitemcheckbox' | 'menuitemradio',
  option: string,
) => {
  await openDisplayMenu(canvasElement)
  await userEvent.click(await screen.findByRole('menuitem', { name: submenu }))
  await userEvent.click(await screen.findByRole(role, { name: option }))
}

const chooseView = async (
  canvasElement: HTMLElement,
  current: string,
  next: string,
) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: current }),
  )
  await userEvent.click(await screen.findByRole('button', { name: next }))
}

const openRowActions = async (canvasElement: HTMLElement, name: string) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: `Ações de ${name}` }),
  )
  return within(await screen.findByRole('menu'))
}

const menuItemNames = (menu: ReturnType<typeof within>) =>
  menu.getAllByRole('menuitem').map((item: HTMLElement) => item.textContent)

const openCreateMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(toolbarOf(canvasElement)).getByRole('button', { name: 'Novo' }),
  )
  return within(await screen.findByRole('menu'))
}

export const TheViewSwitcherReplacesTheHeading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryAllByRole('heading')).toHaveLength(0)
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Todos' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Documentos' }),
    ).toBeVisible()
  },
}

export const ViewsShowTheirCountsAndReportTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Todos' }),
    )
    const media = await screen.findByRole('button', {
      name: 'Mídia, 3 itens',
    })
    await waitFor(() => expect(media).toBeVisible())
    await userEvent.click(media)
    await expect(args.onViewChange).toHaveBeenCalledWith('media')
    await expect(
      within(toolbarOf(canvasElement)).getByRole('button', { name: 'Mídia' }),
    ).toBeVisible()
    await expect(rowsOf(canvasElement)).toHaveLength(3)
  },
}

export const ModeTabsSwitchToTheList: Story = {
  play: async ({ args, canvasElement }) => {
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitemradio', { name: 'Lista' }),
    )
    await expect(args.onModeChange).toHaveBeenCalledWith('list')
    await expect(within(canvasElement).queryByRole('table')).toBeNull()
    await expect(
      canvasElement.querySelectorAll('[data-slot="list-row"]'),
    ).toHaveLength(records.length)
    await userEvent.keyboard('{Escape}')
    await waitForMenusToClose()
  },
}

export const SearchReportsTheTextOnSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const field = within(toolbarOf(canvasElement)).getByRole('searchbox', {
      name: 'Buscar documentos',
    })
    await userEvent.type(field, 'contrato')
    await expect(args.onSearchChange).not.toHaveBeenCalled()
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearchChange).toHaveBeenCalledWith('contrato')
    await expect(rowsOf(canvasElement)).toHaveLength(1)
  },
}

export const SortReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Ordenar por', 'menuitemradio', 'Nome')
    await expect(args.onSortChange).toHaveBeenCalledWith('name')
    await userEvent.keyboard('{Escape}{Escape}')
    await waitForMenusToClose()
  },
}

export const TypeFilterReportsTheCheckedTypes: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tipo', 'menuitemcheckbox', 'Imagem')
    await expect(args.onTypeFilterChange).toHaveBeenLastCalledWith(['image'])
    await userEvent.click(
      screen.getByRole('menuitemcheckbox', { name: 'Vídeo' }),
    )
    await expect(args.onTypeFilterChange).toHaveBeenLastCalledWith([
      'image',
      'video',
    ])
    await userEvent.keyboard('{Escape}{Escape}')
    await waitForMenusToClose()
    await expect(rowsOf(canvasElement)).toHaveLength(2)
  },
}

export const ClearFiltersResetsSearchAndType: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Tipo', 'menuitemcheckbox', 'Nota')
    await userEvent.keyboard('{Escape}{Escape}')
    await waitForMenusToClose()
    await waitFor(() =>
      expect(
        within(toolbarOf(canvasElement)).getByRole('button', {
          name: 'Exibição (1)',
        }),
      ).toBeVisible(),
    )
    await openDisplayMenu(canvasElement)
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Limpar filtros' }),
    )
    await expect(args.onTypeFilterChange).toHaveBeenLastCalledWith([])
    await waitForMenusToClose()
  },
}

export const GroupingByPinnedListsThePinnedFirst: Story = {
  args: { groupBy: 'pinned' },
  play: async ({ canvasElement }) => {
    const labels = [
      ...canvasElement.querySelectorAll('[data-slot="data-table-group-label"]'),
    ].map((label) => label.textContent)
    await expect(labels).toEqual(['Fixados', 'Recentes'])
  },
}

export const GroupByReportsTheChoice: Story = {
  play: async ({ args, canvasElement }) => {
    await chooseInSubmenu(canvasElement, 'Agrupar por', 'menuitemradio', 'Tipo')
    await expect(args.onGroupByChange).toHaveBeenCalledWith('type')
    await userEvent.keyboard('{Escape}{Escape}')
    await waitForMenusToClose()
  },
}

export const TheNameCellShowsTheTypeAndThePin: Story = {
  play: async ({ canvasElement }) => {
    const note = within(rowOf(canvasElement, noteName))
    await expect(note.getByRole('img', { name: 'Fixado' })).toBeVisible()
    await expect(note.getByText('Nota')).toBeVisible()
    await expect(note.getByText('Compartilhado')).toBeVisible()
    const page = within(rowOf(canvasElement, pageName))
    await expect(page.queryByRole('img', { name: 'Fixado' })).toBeNull()
    await expect(page.getByText('Documento')).toBeVisible()
  },
}

export const SizeAndLinkShowTheReadyText: Story = {
  play: async ({ canvasElement }) => {
    const pdf = within(rowOf(canvasElement, pdfName))
    await expect(pdf.getByText('2,4 MB')).toBeVisible()
    await expect(
      pdf.getByText('Ação de cobrança contra fornecedor de farinha'),
    ).toBeVisible()
    await expect(
      within(rowOf(canvasElement, pageName)).getAllByText('—'),
    ).toHaveLength(2)
  },
}

export const ARowOpensTheItem: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: `Abrir ${pdfName}` }),
    )
    await expect(args.onOpen).toHaveBeenCalledWith('doc-201')
  },
}

export const RowActionsFollowTheKind: Story = {
  play: async ({ canvasElement }) => {
    const file = await openRowActions(canvasElement, pdfName)
    await expect(menuItemNames(file)).toEqual([
      'Abrir',
      'Baixar',
      'Renomear',
      'Desafixar',
      'Visibilidade',
      'Excluir',
    ])
    await userEvent.keyboard('{Escape}')
    await waitForMenusToClose()
    const page = await openRowActions(canvasElement, pageName)
    await expect(page.queryByRole('menuitem', { name: 'Baixar' })).toBeNull()
    await expect(page.getByRole('menuitem', { name: 'Fixar' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitForMenusToClose()
  },
}

export const RowActionsFollowThePermissions: Story = {
  play: async ({ canvasElement }) => {
    const menu = await openRowActions(canvasElement, lockedName)
    await expect(menu.queryByRole('menuitem', { name: 'Renomear' })).toBeNull()
    await expect(menu.queryByRole('menuitem', { name: 'Excluir' })).toBeNull()
    await expect(menu.getByRole('menuitem', { name: 'Baixar' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitForMenusToClose()
  },
}

export const DownloadReportsTheFile: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openRowActions(canvasElement, pdfName)
    await userEvent.click(menu.getByRole('menuitem', { name: 'Baixar' }))
    await expect(args.onDownload).toHaveBeenCalledWith('doc-201')
    await expect(args.onOpen).not.toHaveBeenCalled()
    await waitForMenusToClose()
  },
}

export const RenameReportsTheItem: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openRowActions(canvasElement, pageName)
    await userEvent.click(menu.getByRole('menuitem', { name: 'Renomear' }))
    await expect(args.onRename).toHaveBeenCalledWith('doc-202')
    await waitForMenusToClose()
  },
}

export const PinReportsTheNewState: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openRowActions(canvasElement, pageName)
    await userEvent.click(menu.getByRole('menuitem', { name: 'Fixar' }))
    await expect(args.onPinnedChange).toHaveBeenCalledWith('doc-202', true)
    await waitForMenusToClose()
    await expect(
      within(rowOf(canvasElement, pageName)).getByRole('img', {
        name: 'Fixado',
      }),
    ).toBeVisible()
  },
}

export const ShareReportsTheItem: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openRowActions(canvasElement, noteName)
    await userEvent.click(menu.getByRole('menuitem', { name: 'Visibilidade' }))
    await expect(args.onShare).toHaveBeenCalledWith('note-301')
    await waitForMenusToClose()
  },
}

export const DeleteReportsTheItem: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openRowActions(canvasElement, pageName)
    await userEvent.click(menu.getByRole('menuitem', { name: 'Excluir' }))
    await expect(args.onDelete).toHaveBeenCalledWith('doc-202')
    await waitForMenusToClose()
  },
}

export const WithoutRowCallbacksThereIsNoActionsMenu: Story = {
  args: { openable: false, rowActions: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryAllByRole('button', { name: /^Ações de/ }),
    ).toHaveLength(0)
    await expect(
      within(canvasElement).queryAllByRole('button', { name: /^Abrir/ }),
    ).toHaveLength(0)
  },
}

export const AnUploadShowsItsProgress: Story = {
  args: { uploads: true },
  play: async ({ canvasElement }) => {
    const row = within(rowOf(canvasElement, uploadingName))
    const progress = row.getByRole('progressbar', {
      name: `Envio de ${uploadingName}`,
    })
    await expect(progress).toHaveAttribute('aria-valuenow', '45')
    await expect(row.getByText('Enviando… 45%')).toBeVisible()
    await expect(
      within(canvasElement).queryByRole('button', {
        name: `Abrir ${uploadingName}`,
      }),
    ).toBeNull()
    await expect(
      row.queryByRole('button', { name: `Ações de ${uploadingName}` }),
    ).toBeNull()
  },
}

export const AFailedUploadShowsTheErrorAndOffersOnlyDelete: Story = {
  args: { uploads: true },
  play: async ({ args, canvasElement }) => {
    const row = within(rowOf(canvasElement, failedName))
    await expect(
      row.getByRole('img', { name: 'O arquivo não foi enviado' }),
    ).toBeVisible()
    await expect(
      row.getByText('O arquivo não cabe no seu espaço de armazenamento.'),
    ).toBeVisible()
    const menu = await openRowActions(canvasElement, failedName)
    await expect(menuItemNames(menu)).toEqual(['Excluir'])
    await userEvent.click(menu.getByRole('menuitem', { name: 'Excluir' }))
    await expect(args.onDelete).toHaveBeenCalledWith('upload-2')
    await waitForMenusToClose()
  },
}

export const TheListRowShowsTheUploadAndTheActions: Story = {
  args: { mode: 'list', uploads: true },
  play: async ({ canvasElement }) => {
    const uploading = within(canvasElement)
      .getByText(uploadingName)
      .closest('[data-slot="list-row"]') as HTMLElement
    await expect(
      within(uploading).getByRole('progressbar', {
        name: `Envio de ${uploadingName}`,
      }),
    ).toBeVisible()
    const page = listRowOf(canvasElement, pageName)
    const action = page.querySelector(
      '[data-slot="list-row-action"]',
    ) as HTMLElement
    await expect(
      within(action).getByRole('button', { name: `Ações de ${pageName}` }),
    ).toBeVisible()
  },
}

export const TheCreateMenuReportsEachChoice: Story = {
  play: async ({ args, canvasElement }) => {
    const menu = await openCreateMenu(canvasElement)
    await expect(menuItemNames(menu)).toEqual([
      'Documento',
      'Nota',
      'Weblink',
      'Enviar arquivo',
    ])
    await userEvent.click(menu.getByRole('menuitem', { name: 'Nota' }))
    await expect(args.onCreateNote).toHaveBeenCalledOnce()
    await waitForMenusToClose()
    const again = await openCreateMenu(canvasElement)
    await userEvent.click(again.getByRole('menuitem', { name: 'Weblink' }))
    await expect(args.onCreateLink).toHaveBeenCalledOnce()
    await waitForMenusToClose()
  },
}

export const UploadSendsThePickedFiles: Story = {
  play: async ({ args, canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>(
      '[data-slot="documents-1-upload-input"]',
    ) as HTMLInputElement
    const picked = fn()
    input.addEventListener(
      'click',
      (event) => {
        event.preventDefault()
        picked()
      },
      { once: true },
    )
    const menu = await openCreateMenu(canvasElement)
    await userEvent.click(
      menu.getByRole('menuitem', { name: 'Enviar arquivo' }),
    )
    await expect(picked).toHaveBeenCalledOnce()
    await waitForMenusToClose()

    const file = new File(['laudo'], 'Parecer técnico.pdf', {
      type: 'application/pdf',
    })
    const data = new DataTransfer()
    data.items.add(file)
    input.files = data.files
    fireEvent.change(input)
    await expect(args.onUpload).toHaveBeenCalledWith([file])
    await expect(input.value).toBe('')
    await expect(
      await within(canvasElement).findByRole('progressbar', {
        name: 'Envio de Parecer técnico.pdf',
      }),
    ).toBeVisible()
  },
}

export const WithoutCreateCallbacksThereIsNoCreateMenu: Story = {
  args: { create: false },
  play: async ({ canvasElement }) => {
    await expect(
      within(toolbarOf(canvasElement)).queryByRole('button', { name: 'Novo' }),
    ).toBeNull()
    await expect(
      canvasElement.querySelector('[data-slot="documents-1-upload-input"]'),
    ).toBeNull()
  },
}

export const PaginationReportsTheNextPage: Story = {
  args: { paginated: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('1–5 de 12')).toBeVisible()
    await userEvent.click(
      within(
        canvas.getByRole('navigation', { name: 'Paginação de documentos' }),
      ).getByRole('button', { name: 'Próxima página' }),
    )
    await expect(args.onPageChange).toHaveBeenCalledWith(2)
    await expect(canvas.getByText('6–10 de 12')).toBeVisible()
  },
}

export const WithoutPageCountThereIsNoFooter: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('navigation', {
        name: 'Paginação de documentos',
      }),
    ).toBeNull()
    await expect(rowsOf(canvasElement)).toHaveLength(records.length)
  },
}

export const TheEmptyMessageFollowsTheView: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Nenhuma nota, documento ou mídia por aqui.'),
    ).toBeVisible()
    await chooseView(canvasElement, 'Todos', 'Notas, 0 itens')
    await expect(
      await canvas.findByText('Nenhuma nota por aqui.'),
    ).toBeVisible()
  },
}

export const TheEmptyMessageNamesTheFilters: Story = {
  render: () => <Documents1 filtered people={people} records={[]} />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum item com esses filtros.'),
    ).toBeVisible()
  },
}

export const PendingShowsTheSkeleton: Story = {
  render: () => <Documents1 onCreatePage={fn()} pending records={records} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByLabelText('Carregando documentos'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(canvas.getByRole('button', { name: 'Todos' })).toBeVisible()
    await expect(canvas.queryByRole('button', { name: 'Exibição' })).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Novo' })).toBeNull()
  },
}

export const ErrorShowsRetry: Story = {
  render: (args) => <Documents1 error onRetry={args.onRetry} records={[]} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('Não foi possível listar os documentos'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
