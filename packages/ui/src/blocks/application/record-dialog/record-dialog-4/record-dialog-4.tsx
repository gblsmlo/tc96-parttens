import {
  BriefcaseIcon,
  BuildingsIcon,
  DotsThreeIcon,
  FileTextIcon,
} from '@phosphor-icons/react'
import { Menu, MenuCheckboxItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import { EmailProperty } from '@tc96/ui/patterns/properties/display/email/email-property'
import { PhoneProperty } from '@tc96/ui/patterns/properties/display/phone/phone-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { PropertySurface } from '@tc96/ui/patterns/properties/shared/property-surface'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogCreateMore } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-create-more'
import { RecordDialogHeadline } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-headline'
import { RecordDialogInlineShell } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-shells'
import { useMemo, useState } from 'react'
import { CreatableProperty } from './creatable-property'
import { resolveRecordDialog4Labels } from './labels'
import {
  createRecordDialog4DocumentTypeOptions,
  createRecordDialog4StageOptions,
  defaultRecordDialog4TagOptions,
} from './options'
import type {
  RecordDialog4DocumentType,
  RecordDialog4OptionalProperty,
  RecordDialog4Props,
  RecordDialog4Stage,
  RecordDialog4Tag,
  RecordDialog4Values,
} from './types'
import { useRecordDialog4Draft } from './use-record-dialog-4-draft'

const uniqueSorted = (items: readonly string[]) =>
  [...new Set(items)].sort((a, b) => a.localeCompare(b, 'pt-BR'))

export function RecordDialog4({
  className,
  companies,
  documentTypeOptions: documentTypeOptionsProp,
  labels: labelsProp,
  onCreate,
  onOpenChange,
  open,
  roles,
  stageOptions: stageOptionsProp,
  tagOptions = defaultRecordDialog4TagOptions,
}: Readonly<RecordDialog4Props>) {
  const labels = useMemo(
    () => resolveRecordDialog4Labels(labelsProp),
    [labelsProp],
  )
  const stageOptions = useMemo(
    () => stageOptionsProp ?? createRecordDialog4StageOptions(labels),
    [labels, stageOptionsProp],
  )
  const documentTypeOptions = useMemo(
    () =>
      documentTypeOptionsProp ?? createRecordDialog4DocumentTypeOptions(labels),
    [documentTypeOptionsProp, labels],
  )
  const optionalProperties = useMemo(
    () =>
      [
        { key: 'stage', label: labels.stage },
        { key: 'tags', label: labels.tags },
        { key: 'company', label: labels.company },
        { key: 'role', label: labels.role },
      ] as const satisfies readonly {
        key: RecordDialog4OptionalProperty
        label: string
      }[],
    [labels],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useRecordDialog4Draft(() => ({
    company: null as string | null,
    document: null as string | null,
    documentType: null as RecordDialog4DocumentType | null,
    emails: [] as readonly string[],
    name: '',
    phones: [] as readonly string[],
    role: null as string | null,
    stage: 'none' as RecordDialog4Stage,
    tags: [] as readonly RecordDialog4Tag[],
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)
  const [createdCompanies, setCreatedCompanies] = useState<string[]>([])
  const [createdRoles, setCreatedRoles] = useState<string[]>([])
  const [visible, setVisible] = useState<
    ReadonlySet<RecordDialog4OptionalProperty>
  >(new Set())

  const reset = () => {
    resetDraft()
    setErrorMessage(null)
  }

  const setPropertyVisible = (
    key: RecordDialog4OptionalProperty,
    shown: boolean,
  ) =>
    setVisible((current) => {
      const next = new Set(current)
      if (shown) next.add(key)
      else next.delete(key)
      return next
    })

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
        if (!next) reset()
      }}
      onSubmit={async (event) => {
        setErrorMessage(null)
        const data = new FormData(event.currentTarget)
        const values = latest.current
        const parsed: RecordDialog4Values = {
          company: values.company ?? '',
          description: String(data.get('description') ?? '').trim(),
          document: values.document ?? undefined,
          documentType: values.documentType ?? undefined,
          emails: [...values.emails],
          name: values.name.trim(),
          phones: [...values.phones],
          role: values.role ?? '',
          stage: values.stage,
          tags: [...values.tags],
        }
        if (parsed.name === '') return false
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
      size="default"
      stretchBody
      submitDisabled={draft.name.trim() === ''}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={labels.titleText}
      titleAncestor={labels.titleAncestor}
    >
      <RecordDialogInlineShell
        headline={
          <RecordDialogHeadline
            descriptionLabel={labels.description}
            descriptionMinHeight
            descriptionPlaceholder={labels.descriptionPlaceholder}
            onTitleChange={(name) => update({ name })}
            title={draft.name}
            titleLabel={labels.name}
            titlePlaceholder={labels.namePlaceholder}
          />
        }
      >
        <PhoneProperty
          ariaLabel={labels.phone}
          display="trigger"
          labels={labels.phoneLabels}
          onValueChange={(phones) => update({ phones })}
          placeholder={labels.phonePlaceholder}
          value={draft.phones}
          variant="badge"
        />
        <EmailProperty
          ariaLabel={labels.email}
          display="trigger"
          labels={labels.emailLabels}
          onValueChange={(emails) => update({ emails })}
          placeholder={labels.emailPlaceholder}
          value={draft.emails}
          variant="badge"
        />
        <SelectProperty
          ariaLabel={labels.documentTypeLabel}
          onValueChange={(value) =>
            update({ documentType: value as RecordDialog4DocumentType | null })
          }
          options={documentTypeOptions}
          placeholder={labels.documentTypeLabel}
          value={draft.documentType}
        />
        <TextProperty
          ariaLabel={labels.document}
          icon={FileTextIcon}
          labels={{
            ...labels.text,
            add: labels.document,
            fallback: labels.document,
            inputPlaceholder:
              draft.documentType === 'cnpj'
                ? '00.000.000/0000-00'
                : '000.000.000-00',
          }}
          onCommit={(document) => update({ document })}
          value={draft.document}
        />
        {visible.has('stage') ? (
          <SelectProperty
            ariaLabel={labels.stage}
            onValueChange={(value) =>
              update({ stage: (value as RecordDialog4Stage | null) ?? 'none' })
            }
            options={stageOptions}
            value={draft.stage}
          />
        ) : null}
        {visible.has('tags') ? (
          <TagsProperty<RecordDialog4Tag>
            ariaLabel={labels.tags}
            display="count"
            labels={labels.tagsLabels}
            onValueChange={(tags) => update({ tags })}
            options={tagOptions}
            placeholder={labels.tagPlaceholder}
            value={draft.tags}
            variant="badge"
          />
        ) : null}
        {visible.has('company') ? (
          <CreatableProperty
            ariaLabel={labels.company}
            icon={BuildingsIcon}
            items={uniqueSorted([...companies, ...createdCompanies])}
            labels={labels.companyLabels}
            onCreate={(created) => {
              setCreatedCompanies((current) => [...current, created])
              update({ company: created })
            }}
            onValueChange={(company) => update({ company })}
            value={draft.company}
          />
        ) : null}
        {visible.has('role') ? (
          <CreatableProperty
            ariaLabel={labels.role}
            icon={BriefcaseIcon}
            items={uniqueSorted([...roles, ...createdRoles])}
            labels={labels.roleLabels}
            onCreate={(created) => {
              setCreatedRoles((current) => [...current, created])
              update({ role: created })
            }}
            onValueChange={(role) => update({ role })}
            value={draft.role}
          />
        ) : null}
        <Menu>
          <MenuTrigger
            aria-label={labels.morePropertiesLabel}
            render={<PropertySurface muted render={<button type="button" />} />}
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
      </RecordDialogInlineShell>
    </RecordDialog>
  )
}
