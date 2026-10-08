import {
  createSelectColumn,
  type DataGridColumnDef,
  type DataTableColumnDef,
  DateProperty,
  EmailProperty,
  ListRow,
  PhoneProperty,
  SelectProperty,
  TagsProperty,
} from '@tc96/parttens'
import { Checkbox } from '@tc96/ui/checkbox'
import {
  type Contact,
  type ContactTag,
  isContactStage,
  stageOptions,
  tagOptions,
} from './contacts'
import { TIME_ZONE } from './tasks'

export type ContactChange = Partial<Omit<Contact, 'id'>>
export type UpdateContact = (id: string, change: ContactChange) => void

interface FieldProps {
  contact: Contact
  onChange: UpdateContact
}

export function StageField({ contact, onChange }: Readonly<FieldProps>) {
  return (
    <SelectProperty
      ariaLabel="Etapa"
      onValueChange={(value) => {
        if (value && isContactStage(value))
          onChange(contact.id, { stage: value })
      }}
      options={stageOptions}
      value={contact.stage}
    />
  )
}

export function EmailsField({ contact, onChange }: Readonly<FieldProps>) {
  return (
    <EmailProperty
      ariaLabel="E-mails"
      display="trigger"
      onValueChange={(value) => onChange(contact.id, { emails: [...value] })}
      value={contact.emails}
      variant="badge"
    />
  )
}

export function PhonesField({ contact, onChange }: Readonly<FieldProps>) {
  return (
    <PhoneProperty
      ariaLabel="Telefones"
      display="trigger"
      onValueChange={(value) => onChange(contact.id, { phones: [...value] })}
      value={contact.phones}
      variant="badge"
    />
  )
}

export function TagsField({ contact, onChange }: Readonly<FieldProps>) {
  return (
    <TagsProperty<ContactTag>
      ariaLabel="Tags"
      display="count"
      onValueChange={(value) => onChange(contact.id, { tags: [...value] })}
      options={tagOptions}
      value={contact.tags}
      variant="badge"
    />
  )
}

export function LastContactField({ contact }: Readonly<{ contact: Contact }>) {
  return (
    <DateProperty
      ariaLabel="Último contato"
      locale="pt-BR"
      readOnly
      timeZone={TIME_ZONE}
      value={contact.lastContactAt}
      variant="plain"
    />
  )
}

export const renderContactListRow =
  (updateContact: UpdateContact) => (contact: Contact) => (
    <ListRow
      description={[contact.role, contact.company]}
      key={contact.id}
      properties={
        <div className="flex items-center gap-2">
          <StageField contact={contact} onChange={updateContact} />
          <EmailsField contact={contact} onChange={updateContact} />
          <TagsField contact={contact} onChange={updateContact} />
        </div>
      }
      title={contact.name}
    />
  )

export const createContactGridColumns = (
  onChange: UpdateContact,
): DataGridColumnDef<Contact>[] => [
  createSelectColumn<Contact>(),
  {
    accessorKey: 'name',
    enableHiding: false,
    header: 'Nome',
    meta: { label: 'Nome', type: 'title' },
    minSize: 200,
  },
  {
    accessorKey: 'company',
    header: 'Empresa',
    meta: { label: 'Empresa', type: 'text' },
    minSize: 180,
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    meta: { label: 'Cargo', type: 'text' },
    minSize: 190,
  },
  {
    accessorKey: 'stage',
    cell: ({ row }) => (
      <StageField contact={row.original} onChange={onChange} />
    ),
    header: 'Etapa',
    meta: { label: 'Etapa', type: 'status' },
    minSize: 150,
  },
  {
    accessorFn: (contact) => contact.emails[0] ?? '',
    cell: ({ row }) => (
      <EmailsField contact={row.original} onChange={onChange} />
    ),
    header: 'E-mails',
    id: 'emails',
    meta: { label: 'E-mails', type: 'email' },
    minSize: 260,
  },
  {
    accessorFn: (contact) => contact.phones[0] ?? '',
    cell: ({ row }) => (
      <PhonesField contact={row.original} onChange={onChange} />
    ),
    header: 'Telefones',
    id: 'phones',
    meta: { label: 'Telefones', type: 'phone' },
    minSize: 200,
  },
  {
    accessorFn: (contact) => contact.tags.join(),
    cell: ({ row }) => <TagsField contact={row.original} onChange={onChange} />,
    header: 'Tags',
    id: 'tags',
    meta: { label: 'Tags', type: 'multi-select' },
    minSize: 110,
  },
  {
    accessorKey: 'lastContactAt',
    cell: ({ row }) => <LastContactField contact={row.original} />,
    header: 'Último contato',
    meta: { label: 'Último contato', type: 'date' },
    minSize: 160,
  },
]

export const createContactTableColumns = (
  onChange: UpdateContact,
): DataTableColumnDef<Contact>[] => [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Selecionar ${row.original.name}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    header: ({ table }) => (
      <Checkbox
        aria-label="Selecionar todos os contatos"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    id: 'select',
  },
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{row.original.name}</span>
        <span className="truncate text-muted-foreground text-xs">
          {row.original.role} · {row.original.company}
        </span>
      </div>
    ),
    footer: ({ table }) => `${table.getRowCount()} contatos`,
    header: 'Contato',
  },
  {
    accessorKey: 'stage',
    cell: ({ row }) => (
      <StageField contact={row.original} onChange={onChange} />
    ),
    header: 'Etapa',
  },
  {
    cell: ({ row }) => (
      <EmailsField contact={row.original} onChange={onChange} />
    ),
    header: 'E-mails',
    id: 'emails',
  },
  {
    cell: ({ row }) => (
      <PhonesField contact={row.original} onChange={onChange} />
    ),
    header: 'Telefones',
    id: 'phones',
  },
  {
    cell: ({ row }) => <TagsField contact={row.original} onChange={onChange} />,
    header: 'Tags',
    id: 'tags',
  },
  {
    accessorKey: 'lastContactAt',
    cell: ({ row }) => <LastContactField contact={row.original} />,
    header: 'Último contato',
  },
]
