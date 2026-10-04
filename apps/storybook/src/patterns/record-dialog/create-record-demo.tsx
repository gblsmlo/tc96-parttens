import {
  DateProperty,
  PersonProperty,
  PropertySurface,
  RecordDialog,
  SelectProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import { Textarea } from '@tc96/ui/textarea'
import { EllipsisIcon, GitBranchIcon, Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import { delay } from './card-record-dialog'
import { CreateMoreSwitch } from './create-more'
import {
  extraProperties,
  type ProjectValues,
  people,
  priorityOptions,
  projectSchema,
  repos,
  reposLabel,
  statusOptions,
} from './project-record'

export function CreateRecordDemo({
  onCreate,
  onOpenSingle,
}: Readonly<{
  onCreate: (values: ProjectValues) => void
  onOpenSingle: () => void
}>) {
  const [open, setOpen] = useState(true)
  const [createMore, setCreateMore] = useState(false)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('planned')
  const [priority, setPriority] = useState('none')
  const [lead, setLead] = useState<string | null>(null)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [dates, setDates] = useState<
    Record<'startDate' | 'targetDate', string | null | undefined>
  >({ startDate: undefined, targetDate: undefined })

  const reset = () => {
    setTitle('')
    setStatus('planned')
    setPriority('none')
    setLead(null)
    setSelectedRepos([])
    setDates({ startDate: undefined, targetDate: undefined })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open dialog
      </Button>
      <RecordDialog
        actions={
          <Button
            aria-label="Open as page"
            onClick={onOpenSingle}
            size="icon"
            variant="ghost"
          >
            <Maximize2Icon aria-hidden />
          </Button>
        }
        footerStart={
          <CreateMoreSwitch
            checked={createMore}
            onCheckedChange={setCreateMore}
          />
        }
        keepOpenOnSuccess={createMore}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) reset()
        }}
        onSubmit={async (event) => {
          const data = new FormData(event.currentTarget)
          const parsed = projectSchema.safeParse({
            description: String(data.get('description') ?? ''),
            lead,
            priority,
            repos: selectedRepos,
            startDate: dates.startDate ?? null,
            status,
            targetDate: dates.targetDate ?? null,
            title,
          })
          if (!parsed.success) return false
          await delay(150)
          onCreate(parsed.data)
          if (createMore) reset()
          return true
        }}
        open={open}
        stretchBody
        submitDisabled={title.trim() === ''}
        submitLabel="Create Project"
        submitOnModEnter
        submittingLabel="Creating"
        title="New project"
        titleAncestor="Lemind"
      >
        <div className="flex flex-1 flex-col gap-3">
          <Field name="title">
            <FieldLabel className="sr-only">Project title</FieldLabel>
            <Input
              autoFocus
              className="w-full font-semibold text-lg [&_input]:px-0 [&_input]:placeholder:text-muted-foreground/60 [&_input]:focus:placeholder:text-muted-foreground"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Project title"
              unstyled
              value={title}
            />
          </Field>
          <Field className="flex-1" name="description">
            <FieldLabel className="sr-only">Description</FieldLabel>
            <Textarea
              className="w-full flex-1 [&_textarea]:min-h-24 [&_textarea]:resize-none [&_textarea]:px-0 [&_textarea]:placeholder:text-muted-foreground/60 [&_textarea]:focus:placeholder:text-muted-foreground"
              placeholder="Add description..."
              unstyled
            />
          </Field>
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <SelectProperty
              ariaLabel="Status"
              onValueChange={(value) => setStatus(value ?? 'planned')}
              options={statusOptions}
              value={status}
            />
            <SelectProperty
              ariaLabel="Priority"
              onValueChange={(value) => setPriority(value ?? 'none')}
              options={priorityOptions}
              value={priority}
            />
            <PersonProperty
              ariaLabel="Lead"
              onValueChange={setLead}
              options={people}
              placeholder="Lead"
              value={lead}
            />
            <Menu>
              <MenuTrigger
                render={
                  <PropertySurface
                    muted={selectedRepos.length === 0}
                    render={<button type="button" />}
                  />
                }
              >
                <GitBranchIcon aria-hidden className="size-3.5" />
                {reposLabel(selectedRepos)}
              </MenuTrigger>
              <MenuPopup align="start">
                {repos.map((repo) => (
                  <MenuCheckboxItem
                    checked={selectedRepos.includes(repo)}
                    key={repo}
                    onCheckedChange={(checked) =>
                      setSelectedRepos((current) =>
                        checked
                          ? [...current, repo]
                          : current.filter((item) => item !== repo),
                      )
                    }
                  >
                    {repo}
                  </MenuCheckboxItem>
                ))}
              </MenuPopup>
            </Menu>
            {extraProperties
              .filter(({ id }) => dates[id] !== undefined)
              .map(({ id, label }) => (
                <DateProperty
                  ariaLabel={label}
                  fallback={label}
                  key={id}
                  onValueChange={(value) =>
                    setDates((current) => ({ ...current, [id]: value }))
                  }
                  value={dates[id] ?? null}
                />
              ))}
            <Menu>
              <MenuTrigger
                render={
                  <PropertySurface
                    aria-label="More properties"
                    muted
                    render={<button type="button" />}
                  />
                }
              >
                <EllipsisIcon aria-hidden className="size-3.5" />
              </MenuTrigger>
              <MenuPopup align="start">
                {extraProperties
                  .filter(({ id }) => dates[id] === undefined)
                  .map(({ id, label }) => (
                    <MenuItem
                      key={id}
                      onClick={() =>
                        setDates((current) => ({ ...current, [id]: null }))
                      }
                    >
                      {label}
                    </MenuItem>
                  ))}
              </MenuPopup>
            </Menu>
          </div>
        </div>
      </RecordDialog>
    </>
  )
}
