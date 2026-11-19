import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupItem,
  RecordGroupLink,
  type RecordGroupVariant,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  BookmarkIcon,
  DownloadIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  FileArchiveIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileTypeIcon,
  Link2Icon,
  type LucideIcon,
  PencilIcon,
  PlusIcon,
  PresentationIcon,
  StickyNoteIcon,
  Trash2Icon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface DocumentsArgs {
  variant: RecordGroupVariant
}

interface DocumentEntry {
  color: string
  external?: boolean
  href: string
  icon: LucideIcon
  id: string
  meta: string
  name: string
}

const hidden = { table: { disable: true } } as const
const onOpenDocument = fn()
const onDownloadDocument = fn()
const onRenameDocument = fn()
const onDeleteDocument = fn()

const files: readonly DocumentEntry[] = [
  {
    href: '#/documentos/contrato-assinado.pdf',
    color: '#dc2626',
    icon: FileTextIcon,
    id: 'contract',
    meta: '12/08/2026',
    name: 'contrato-assinado.pdf',
  },
  {
    href: '#/documentos/planilha-de-honorarios.xlsx',
    color: '#059669',
    icon: FileSpreadsheetIcon,
    id: 'fees',
    meta: '03/09/2026',
    name: 'planilha-de-honorarios.xlsx',
  },
  {
    href: '#/documentos/peticao-inicial.docx',
    color: '#2563eb',
    icon: FileTypeIcon,
    id: 'petition',
    meta: '28/08/2026',
    name: 'peticao-inicial-acao-revisional-bancaria-versao-final-revisada.docx',
  },
  {
    href: '#/documentos/apresentacao-ao-cliente.pptx',
    color: '#ea580c',
    icon: PresentationIcon,
    id: 'deck',
    meta: '15/07/2026',
    name: 'apresentacao-ao-cliente.pptx',
  },
  {
    href: '#/documentos/comprovante.png',
    color: '#7c3aed',
    icon: FileImageIcon,
    id: 'receipt',
    meta: '02/09/2026',
    name: 'comprovante.png',
  },
  {
    href: '#/documentos/extratos-2024.zip',
    color: '#78716c',
    icon: FileArchiveIcon,
    id: 'statements',
    meta: '20/06/2026',
    name: 'extratos-2024.zip',
  },
]

const resources: readonly DocumentEntry[] = [
  {
    href: '#/documentos/peticao-inicial.docx',
    color: '#2563eb',
    icon: FileTypeIcon,
    id: 'petition',
    meta: 'Documento · 28/08/2026',
    name: 'peticao-inicial.docx',
  },
  {
    external: true,
    href: 'https://www.notion.so/escritorio/checklist-de-audiencia',
    color: '#db2777',
    icon: BookmarkIcon,
    id: 'checklist',
    meta: 'Favorito · notion.so',
    name: 'Checklist de audiência',
  },
  {
    external: true,
    href: 'https://www.gov.br/bcb/pt-br',
    color: '#0284c7',
    icon: Link2Icon,
    id: 'bcb',
    meta: 'Link · gov.br',
    name: 'Banco Central: taxas de juros',
  },
  {
    href: '#/notas/reuniao-com-cliente',
    color: '#d97706',
    icon: StickyNoteIcon,
    id: 'meeting',
    meta: 'Nota · 05/09/2026',
    name: 'Reunião com o cliente',
  },
]

function DocumentIcon({ entry }: Readonly<{ entry: DocumentEntry }>) {
  return (
    <IconFrame color={entry.color} shape="rounded" size="xs">
      <entry.icon aria-hidden />
    </IconFrame>
  )
}

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import { RecordGroup, RecordGroupAction, RecordGroupLink } from '@acme/patterns'

<RecordGroup
  actions={<RecordGroupAction icon={PlusIcon} label="Add document" onClick={addDocument} />}
  title="Documents"
