import {
  PersonProperty,
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
  RecordGroupRow,
  SelectProperty,
} from '@tc96/parttens'
import { useState } from 'react'
import { personOptions } from '../../collection/fixtures/task-fields'
import { delay } from './delay'
import {
  isLeadNextAction,
  isLeadSource,
  isLeadStage,
  type LeadNextAction,
  type LeadSource,
  type LeadStage,
  leadNextActionOptions,
  leadSourceOptions,
  leadStageOptions,
  type NewLead,
} from './lead-record'

export function LeadDialog({
  onCreate,
  onOpenChange,
  open,
}: Readonly<{
  onCreate: (lead: NewLead) => void
  onOpenChange: (open: boolean) => void
  open: boolean
}>) {
  const [createMore, setCreateMore] = useState(false)
  const [title, setTitle] = useState('')
  const [stage, setStage] = useState<LeadStage>('new')
  const [source, setSource] = useState<LeadSource | null>(null)
  const [ownerId, setOwnerId] = useState<string | null>(null)
  const [nextAction, setNextAction] = useState<LeadNextAction | null>(null)

  const reset = () => {
    setTitle('')
    setStage('new')
    setSource(null)
    setOwnerId(null)
    setNextAction(null)
  }

  return (
    <RecordDialog
      footerStart={
        <RecordDialogCreateMore
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
        const trimmedTitle = title.trim()
        if (trimmedTitle === '') return false
        await delay(150)
        onCreate({
          description,
          nextAction,
          ownerId,
          source,
          stage,
          title: trimmedTitle,
        })
        if (createMore) reset()
        return true
      }}
      open={open}
      submitDisabled={title.trim() === ''}
      submitLabel="Criar lead"
      submitOnModEnter
      submittingLabel="Criando"
      title="Novo lead"
      titleAncestor="Leads"
    >
      <div className="grid gap-4">
        <RecordDialogHeadline
          descriptionLabel="Descrição"
          descriptionPlaceholder="Adicionar descrição..."
          onTitleChange={setTitle}
          title={title}
          titleLabel="Título"
          titlePlaceholder="Título do lead"
        />
        <div>
          <RecordGroupRow label="Etapa">
            <SelectProperty
              ariaLabel="Etapa"
              onValueChange={(value) => {
                if (value && isLeadStage(value)) setStage(value)
              }}
              options={leadStageOptions}
              value={stage}
            />
          </RecordGroupRow>
          <RecordGroupRow label="Origem">
            <SelectProperty
              ariaLabel="Origem"
              onValueChange={(value) =>
                setSource(value && isLeadSource(value) ? value : null)
              }
              options={leadSourceOptions}
              placeholder="Adicionar origem"
              value={source}
            />
          </RecordGroupRow>
          <RecordGroupRow label="Responsável">
            <PersonProperty
              ariaLabel="Responsável"
              dropdownPlacement={{ align: 'start' }}
              onValueChange={setOwnerId}
              options={personOptions}
              value={ownerId}
            />
          </RecordGroupRow>
          <RecordGroupRow label="Próxima ação">
            <SelectProperty
              ariaLabel="Próxima ação"
              onValueChange={(value) =>
                setNextAction(value && isLeadNextAction(value) ? value : null)
              }
              options={leadNextActionOptions}
              placeholder="Adicionar próxima ação"
              value={nextAction}
            />
          </RecordGroupRow>
        </div>
      </div>
    </RecordDialog>
  )
}
