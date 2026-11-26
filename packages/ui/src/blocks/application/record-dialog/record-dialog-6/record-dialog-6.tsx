import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@tc96/ui/accordion'
import { Badge } from '@tc96/ui/badge'
import { IconFrame } from '@tc96/ui/icon-frame'
import { defaultPropertyLabels } from '@tc96/ui/patterns/properties/core'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TextProperty } from '@tc96/ui/patterns/properties/display/text/text-property'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordGroup } from '@tc96/ui/patterns/records/group/composition/record-group/record-group'
import { RecordGroupRow } from '@tc96/ui/patterns/records/group/composition/record-group-row/record-group-row'
import { Switch } from '@tc96/ui/switch'
import { useMemo, useState } from 'react'
import { resolveRecordDialog6Labels } from './labels'
import {
  type RecordDialog6Row,
  type RecordDialog6Section,
  recordDialog6Sections,
} from './sections'
import type {
  RecordDialog6FieldId,
  RecordDialog6Props,
  RecordDialog6Values,
} from './types'
import { recordDialog6Variants } from './variants'

const emptyValues: RecordDialog6Values = {
  action: null,
  contract: null,
  division: null,
  instance: null,
  monitor: false,
  number: null,
  owner: null,
  partyContact: null,
  partyName: null,
  partyRole: null,
  phase: null,
  subject: null,
  venue: null,
}

const sectionStatus = (
  section: RecordDialog6Section,
  values: RecordDialog6Values,
) => {
  const filled = section.rows.filter(
    ({ id }) => typeof values[id] === 'boolean' || Boolean(values[id]),
  ).length
  if (filled === section.rows.length) return 'done'
  if (filled > 0) return 'progress'
  return 'pending'
}

const statusBadge = {
  done: 'success',
  pending: 'secondary',
  progress: 'info',
} as const

export function RecordDialog6({
  className,
  clients,
  contractOptions,
  initialValues,
  instanceOptions,
  labels: labelsProp,
  onCreate,
  onOpenChange,
  open,
  owners,
  partyRoleOptions,
  phaseOptions,
}: Readonly<RecordDialog6Props>) {
  const labels = useMemo(
    () => resolveRecordDialog6Labels(labelsProp),
    [labelsProp],
  )
  const initial = useMemo<RecordDialog6Values>(
    () => ({
      ...emptyValues,
      instance: instanceOptions[0]?.value ?? null,
      monitor: true,
      ...initialValues,
    }),
    [initialValues, instanceOptions],
  )
  const [values, setValues] = useState(initial)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const update = (id: RecordDialog6FieldId, value: string | boolean | null) =>
    setValues((current) => ({ ...current, [id]: value }))
  const statusLabel = {
    done: labels.statusDone,
    pending: labels.statusPending,
    progress: labels.statusProgress,
  }

  const selectOptions = {
    contract: contractOptions,
    instance: instanceOptions,
    partyRole: partyRoleOptions,
    phase: phaseOptions,
  } as const
  const peopleOptions = { owner: owners, partyContact: clients } as const

  const control = (row: RecordDialog6Row) => {
    const text = labels.fields[row.id]
    const current = values[row.id]
    const value = typeof current === 'string' ? current : null
    if (row.control === 'toggle')
      return (
        <Switch
          aria-label={text.label}
          checked={current === true}
          onCheckedChange={(next) => update(row.id, next)}
        />
      )
    if (row.control === 'owner' || row.control === 'partyContact')
      return (
        <PersonProperty
          ariaLabel={text.label}
          onValueChange={(next) => update(row.id, next)}
          options={peopleOptions[row.control]}
          placeholder={text.fallback}
          value={value}
          variant="plain"
        />
      )
    if (row.control !== 'text')
      return (
        <SelectProperty
          ariaLabel={text.label}
          onValueChange={(next) => update(row.id, next)}
          options={selectOptions[row.control]}
          placeholder={text.fallback}
          value={value}
          variant="plain"
        />
      )
    return (
      <TextProperty
        ariaLabel={text.label}
        editing="inline"
        labels={{ ...defaultPropertyLabels.text, fallback: text.fallback }}
        onCommit={(next) => update(row.id, next)}
        value={value}
        variant="plain"
      />
    )
  }

  return (
    <RecordDialog
      cancelLabel={labels.cancel}
      className={className}
      description={labels.description}
      errorMessage={errorMessage}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setValues(initial)
          setErrorMessage(null)
        }
      }}
      onSubmit={async () => {
        setErrorMessage(null)
        try {
          await onCreate(values)
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : null)
          return false
        }
        return true
      }}
      open={open}
      submitLabel={labels.submit}
      submitOnModEnter
      submittingLabel={labels.submitting}
      title={labels.title}
      titleAncestor={labels.titleAncestor}
    >
      <Accordion defaultValue={[recordDialog6Sections[0]?.id]}>
        {recordDialog6Sections.map((section) => {
          const text = labels.sections[section.id]
          const status = sectionStatus(section, values)

          return (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger>
                <span className={recordDialog6Variants()}>
                  <IconFrame shape="rounded" size="sm">
                    <section.icon aria-hidden />
                  </IconFrame>
                  <span className={recordDialog6Variants({ part: 'title' })}>
                    <span>{text.title}</span>
                    <span
                      className={recordDialog6Variants({ part: 'description' })}
                    >
                      {text.description}
                    </span>
                  </span>
                  <Badge variant={statusBadge[status]}>
                    {statusLabel[status]}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionPanel>
                <RecordGroup
                  className={recordDialog6Variants({ part: 'group' })}
                  collapsible={false}
                >
                  {section.rows.map((row) => (
                    <RecordGroupRow
                      key={row.id}
                      label={labels.fields[row.id].label}
                      leading={<row.icon aria-hidden />}
                    >
                      {control(row)}
                    </RecordGroupRow>
                  ))}
                </RecordGroup>
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </RecordDialog>
  )
}