>
  {documents.map((document) => (
    <RecordGroupLink
      href={document.url}
      key={document.id}
      leading={
        <IconFrame color={document.color} shape="rounded" size="xs">
          <document.icon aria-hidden="true" />
        </IconFrame>
      }
      meta={document.meta}
      {...(document.external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
    >
      {document.name}
    </RecordGroupLink>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Each document is a `RecordGroupLink`: the type icon in a colored `IconFrame` (`rounded`, `xs`: a 24px frame with a 16px icon) in `leading`, the name as content and the kind with a date or a domain in `meta`, which is part of the accessible name. The consumer picks the icon, writes the `meta` copy and opens an external page with `target` and `rel`, which pass to the `a`. See `Patterns/Records/Group/Layouts/Links` for the row itself.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'The `actions` button that adds a document. See `Patterns/Records/Group`.',
      name: 'RecordGroupAction',
    },
  ],
  description: {
    component:
      'The documents of a record, as `RecordGroupLink` rows in a `RecordGroup`. `Files` lists only files (PDF, spreadsheet, text, slides, image, archive), with the date in `meta`, since the extension in the name already gives the format. `Mixed` lists a text file next to a bookmark, an external link and a note, with the kind first in `meta`; the bookmark and the link open in a new tab. `With Menu` lists the same files as `RecordGroupItem` rows: the name is a link and the trailing slot holds the date and a three-dots button that opens a menu, because a link row cannot contain a button. `Behavior` is under test: every row is named by its name and `meta`, a long file name truncates while `meta` stays whole, only external rows open in a new tab, and in the menu rows the link and the button are siblings and the menu offers the file actions.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function DocumentsGroup({
  entries,
  title,
  variant,
}: Readonly<{
  entries: readonly DocumentEntry[]
  title: string
  variant: RecordGroupVariant
}>) {
  return (
    <RecordGroup
      actions={
        <RecordGroupAction icon={PlusIcon} label="Adicionar documento" />
      }
      title={title}
      variant={variant}
    >
      {entries.map((entry) => (
        <RecordGroupLink
          href={entry.href}
          key={entry.id}
          leading={<DocumentIcon entry={entry} />}
          meta={entry.meta}
          {...(entry.external
            ? { rel: 'noopener noreferrer', target: '_blank' }
            : {})}
        >
          {entry.name}
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

function DocumentsMenuGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={
        <RecordGroupAction icon={PlusIcon} label="Adicionar documento" />
      }
      title={title}
      variant={variant}
    >
      {files.map((file) => (
        <RecordGroupItem
          interactive
          key={file.id}
          leading={<DocumentIcon entry={file} />}
          title={
            <a
              className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={file.href}
            >
              {file.name}
            </a>
          }
        >
          <span className="min-w-0 truncate text-muted-foreground">
            {file.meta}
          </span>
          <Menu>
            <MenuTrigger
              aria-label={`Ações de ${file.name}`}
              render={<Button size="icon-sm" variant="ghost" />}
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem onClick={() => onOpenDocument(file.id)}>
                <ExternalLinkIcon aria-hidden="true" />
                Abrir
              </MenuItem>
              <MenuItem onClick={() => onDownloadDocument(file.id)}>
                <DownloadIcon aria-hidden="true" />
                Baixar
              </MenuItem>
              <MenuItem onClick={() => onRenameDocument(file.id)}>
                <PencilIcon aria-hidden="true" />
                Renomear
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                onClick={() => onDeleteDocument(file.id)}
                variant="destructive"
              >
                <Trash2Icon aria-hidden="true" />
                Excluir
              </MenuItem>
            </MenuPopup>
          </Menu>
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<DocumentsArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Documents',
} satisfies Meta<DocumentsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Files: Story = {
  render: ({ variant }) => (
    <DocumentsGroup entries={files} title="Documentos" variant={variant} />
  ),
}

export const Mixed: Story = {
  render: ({ variant }) => (
    <DocumentsGroup entries={resources} title="Documentos" variant={variant} />
  ),
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <DocumentsMenuGroup title="Documentos" variant={variant} />
  ),
}

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fileLinks = within(
      canvas.getByRole('region', { name: 'Arquivos' }),
    ).getAllByRole('link')
    const resourceLinks = within(
      canvas.getByRole('region', { name: 'Recursos' }),
    ).getAllByRole('link')

    await expect(fileLinks).toHaveLength(files.length)
    for (const [index, entry] of files.entries()) {
      await expect(fileLinks[index]).toHaveAccessibleName(
        `${entry.name} ${entry.meta}`,
      )
    }
    const long = fileLinks[2] as HTMLElement
    const name = long.querySelector(
      '[data-slot="record-group-link-name"]',
    ) as HTMLElement
    const linkMeta = long.querySelector(
      '[data-slot="record-group-link-meta"]',
    ) as HTMLElement
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth)
    await expect(linkMeta.scrollWidth).toBeLessThanOrEqual(linkMeta.clientWidth)
    for (const link of [...fileLinks, ...resourceLinks]) {
      await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth)
    }

    for (const [index, entry] of resources.entries()) {
      const link = resourceLinks[index] as HTMLElement
      await expect(link).toHaveAccessibleName(`${entry.name} ${entry.meta}`)
      await expect(link).toHaveAttribute('href', entry.href)
      if (entry.external) {
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      } else {
        await expect(link).not.toHaveAttribute('target')
      }
    }

    const menuGroup = within(
      canvas.getByRole('region', { name: 'Arquivos com menu' }),
    )
    const items = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item"]',
    )
    await expect(items).toHaveLength(files.length)
    for (const item of items) {
      await expect(item.querySelector('a button, button a')).toBeNull()
      await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
      const [label, button] = [
        ...(
          item.querySelector(
            '[data-slot="record-group-item-trailing"]',
          ) as HTMLElement
        ).children,
      ] as HTMLElement[]
      await expect(
        (button as HTMLElement).getBoundingClientRect().left -
          (label as HTMLElement).getBoundingClientRect().right,
      ).toBeCloseTo(4, 0)
    }
    const first = files[0] as DocumentEntry
    await expect(
      menuGroup.getByRole('link', { name: first.name }),
    ).toHaveAttribute('href', first.href)

    onDownloadDocument.mockClear()
    await userEvent.click(
      menuGroup.getByRole('button', { name: `Ações de ${first.name}` }),
    )
    await expect(
      (await screen.findAllByRole('menuitem')).map((item) => item.textContent),
    ).toEqual(['Abrir', 'Baixar', 'Renomear', 'Excluir'])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Baixar' }))
    await expect(onDownloadDocument).toHaveBeenCalledWith(first.id)
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <DocumentsGroup entries={files} title="Arquivos" variant="plain" />
      <DocumentsGroup entries={resources} title="Recursos" variant="plain" />
      <DocumentsMenuGroup title="Arquivos com menu" variant="plain" />
    </div>
  ),
}
