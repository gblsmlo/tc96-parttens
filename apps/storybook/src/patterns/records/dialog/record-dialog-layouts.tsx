import { ArrowsOutSimpleIcon, GitBranchIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  PersonProperty,
  RecordDialog,
  RecordDialogBarShell,
  RecordDialogCreateMore,
  RecordDialogHeadline,
  RecordDialogInlineShell,
  type RecordDialogProps,
  RecordDialogRowShell,
  RecordGroupRow,
  RichTextEditor,
  SelectProperty,
  TextProperty,
} from '@tc96/ui/patterns'
import { type ReactNode, useState } from 'react'
import { sleep } from '../../../test-utils/sleep'
import { ptBRPropertyLabels } from '../../properties/properties-labels.ts'
import { people, priorityOptions, statusOptions } from './project-record'
import type { RecordDialogControls } from './record-dialog-controls.ts'

export interface ComposedRecordDialogProps extends RecordDialogControls {
  children?: ReactNode
  defaultOpen?: boolean
  descriptionMinHeight?: boolean
  keepOpenOnSuccess?: boolean
  onCreateMoreChange?: (checked: boolean) => void
  onOpenAsPage?: () => void
  onOpenChange?: (open: boolean) => void
  onSubmit?: RecordDialogProps['onSubmit']
  onTitleChange?: (title: string) => void
  open?: boolean
  step?: string
}

const ProjectPropertyBar = () => {
  const [lead, setLead] = useState<string | null>(null)
  const [priority, setPriority] = useState('none')
  const [status, setStatus] = useState('planned')

  return (
    <>
      <SelectProperty
        ariaLabel="Status"
        onValueChange={(value) => setStatus(value ?? 'planned')}
        options={statusOptions}
        value={status}
        variant="plain"
      />
      <SelectProperty
        ariaLabel="Priority"
        onValueChange={(value) => setPriority(value ?? 'none')}
        options={priorityOptions}
        value={priority}
        variant="plain"
      />
      <PersonProperty
        ariaLabel="Lead"
        onValueChange={setLead}
        options={people}
        placeholder="Lead"
        value={lead}
        variant="plain"
      />
    </>
  )
}

export const ComposedRecordDialog = ({
  actions,
  bodyWidth,
  cancelLabel,
  children,
  createMore,
  defaultOpen = true,
  description,
  descriptionMinHeight,
  errorMessage,
  headline,
  headlineDescription,
  keepOpenOnSuccess,
  onCreateMoreChange,
  onOpenAsPage,
  onOpenChange,
  onSubmit,
  onTitleChange,
  open: controlledOpen,
  properties,
  size,
  step,
  stretchBody,
  submitDisabled,
  submitHint,
  submitLabel,
  submitOnModEnter,
  submittingLabel,
  title,
  titleAncestor,
  trigger,
}: Readonly<ComposedRecordDialogProps>) => {
  const [open, setOpen] = useState(defaultOpen)
  const [recordTitle, setRecordTitle] = useState('')
  const [keepOpen, setKeepOpen] = useState(false)

  const save = async () => {
    await sleep(1000)
    if (keepOpen) setRecordTitle('')
    return true
  }

  const headlineField = headline ? (
    <RecordDialogHeadline
      descriptionLabel={headlineDescription ? 'Description' : undefined}
      descriptionMinHeight={descriptionMinHeight}
      descriptionPlaceholder="Add description..."
      onTitleChange={(next) => {
        setRecordTitle(next)
        onTitleChange?.(next)
      }}
      title={recordTitle}
      titleLabel="Project title"
      titlePlaceholder="Project title"
    />
  ) : null
  const body =
    headlineField || children ? (
      <>
        {headlineField}
        {children}
      </>
    ) : null

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {trigger}
      </Button>
      <RecordDialog
        actions={
          actions ? (
            <Button
              aria-label="Open as page"
              onClick={onOpenAsPage}
              size="icon"
              variant="ghost"
            >
              <ArrowsOutSimpleIcon aria-hidden />
            </Button>
          ) : undefined
        }
        bodyWidth={bodyWidth}
        cancelLabel={cancelLabel || undefined}
        description={description || undefined}
        errorMessage={errorMessage || undefined}
        footerStart={
          createMore ? (
            <RecordDialogCreateMore
              checked={keepOpen}
              label="Create more"
              onCheckedChange={(checked) => {
                setKeepOpen(checked)
                onCreateMoreChange?.(checked)
              }}
            />
          ) : undefined
        }
        keepOpenOnSuccess={keepOpenOnSuccess ?? (createMore && keepOpen)}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setRecordTitle('')
          onOpenChange?.(next)
        }}
        onSubmit={onSubmit ?? save}
        open={controlledOpen ?? open}
        properties={properties ? <ProjectPropertyBar /> : undefined}
        size={size}
        step={step}
        stretchBody={stretchBody}
        submitDisabled={submitDisabled}
        submitHint={submitHint || undefined}
        submitLabel={submitLabel}
        submitOnModEnter={submitOnModEnter}
        submittingLabel={submittingLabel || undefined}
        title={title}
        titleAncestor={titleAncestor || undefined}
      >
        {body}
      </RecordDialog>
    </>
  )
}

