import {
  EmailProperty,
  PhoneProperty,
  PropertySurface,
  RecordDialog,
  SelectProperty,
  TagsProperty,
  TextProperty,
} from '@tc96/parttens'
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  BriefcaseIcon,
  Building2Icon,
  EllipsisIcon,
  FileTextIcon,
} from 'lucide-react'
import { useState } from 'react'
import {
  type Contact,
  type ContactDocumentType,
  type ContactStage,
  type ContactTag,
  documentTypeOptions,
  isContactDocumentType,
  isContactStage,
  stageOptions,
  tagOptions,
} from '../../collection/fixtures/contacts'
import {
  CreatableProperty,
  type CreatablePropertyLabels,
} from './creatable-property'
import { CreateMoreSwitch } from './create-more'
import { delay } from './delay'
import { RecordHeadline } from './record-headline'

export type NewContact = Omit<Contact, 'id' | 'lastContactAt'>

const stageChoices = stageOptions.filter((option) => option.value !== 'lead')

type OptionalProperty = 'stage' | 'tags' | 'company' | 'role'

const optionalProperties: readonly {
  key: OptionalProperty
  label: string
}[] = [
  { key: 'stage', label: 'Etapa' },
  { key: 'tags', label: 'Tags' },
  { key: 'company', label: 'Empresa' },
  { key: 'role', label: 'Cargo' },
]

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
  const [documentType, setDocumentType] = useState<ContactDocumentType | null>(
    null,
  )
  const [document, setDocument] = useState<string | null>(null)
  const [visible, setVisible] = useState<ReadonlySet<OptionalProperty>>(
    new Set(),
  )
  const [stage, setStage] = useState<ContactStage>('none')
  const [emails, setEmails] = useState<readonly string[]>([])
  const [phones, setPhones] = useState<readonly string[]>([])
  const [tags, setTags] = useState<readonly ContactTag[]>([])

  const reset = () => {
    setName('')
    setRole(null)
    setCompany(null)
    setStage('none')
    setDocumentType(null)
    setDocument(null)
    setEmails([])
    setPhones([])
    setTags([])
  }

  const setPropertyVisible = (key: OptionalProperty, shown: boolean) =>
    setVisible((current) => {
      const next = new Set(current)
      if (shown) next.add(key)
      else next.delete(key)
      return next
    })

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
          document: document ?? undefined,
          documentType: documentType ?? undefined,
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
        <RecordHeadline
          descriptionLabel="Descrição"
          descriptionPlaceholder="Adicionar descrição..."
          onTitleChange={setName}
          title={name}
          titleLabel="Nome"
          titlePlaceholder="Nome do contato"
        />
        <div className="flex flex-wrap items-center gap-2">
          <PhoneProperty
            ariaLabel="Telefones"
            display="trigger"
            onValueChange={setPhones}
            placeholder="Telefone"
            value={phones}
            variant="badge"
          />
          <EmailProperty
            ariaLabel="E-mails"
            display="trigger"
            onValueChange={setEmails}
            placeholder="E-mail"
            value={emails}
            variant="badge"
          />
          <SelectProperty
            ariaLabel="Tipo"
            onValueChange={(value) =>
              setDocumentType(
                value && isContactDocumentType(value) ? value : null,
              )
            }
            options={documentTypeOptions}
            placeholder="Tipo"
            value={documentType}
          />
          <TextProperty
            addLabel="Documento"
            ariaLabel="Documento"
            fallback="Documento"
            icon={FileTextIcon}
            inputPlaceholder={
              documentType === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'
            }
            onCommit={setDocument}
            value={document}
          />
          {visible.has('stage') ? (
            <SelectProperty
              ariaLabel="Etapa"
              onValueChange={(value) => {
                if (value && isContactStage(value)) setStage(value)
              }}
              options={stageChoices}
              value={stage}
            />
          ) : null}
          {visible.has('tags') ? (
            <TagsProperty<ContactTag>
              ariaLabel="Tags"
              display="count"
              onValueChange={setTags}
              options={tagOptions}
              value={tags}
              variant="badge"
            />
          ) : null}
          {visible.has('company') ? (
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
          ) : null}
          {visible.has('role') ? (
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
          ) : null}
          <Menu>
            <MenuTrigger
              aria-label="Mais propriedades"
              render={
                <PropertySurface muted render={<button type="button" />} />
              }
            >
              <EllipsisIcon aria-hidden className="size-3.5" />
            </MenuTrigger>
            <MenuPopup align="start">
              {optionalProperties.map(({ key, label }) => (
                <MenuCheckboxItem
                  checked={visible.has(key)}
                  key={key}
                  onCheckedChange={(shown) => setPropertyVisible(key, shown)}
                  variant="switch"
                >
                  {label}
                </MenuCheckboxItem>
              ))}
            </MenuPopup>
          </Menu>
        </div>
      </div>
    </RecordDialog>
  )
}
