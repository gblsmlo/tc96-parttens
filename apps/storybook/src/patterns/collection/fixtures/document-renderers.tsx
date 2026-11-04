import { IconFrame } from '@tc96/elements/icon-frame'
import { Text } from '@tc96/elements/text'
import {
  DateProperty,
  ListRow,
  PersonProperty,
  type PersonPropertyOption,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@tc96/ui/card'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Separator } from '@tc96/ui/separator'
import {
  ArchiveIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  PinIcon,
  PinOffIcon,
} from 'lucide-react'
import {
  type DocumentRecord,
  formatCreatedAt,
  kindOptionOf,
  ownerName,
} from './documents'
import { people } from './tasks'

const pinnedCardClassName =
  'group h-full rounded-lg border-border/80 bg-card/40 shadow-none transition-colors before:hidden hover:bg-muted/50'
const galleryCardClassName =
  'h-full min-h-52 overflow-hidden rounded-lg border-border/80 bg-card/40 shadow-none before:hidden'

export interface DocumentActions {
  onArchive: (id: string) => void
  onOpen: (id: string) => void
  onTogglePin: (id: string) => void
}

const owners: readonly PersonPropertyOption<string>[] = people.map(
  (person) => ({
    fallback: person.initials,
    label: person.name,
    value: person.id,
  }),
)

const revealOnHoverClassName =
  'opacity-0 transition-opacity focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 data-popup-open:opacity-100 pointer-coarse:opacity-100'

function DocumentMenu({
  actions,
  document,
  revealOnHover = false,
  size = 'icon-sm',
}: Readonly<{
  actions: DocumentActions
  document: DocumentRecord
  revealOnHover?: boolean
  size?: 'icon-sm' | 'icon-xs'
}>) {
  const PinToggleIcon = document.pinned ? PinOffIcon : PinIcon
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${document.title}`}
        render={
          <Button
            className={revealOnHover ? revealOnHoverClassName : undefined}
            size={size}
            variant="ghost"
          />
        }
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => actions.onOpen(document.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuItem onClick={() => actions.onTogglePin(document.id)}>
          <PinToggleIcon aria-hidden="true" />
          {document.pinned ? 'Desafixar' : 'Fixar'}
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          onClick={() => actions.onArchive(document.id)}
          variant="destructive"
        >
          <ArchiveIcon aria-hidden="true" />
          Arquivar
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function KindIcon({
  className,
  document,
}: Readonly<{ className?: string; document: DocumentRecord }>) {
  const Icon = kindOptionOf(document.kind).icon
  return <Icon aria-hidden="true" className={className} />
}

export const renderPinnedDocumentCard =
  (actions: DocumentActions) => (document: DocumentRecord) => (
    <Card
      className={pinnedCardClassName}
      render={<article aria-label={document.title} />}
    >
      <CardHeader className="flex items-center gap-3 p-4">
        <IconFrame color={kindOptionOf(document.kind).color} shape="rounded">
          <KindIcon document={document} />
        </IconFrame>
        <div className="grid min-w-0 flex-1">
          <CardTitle
            className="truncate font-medium text-sm leading-5"
            render={
              <h3>
                <button
                  aria-label={`Abrir ${document.title}`}
                  className="max-w-full truncate text-start outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring"
                  onClick={() => actions.onOpen(document.id)}
                  type="button"
                >
                  {document.title}
                </button>
              </h3>
            }
          />
          <CardDescription
            className="truncate text-xs"
            render={
              <p>
                {kindOptionOf(document.kind).label} ·{' '}
                {formatCreatedAt(document.createdAt)}
              </p>
            }
          />
        </div>
        <CardAction className="relative z-10">
          <DocumentMenu
            actions={actions}
            document={document}
            revealOnHover
            size="icon-xs"
          />
        </CardAction>
      </CardHeader>
    </Card>
  )

export const renderDocumentCard =
  (actions: DocumentActions) => (document: DocumentRecord) => (
    <Card
      className={galleryCardClassName}
      render={<article aria-label={document.title} />}
    >
      <CardHeader className="p-4">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Text className="flex min-w-0 items-center gap-1" size="xs" truncate>
            <KindIcon className="size-3" document={document} />
            <span className="truncate">
              {kindOptionOf(document.kind).label}
            </span>
          </Text>
          <DocumentMenu actions={actions} document={document} size="icon-xs" />
        </div>
        <CardTitle render={<h2>{document.title}</h2>} />
        <CardDescription render={<p>{document.excerpt}</p>} />
      </CardHeader>
      <Separator className="mt-auto" />
      <CardFooter className="min-w-0 justify-between gap-3 px-4 py-3">
        <DateProperty
          ariaLabel="Criado em"
          className="text-muted-foreground text-xs"
          displayLabel={formatCreatedAt(document.createdAt)}
          readOnly
          value={document.createdAt.slice(0, 10)}
          variant="plain"
        />
        <PersonProperty
          ariaLabel="Dono"
          avatarSize="sm"
          display="avatar"
          options={owners}
          readOnly
          value={document.ownerId}
          variant="plain"
        />
      </CardFooter>
    </Card>
  )

export const renderDocumentListRow =
  (actions: DocumentActions) => (document: DocumentRecord) => (
    <ListRow
      actions={
        <DocumentMenu actions={actions} document={document} revealOnHover />
      }
      className="group"
      description={[ownerName(document)]}
      icon={<KindIcon document={document} />}
      iconFrame={{ color: kindOptionOf(document.kind).color }}
      key={document.id}
      properties={
        <span className="text-muted-foreground text-sm">
          {formatCreatedAt(document.createdAt)}
        </span>
      }
      title={document.title}
    />
  )