export interface ProjectDraft {
  lead: string | null
  priority: string
  repository: string | null
  status: string
  title: string
}

interface FormationProps {
  onChange?: (patch: Partial<ProjectDraft>) => void
}

const useProjectProperties = (onChange?: FormationProps['onChange']) => {
  const [draft, setDraft] = useState<ProjectDraft>({
    lead: null,
    priority: 'none',
    repository: null,
    status: 'planned',
    title: '',
  })

  const update = (patch: Partial<ProjectDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
    onChange?.(patch)
  }

  const status = (
    <SelectProperty
      ariaLabel="Status"
      onValueChange={(value) => update({ status: value ?? 'planned' })}
      options={statusOptions}
      value={draft.status}
    />
  )
  const priority = (
    <SelectProperty
      ariaLabel="Priority"
      onValueChange={(value) => update({ priority: value ?? 'none' })}
      options={priorityOptions}
      value={draft.priority}
    />
  )
  const lead = (
    <PersonProperty
      ariaLabel="Lead"
      onValueChange={(value) => update({ lead: value })}
      options={people}
      placeholder="Lead"
      value={draft.lead}
    />
  )
  const repository = (
    <TextProperty
      ariaLabel="Repository"
      editing="inline"
      icon={GitBranchIcon}
      onCommit={(value) => update({ repository: value })}
      value={draft.repository}
      labels={{ ...ptBRPropertyLabels.text, fallback: 'Add repository' }}
    />
  )

  return { lead, priority, repository, status }
}

export const InlinePropertiesFormation = ({
  onChange,
}: Readonly<FormationProps>) => {
  const { lead, priority, status } = useProjectProperties(onChange)

  return (
    <RecordDialogInlineShell>
      {status}
      {priority}
      {lead}
    </RecordDialogInlineShell>
  )
}

export const RowPropertiesFormation = ({
  onChange,
}: Readonly<FormationProps>) => {
  const { lead, priority, repository, status } = useProjectProperties(onChange)

  return (
    <RecordDialogRowShell>
      <RecordGroupRow label="Status">{status}</RecordGroupRow>
      <RecordGroupRow label="Priority">{priority}</RecordGroupRow>
      <RecordGroupRow label="Lead">{lead}</RecordGroupRow>
      <RecordGroupRow label="Repository">{repository}</RecordGroupRow>
    </RecordDialogRowShell>
  )
}

export const PropertyBarOverBodyFormation = () => (
  <RecordDialogBarShell bar={<ProjectPropertyBar />}>
    <RichTextEditor aria-label="Project brief" placeholder="Write the brief" />
  </RecordDialogBarShell>
)

export const DescriptionOverBodyFormation = ({
  onChange,
}: Readonly<FormationProps>) => {
  const { lead, priority, repository, status } = useProjectProperties(onChange)

  return (
    <div>
      <RecordGroupRow label="Status">{status}</RecordGroupRow>
      <RecordGroupRow label="Priority">{priority}</RecordGroupRow>
      <RecordGroupRow label="Lead">{lead}</RecordGroupRow>
      <RecordGroupRow label="Repository">{repository}</RecordGroupRow>
    </div>
  )
}
