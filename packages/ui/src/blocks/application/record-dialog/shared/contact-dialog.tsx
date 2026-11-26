import {
  BriefcaseIcon,
  BuildingsIcon,
  DotsThreeIcon,
} from '@phosphor-icons/react'
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { EmailProperty } from '@tc96/ui/patterns/properties/display/email/email-property'
import { PhoneProperty } from '@tc96/ui/patterns/properties/display/phone/phone-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { PropertySurface } from '@tc96/ui/patterns/properties/shared/property-surface'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogCreateMore } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-create-more'
import { RecordDialogHeadline } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-headline'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { type ReactNode, useMemo, useState } from 'react'
import { contactDocumentKind } from './contact-document'
import { ContactDocumentProperty } from './contact-document-property'
import { resolveContactDialogLabels } from './contact-labels'
import {
  contactStageOptions,
  contactTagOptions,
  isContactDialogStage,
  isContactDialogTag,
} from './contact-options'
import type {
  ContactDialogProps,
  ContactDialogStage,
  ContactDialogTag,
  ContactDialogValues,
} from './contact-types'
import { CreatableProperty } from './creatable-property'
import { useContactDraft } from './use-contact-draft'

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

export function ContactDialog({
  className,
  companies,
  documents = [],
  labels: labelsProp,
  layout,
  onCreate,
  onOpenChange,
  open,
  roles,
}: Readonly<ContactDialogProps>) {
  const labels = useMemo(
    () => resolveContactDialogLabels(labelsProp),
    [labelsProp],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useContactDraft(() => ({
    company: null as string | null,
    documents,
    emails: [] as readonly string[],
    name: '',
    phones: [] as readonly string[],
    role: null as string | null,
    stage: 'none' as ContactDialogStage,
    tags: [] as readonly ContactDialogTag[],
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)
  const [createdRoles, setCreatedRoles] = useState<string[]>([])
  const [createdCompanies, setCreatedCompanies] = useState<string[]>([])
  const [visible, setVisible] = useState<ReadonlySet<OptionalProperty>>(
    new Set(),
  )

  const reset = () => {
    resetDraft()
    setErrorMessage(null)
    setVisible(new Set())
  }

  const setPropertyVisible = (key: OptionalProperty, shown: boolean) =>
    setVisible((current) => {
      const next = new Set(current)
      if (shown) next.add(key)
      else next.delete(key)
      return next
    })

  const phone = (
    <PhoneProperty
      ariaLabel={labels.phone.add}
      display="trigger"
      labels={labels.phone}
      onValueChange={(phones) => update({ phones })}
      placeholder="Telefone"
      value={draft.phones}
      variant="badge"
    />
  )
  const email = (
    <EmailProperty
      ariaLabel={labels.email.add}
      display="trigger"
      labels={labels.email}
      onValueChange={(emails) => update({ emails })}
      placeholder="E-mail"
      value={draft.emails}
      variant="badge"
    />
  )
  const document = (
    <ContactDocumentProperty
      ariaLabel={labels.document}
      className={
        layout === 'inline'
          ? 'inline-flex w-auto flex-wrap items-center gap-1'
          : 'flex flex-wrap items-center gap-1'
      }
      onValueChange={(next) => update({ documents: next })}
      placeholder={labels.documentPlaceholder}
      value={draft.documents}
      variant="badge"
    />
  )
  const stage = visible.has('stage') ? (
    <SelectProperty
      ariaLabel={labels.stage}
      onValueChange={(value) => {
        if (value && isContactDialogStage(value)) update({ stage: value })
      }}
      options={contactStageOptions}
      value={draft.stage}
      variant="badge"
    />
  ) : null
  const tags = visible.has('tags') ? (
    <TagsProperty<ContactDialogTag>
      ariaLabel={labels.tags.add}
      display="count"
      labels={labels.tags}
      onValueChange={(value) =>
        update({ tags: value.filter(isContactDialogTag) })
      }
      options={contactTagOptions}
      placeholder={labels.tagsPlaceholder}
      value={draft.tags}
      variant="badge"
    />
  ) : null
  const company = visible.has('company') ? (
    <CreatableProperty
      ariaLabel="Empresa"
      icon={BuildingsIcon}
      items={uniqueSorted([...companies, ...createdCompanies])}
      labels={labels.company}
      onCreate={(created) => {
        setCreatedCompanies((current) => [...current, created])
        update({ company: created })
      }}
      onValueChange={(next) => update({ company: next })}
      value={draft.company}
    />
  ) : null
  const role = visible.has('role') ? (
    <CreatableProperty
      ariaLabel="Cargo"
      icon={BriefcaseIcon}
      items={uniqueSorted([...roles, ...createdRoles])}
      labels={labels.role}
      onCreate={(created) => {
        setCreatedRoles((current) => [...current, created])
        update({ role: created })
      }}
      onValueChange={(next) => update({ role: next })}
      value={draft.role}
    />
  ) : null
  const more = (
    <Menu>
      <MenuTrigger
        aria-label={labels.more}
        render={
          <PropertySurface
            muted
            render={<button type="button" />}
            variant="badge"
          />
        }
      >
        <DotsThreeIcon aria-hidden className="size-3.5" />
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
  )

  const row = (label: string, field: ReactNode) =>
    field ? <RecordGroupRow label={label}>{field}</RecordGroupRow> : null

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      className={className}
      errorMessage={errorMessage}
      footerStart={
        <RecordDialogCreateMore
          checked={createMore}
          label={labels.createMore}
          onCheckedChange={setCreateMore}
        />
      }
      keepOpenOnSuccess={createMore}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          reset()
          setCreatedCompanies([])
          setCreatedRoles([])
        }
      }}
      onSubmit={async (event) => {
        const values = latest.current
        const description = String(
          new FormData(event.currentTarget).get('description') ?? '',
        ).trim()
        if (values.name.trim() === '') return false
        const parsed: ContactDialogValues = {
          company: values.company ?? '',
          description,
          documents: values.documents.flatMap((value) => {
            const kind = contactDocumentKind(value)
            return kind ? [{ kind, value }] : []
          }),
          emails: values.emails,
          name: values.name.trim(),
          phones: values.phones,
          role: values.role ?? '',
          stage: values.stage,
          tags: values.tags,
        }
        try {
          await onCreate(parsed)
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : labels.saveFailed,
          )
          return false
        }
        if (createMore) reset()
        return true
      }}
      open={open}
      submitDisabled={draft.name.trim() === ''}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={labels.title}
      titleAncestor={labels.titleAncestor}
    >
      <div
        className={layout === 'inline' ? 'flex flex-col gap-3' : 'grid gap-4'}
      >
        <RecordDialogHeadline
          descriptionLabel={labels.description}
          descriptionPlaceholder={labels.descriptionPlaceholder}
          descriptionSize={layout === 'rows' ? 'stretch' : 'content'}
          onTitleChange={(name) => update({ name })}
          title={draft.name}
          titleLabel={labels.name}
          titlePlaceholder={labels.namePlaceholder}
        />
        {layout === 'inline' ? (
          <div className="flex flex-wrap items-center gap-2">
            {phone}
            {email}
            {document}
            {stage}
            {tags}
            {company}
            {role}
            {more}
          </div>
        ) : (
          <div>
            {row(labels.phone.add, phone)}
            {row(labels.email.add, email)}
            {row(labels.document, document)}
            {row(labels.stage, stage)}
            {row(labels.tags.add, tags)}
            {row('Empresa', company)}
            {row('Cargo', role)}
            {row(labels.more, more)}
          </div>
        )}
      </div>
    </RecordDialog>
  )
}
