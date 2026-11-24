import {
  ArrowSquareOutIcon,
  BookmarkSimpleIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  FileArchiveIcon,
  FileImageIcon,
  FileTextIcon,
  FileTxtIcon,
  FileXlsIcon,
  LinkSimpleIcon,
  NoteIcon,
  PencilSimpleIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  PresentationIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupItem,
  RecordGroupLink,
  type RecordGroupVariant,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'

interface DocumentEntry {
  color: string
  external?: boolean
  href: string
  icon: PhosphorIcon
  id: string
  meta: string
  name: string
}

const ignore = (..._values: unknown[]) => undefined
const onOpenDocument = ignore
const onDownloadDocument = ignore
const onRenameDocument = ignore
const onDeleteDocument = ignore

export const files: readonly DocumentEntry[] = [
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
    icon: FileXlsIcon,
    id: 'fees',
    meta: '03/09/2026',
    name: 'planilha-de-honorarios.xlsx',
  },
  {
    href: '#/documentos/peticao-inicial.docx',
    color: '#2563eb',
    icon: FileTxtIcon,
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

export const resources: readonly DocumentEntry[] = [
  {
    href: '#/documentos/peticao-inicial.docx',
    color: '#2563eb',
    icon: FileTxtIcon,
    id: 'petition',
    meta: 'Documento · 28/08/2026',
    name: 'peticao-inicial.docx',
  },
  {
    external: true,
    href: 'https://www.notion.so/escritorio/checklist-de-audiencia',
    color: '#db2777',
    icon: BookmarkSimpleIcon,
    id: 'checklist',
    meta: 'Favorito · notion.so',
    name: 'Checklist de audiência',
  },
  {
    external: true,
    href: 'https://www.gov.br/bcb/pt-br',
    color: '#0284c7',
    icon: LinkSimpleIcon,
    id: 'bcb',
    meta: 'Link · gov.br',
    name: 'Banco Central: taxas de juros',
  },
  {
    href: '#/notas/reuniao-com-cliente',
    color: '#d97706',
    icon: NoteIcon,
    id: 'meeting',
    meta: 'Nota · 05/09/2026',
    name: 'Reunião com o cliente',
  },
]

export function DocumentIcon({ entry }: Readonly<{ entry: DocumentEntry }>) {
  return (
    <IconFrame color={entry.color} shape="rounded" size="xs">
      <entry.icon aria-hidden />
    </IconFrame>
  )
}

export function DocumentsGroup({
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
          leading={<DocumentIcon aria-hidden="true" entry={entry} />}
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

export function DocumentsMenuGroup({
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
          leading={<DocumentIcon aria-hidden="true" entry={file} />}
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
              <DotsThreeIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem onClick={() => onOpenDocument(file.id)}>
                <ArrowSquareOutIcon aria-hidden="true" />
                Abrir
              </MenuItem>
              <MenuItem onClick={() => onDownloadDocument(file.id)}>
                <DownloadSimpleIcon aria-hidden="true" />
                Baixar
              </MenuItem>
              <MenuItem onClick={() => onRenameDocument(file.id)}>
                <PencilSimpleIcon aria-hidden="true" />
                Renomear
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                onClick={() => onDeleteDocument(file.id)}
                variant="destructive"
              >
                <TrashIcon aria-hidden="true" />
                Excluir
              </MenuItem>
            </MenuPopup>
          </Menu>
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}
