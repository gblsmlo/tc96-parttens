import {
  PersonProperty,
  RecordGroup,
  RecordGroupItem,
  RecordGroupRow,
  SelectProperty,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Skeleton } from '@tc96/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import { Undo2Icon, XIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { personOptions } from '../../collection/fixtures/task-fields'
import {
  contractOptions,
  fieldLabels,
  type ImportSource,
  instanceOptions,
  isProcessPole,
  lawyerRoleLabels,
  type PoleLawyer,
  type ProcessField,
  type ProcessPole,
  phaseOptions,
  poleOptions,
  sourceFields,
} from './process-record'
import type { ImportStatusMap, ProcessDraftState } from './use-process-import'

const isSourceLoading = (status: ImportStatusMap[ImportSource]) =>
  status === 'loading' || status === 'idle'

const sourceLabels = (source: ImportSource) =>
  sourceFields[source].map((field) => fieldLabels[field])

function SourceContent({
  children,
  labels,
  status,
}: Readonly<{
  children: ReactNode
  labels: readonly string[]
  status: ImportStatusMap[ImportSource]
}>) {
  if (isSourceLoading(status)) {
    return labels.map((label) => (
      <RecordGroupRow key={label} label={label}>
        <Skeleton aria-hidden className="h-5 w-40" />
      </RecordGroupRow>
    ))
  }
  return children
}

