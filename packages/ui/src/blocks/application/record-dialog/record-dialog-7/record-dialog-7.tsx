import {
  ArrowsOutSimpleIcon,
  DotsThreeIcon,
  GitBranchIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import { PersonProperty } from '@tc96/ui/patterns/properties/display/person/person-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { PropertySurface } from '@tc96/ui/patterns/properties/shared/property-surface'
import { RecordDialog } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog'
import { RecordDialogCreateMore } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-create-more'
import { RecordDialogHeadline } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-headline'
import { RecordDialogInlineShell } from '@tc96/ui/patterns/records/dialog/composition/record-dialog/record-dialog-shells'
import { useMemo, useState } from 'react'
import { resolveRecordDialog7Labels } from './labels'
import {
  createRecordDialog7PriorityOptions,
  createRecordDialog7StatusOptions,
  recordDialog7ReposLabel,
} from './options'
import type {
  RecordDialog7DateField,
  RecordDialog7Props,
  RecordDialog7Values,
} from './types'
import { useRecordDialog7Draft } from './use-record-dialog-7-draft'

const dateFields: readonly RecordDialog7DateField[] = [
  'startDate',
  'targetDate',
]

export function RecordDialog7({
  className,
  labels: labelsProp,
  onCreate,
  onOpenAsPage,
  onOpenChange,
  open,
  people,
  priorityOptions: priorityOptionsProp,
  repos,
  statusOptions: statusOptionsProp,
}: Readonly<RecordDialog7Props>) {
  const labels = useMemo(
    () => resolveRecordDialog7Labels(labelsProp),
    [labelsProp],
  )
  const statusOptions = useMemo(
    () => statusOptionsProp ?? createRecordDialog7StatusOptions(labels),
    [labels, statusOptionsProp],
  )
  const priorityOptions = useMemo(
    () => priorityOptionsProp ?? createRecordDialog7PriorityOptions(labels),
    [labels, priorityOptionsProp],
  )
  const {
    draft,
    latest,
    reset: resetDraft,
    update,
  } = useRecordDialog7Draft(() => ({
    lead: null as string | null,
    priority: 'none',
    repos: [] as readonly string[],
    shownDates: [] as readonly RecordDialog7DateField[],
    startDate: null as string | null,
    status: 'planned',
    targetDate: null as string | null,
    title: '',
  }))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createMore, setCreateMore] = useState(false)
  const dateLabels = {
    startDate: labels.startDate,
    targetDate: labels.targetDate,
  }

  const reset = () => {
    resetDraft()
    setErrorMessage(null)
  }

  return (
    <RecordDialog
      actions={
        onOpenAsPage ? (
          <Button
            aria-label={labels.openAsPage}
            onClick={onOpenAsPage}
            size="icon"
            variant="ghost"
          >
            <ArrowsOutSimpleIcon aria-hidden />
          </Button>
        ) : undefined
      }
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
        const { shownDates: _shownDates, ...values } = latest.current
        const parsed: RecordDialog7Values = {
          ...values,
          description: String(data.get('description') ?? '').trim(),
          repos: [...values.repos],
          title: values.title.trim(),
        }
        if (parsed.title === '') return false
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
      stretchBody
      submitDisabled={draft.title.trim() === ''}
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
            onTitleChange={(title) => update({ title })}
            title={draft.title}
            titleLabel={labels.titleLabel}
            titlePlaceholder={labels.titlePlaceholder}
          />
        }
      >
        <SelectProperty
          ariaLabel={labels.status}
          onValueChange={(value) => update({ status: value ?? 'planned' })}
          options={statusOptions}
          value={draft.status}
        />
        <SelectProperty
          ariaLabel={labels.priority}
          onValueChange={(value) => update({ priority: value ?? 'none' })}
          options={priorityOptions}
          value={draft.priority}
        />
        <PersonProperty
          ariaLabel={labels.lead}
          onValueChange={(lead) => update({ lead })}
          options={people}
          placeholder={labels.lead}
          value={draft.lead}
        />
        <Menu>
          <MenuTrigger
            render={
              <PropertySurface
                muted={draft.repos.length === 0}
                render={<button type="button" />}
              />
            }
          >
            <GitBranchIcon aria-hidden />
            {recordDialog7ReposLabel(draft.repos, labels.repos)}
          </MenuTrigger>
          <MenuPopup align="start">
            {repos.map((repo) => (
              <MenuCheckboxItem
                checked={draft.repos.includes(repo)}
                key={repo}
                onCheckedChange={(checked) =>
                  update({
                    repos: checked
                      ? [...draft.repos, repo]
                      : draft.repos.filter((item) => item !== repo),
                  })
                }
              >
                {repo}
              </MenuCheckboxItem>
            ))}
          </MenuPopup>
        </Menu>
        {dateFields
          .filter((field) => draft.shownDates.includes(field))
          .map((field) => (
            <DateProperty
              ariaLabel={dateLabels[field]}
              key={field}
              labels={{ ...labels.date, fallback: dateLabels[field] }}
              onValueChange={(value) => update({ [field]: value })}
              value={draft[field]}
            />
          ))}
        <Menu>
          <MenuTrigger
            render={
              <PropertySurface
                aria-label={labels.moreProperties}
                muted
                render={<button type="button" />}
              />
            }
          >
            <DotsThreeIcon aria-hidden />
          </MenuTrigger>
          <MenuPopup align="start">
            {dateFields
              .filter((field) => !draft.shownDates.includes(field))
              .map((field) => (
                <MenuItem
                  key={field}
                  onClick={() =>
                    update({ shownDates: [...draft.shownDates, field] })
                  }
                >
                  {dateLabels[field]}
                </MenuItem>
              ))}
          </MenuPopup>
        </Menu>
      </RecordDialogInlineShell>
    </RecordDialog>
  )
}
