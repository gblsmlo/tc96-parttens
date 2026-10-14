import {
  DateProperty,
  PersonProperty,
  PropertySurface,
  RecordDialog,
  SelectProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import { EllipsisIcon, GitBranchIcon, Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import { CreateMoreSwitch } from './create-more'
import { delay } from './delay'
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
import { RecordHeadline } from './record-headline'

export function CreateRecordDemo({
  onCreate,
  onOpenSingle,
}: Readonly<{
  onCreate: (values: ProjectValues) => void | Promise<void>
  onOpenSingle: () => void
}>) {
  const [open, setOpen] = useState(true)
  const [createMore, setCreateMore] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('planned')
  const [priority, setPriority] = useState('none')
  const [lead, setLead] = useState<string | null>(null)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [dates, setDates] = useState<
    Record<'startDate' | 'targetDate', string | null | undefined>
  >({ startDate: undefined, targetDate: undefined })

  const reset = () => {
    setErrorMessage(null)
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
        errorMessage={errorMessage}
        keepOpenOnSuccess={createMore}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) reset()
        }}
        onSubmit={async (event) => {
          setErrorMessage(null)
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
          try {
            await onCreate(parsed.data)
          } catch (error) {
            setErrorMessage(
              error instanceof Error ? error.message : 'Could not save.',
            )
            return false
          }
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
          <RecordHeadline
            descriptionLabel="Description"
            descriptionPlaceholder="Add description..."
            onTitleChange={setTitle}
            stretch
            title={title}
            titleLabel="Project title"
            titlePlaceholder="Project title"
          />
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