function PoleToggle({
  name,
  onPoleChange,
  pole,
}: Readonly<{
  name: string
  onPoleChange: (pole: ProcessPole) => void
  pole: ProcessPole
}>) {
  return (
    <ToggleGroup
      aria-label={`Polo de ${name}`}
      onValueChange={([value]) => {
        if (value && isProcessPole(value)) onPoleChange(value)
      }}
      size="sm"
      value={[pole]}
      variant="outline"
    >
      {poleOptions.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function LawyerItems({
  lawyers,
}: Readonly<{ lawyers: readonly PoleLawyer[] }>) {
  return lawyers.map((lawyer) => (
    <RecordGroupItem
      key={`${lawyer.pole}:${lawyer.oab}`}
      title={
        <>
          {lawyer.name}{' '}
          <span className="text-muted-foreground tabular-nums">
            OAB {lawyer.oab}
          </span>
        </>
      }
    >
      <span className="text-muted-foreground">
        {lawyerRoleLabels[lawyer.pole]}
      </span>
    </RecordGroupItem>
  ))
}

function PhaseRow({
  onValueChange,
  value,
}: Readonly<{
  onValueChange: (value: string | null) => void
  value: string | null
}>) {
  return (
    <RecordGroupRow label={fieldLabels.phase}>
      <SelectProperty
        ariaLabel={fieldLabels.phase}
        onValueChange={(next) => onValueChange(next || null)}
        options={phaseOptions}
        placeholder="Adicionar fase"
        value={value}
      />
    </RecordGroupRow>
  )
}

function OfficeGroup({
  contractId,
  onContractChange,
  onOwnerChange,
  ownerId,
}: Readonly<{
  contractId: string | null
  onContractChange: (value: string | null) => void
  onOwnerChange: (value: string | null) => void
  ownerId: string | null
}>) {
  return (
    <RecordGroup title="Escritório" variant="card">
      <RecordGroupRow label={fieldLabels.ownerId}>
        <PersonProperty
          ariaLabel={fieldLabels.ownerId}
          dropdownPlacement={{ align: 'start' }}
          onValueChange={onOwnerChange}
          options={personOptions}
          value={ownerId}
        />
      </RecordGroupRow>
      <RecordGroupRow label={fieldLabels.contractId}>
        <SelectProperty
          ariaLabel={fieldLabels.contractId}
          onValueChange={(value) => onContractChange(value || null)}
          options={contractOptions}
          placeholder="Vincular contrato"
          value={contractId}
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}

function ImportedRow({
  children,
  draft,
  field,
}: Readonly<{
  children: ReactNode
  draft: ProcessDraftState
  field: ProcessField
}>) {
  return (
    <RecordGroupRow label={fieldLabels[field]}>
      {children}
      {draft.isEdited(field) && (
        <Button
          aria-label={`Restaurar ${fieldLabels[field]} importado`}
          onClick={() => draft.restoreField(field)}
          size="icon-xs"
          title="Restaurar valor importado"
          variant="ghost"
        >
          <Undo2Icon aria-hidden />
        </Button>
      )}
    </RecordGroupRow>
  )
}

function TextRow({
  draft,
  fallback,
  field,
}: Readonly<{
  draft: ProcessDraftState
  fallback: string
  field: ProcessField
}>) {
  return (
    <ImportedRow draft={draft} field={field}>
      <TextProperty
        ariaLabel={fieldLabels[field]}
        editing="inline"
        fallback={fallback}
        onCommit={(value) => draft.setField(field, value)}
        value={draft.fields[field]}
      />
    </ImportedRow>
  )
}

interface GroupProps {
  draft: ProcessDraftState
  status: ImportStatusMap
}

function PartiesGroup({ draft, status }: Readonly<GroupProps>) {
  const hasSuspected = draft.parties.some((party) => party.suspectedLawyer)

  return (
    <RecordGroup
      actions={
        hasSuspected ? (
          <Button
            onClick={draft.moveSuspectedLawyers}
            size="xs"
            variant="ghost"
          >
            Mover para advogados
          </Button>
        ) : null
      }
      defaultOpen={false}
      title="Partes"
      variant="card"
    >
      <SourceContent labels={['Autor', 'Réu']} status={status.djen}>
        {draft.parties.map((party) => (
          <RecordGroupItem key={party.id} title={party.name}>
            <PoleToggle
              name={party.name}
              onPoleChange={(pole) => draft.setPole(party.id, pole)}
              pole={party.pole}
            />
            <Button
              aria-label={`Remover ${party.name}`}
              onClick={() => draft.removeParty(party.id)}
              size="icon-xs"
              variant="ghost"
            >
              <XIcon aria-hidden />
            </Button>
          </RecordGroupItem>
        ))}
        <LawyerItems lawyers={draft.lawyers} />
      </SourceContent>
    </RecordGroup>
  )
}

export function ProcessSections({ draft, status }: Readonly<GroupProps>) {
  return (
    <div className="grid gap-3">
      <RecordGroup title="Identificação" variant="card">
        <SourceContent labels={sourceLabels('datajud')} status={status.datajud}>
          <TextRow
            draft={draft}
            fallback="Adicionar classe"
            field="className"
          />
          <TextRow draft={draft} fallback="Adicionar ação" field="action" />
          <TextRow draft={draft} fallback="Adicionar objeto" field="subject" />
        </SourceContent>
        <PhaseRow
          onValueChange={(value) => draft.setField('phase', value)}
          value={draft.fields.phase}
        />
      </RecordGroup>
      <RecordGroup title="Órgão" variant="card">
        <SourceContent labels={sourceLabels('court')} status={status.court}>
          <TextRow draft={draft} fallback="Adicionar tribunal" field="court" />
          <TextRow draft={draft} fallback="Adicionar foro" field="forum" />
          <TextRow draft={draft} fallback="Adicionar vara" field="division" />
          <ImportedRow draft={draft} field="instance">
            <SelectProperty
              ariaLabel={fieldLabels.instance}
              onValueChange={(value) =>
                draft.setField('instance', value || null)
              }
              options={instanceOptions}
              placeholder="Adicionar instância"
              value={draft.fields.instance}
            />
          </ImportedRow>
        </SourceContent>
      </RecordGroup>
      <PartiesGroup draft={draft} status={status} />
      <OfficeGroup
        contractId={draft.fields.contractId}
        onContractChange={(value) => draft.setField('contractId', value)}
        onOwnerChange={(value) => draft.setField('ownerId', value)}
        ownerId={draft.fields.ownerId}
      />
    </div>
  )
}
