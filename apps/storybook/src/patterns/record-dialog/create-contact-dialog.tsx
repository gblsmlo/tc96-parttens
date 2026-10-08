import {
  EmailProperty,
  PhoneProperty,
  RecordDialog,
  SelectProperty,
  TagsProperty,
} from '@tc96/parttens'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Textarea } from '@tc96/ui/textarea'
import { BriefcaseIcon, Building2Icon } from 'lucide-react'
import { useState } from 'react'
import {
  type Contact,
  type ContactStage,
  type ContactTag,
  isContactStage,
  stageOptions,
  tagOptions,
} from '../collection-views/fixtures/contacts'
import {
  CreatableProperty,
  type CreatablePropertyLabels,
} from './creatable-property'
import { CreateMoreSwitch } from './create-more'
import { delay } from './delay'

export type NewContact = Omit<Contact, 'id' | 'lastContactAt'>

const uniqueSorted = (items: readonly string[]) =>
  [...new Set(items)].sort((a, b) => a.localeCompare(b, 'pt-BR'))

const roleLabels: CreatablePropertyLabels = {
  create: (draft) => `Criar cargo "${draft}"`,
  createEmpty: 'Criar novo cargo',
  empty: 'Nenhum cargo encontrado.',
  list: 'Cargos',
  search: 'Buscar cargo',
  searchPlaceholder: 'Buscar ou criar cargo',
}

const companyLabels: CreatablePropertyLabels = {
  create: (draft) => `Criar empresa "${draft}"`,
  createEmpty: 'Criar nova empresa',
  empty: 'Nenhuma empresa encontrada.',
  list: 'Empresas',
  search: 'Buscar empresa',
  searchPlaceholder: 'Buscar ou criar empresa',
}

export function CreateContactDialog({
  companies,
  onCreate,
  onOpenChange,
  open,
  roles,
}: Readonly<{
  companies: readonly string[]
  onCreate: (contact: NewContact) => void
  onOpenChange: (open: boolean) => void
  open: boolean
  roles: readonly string[]
}>) {
  const [createMore, setCreateMore] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const [createdRoles, setCreatedRoles] = useState<string[]>([])
  const [company, setCompany] = useState<string | null>(null)
  const [createdCompanies, setCreatedCompanies] = useState<string[]>([])
  const [stage, setStage] = useState<ContactStage>('lead')
  const [emails, setEmails] = useState<readonly string[]>([])
  const [phones, setPhones] = useState<readonly string[]>([])
  const [tags, setTags] = useState<readonly ContactTag[]>([])

  const reset = () => {
    setName('')
    setRole(null)
    setCompany(null)
    setStage('lead')
    setEmails([])
    setPhones([])
    setTags([])
  }

  return (
    <RecordDialog
      footerStart={
        <CreateMoreSwitch
          checked={createMore}
          label="Criar mais"
          onCheckedChange={setCreateMore}
        />
      }
      keepOpenOnSuccess={createMore}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
      onSubmit={async (event) => {
        const description = String(
          new FormData(event.currentTarget).get('description') ?? '',
        ).trim()
        const trimmedName = name.trim()
        if (trimmedName === '') return false
        await delay(150)
        onCreate({
          company: company ?? '',
          description,
          emails: [...emails],
          name: trimmedName,
          phones: [...phones],
          role: role ?? '',
          stage,
          tags: [...tags],
        })
        if (createMore) reset()
        return true
      }}
      open={open}
      submitDisabled={name.trim() === ''}
      submitLabel="Criar contato"
      submitOnModEnter
      submittingLabel="Criando"
      title="Novo contato"
      titleAncestor="Contatos"
    >
      <div className="flex flex-col gap-3">
        <Field name="name">
          <FieldLabel className="sr-only">Nome</FieldLabel>
          <Input
            autoFocus
            className="w-full font-semibold text-lg [&_input]:px-0 [&_input]:placeholder:text-muted-foreground/60 [&_input]:focus:placeholder:text-muted-foreground"
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome do contato"
            unstyled
            value={name}
          />
        </Field>
        <Field name="description">
          <FieldLabel className="sr-only">Descrição</FieldLabel>
          <Textarea
            className="w-full [&_textarea]:min-h-20 [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground"
            placeholder="Adicionar descrição..."
            unstyled
          />
        </Field>
        <div className="flex flex-wrap items-center gap-2">
          <SelectProperty
            ariaLabel="Etapa"
            onValueChange={(value) => {
              if (value && isContactStage(value)) setStage(value)
            }}
            options={stageOptions}
            value={stage}
          />
          <CreatableProperty
            ariaLabel="Cargo"
            icon={BriefcaseIcon}
            items={uniqueSorted([...roles, ...createdRoles])}
            labels={roleLabels}
            onCreate={(created) => {
              setCreatedRoles((current) => [...current, created])
              setRole(created)
            }}
            onValueChange={setRole}
            value={role}
          />
          <CreatableProperty
            ariaLabel="Empresa"
            icon={Building2Icon}
            items={uniqueSorted([...companies, ...createdCompanies])}
            labels={companyLabels}
            onCreate={(created) => {
              setCreatedCompanies((current) => [...current, created])
              setCompany(created)
            }}
            onValueChange={setCompany}
            value={company}
          />
          <EmailProperty
            ariaLabel="E-mails"
            display="trigger"
            onValueChange={setEmails}
            placeholder="E-mail"
            value={emails}
            variant="badge"
          />
          <PhoneProperty
            ariaLabel="Telefones"
            display="trigger"
            onValueChange={setPhones}
            placeholder="Telefone"
            value={phones}
            variant="badge"
          />
          <TagsProperty<ContactTag>
            ariaLabel="Tags"
            display="count"
            onValueChange={setTags}
            options={tagOptions}
            value={tags}
            variant="badge"
          />
        </div>
      </div>
    </RecordDialog>
  )
}
