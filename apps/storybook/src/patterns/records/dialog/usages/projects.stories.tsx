import {
  ArrowsOutSimpleIcon,
  DotsThreeIcon,
  GitBranchIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  DateProperty,
  PersonProperty,
  PropertySurface,
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
  SelectProperty,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, fn, screen, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../../properties/properties-labels.ts'
import {
  extraProperties,
  type ProjectValues,
  people,
  priorityOptions,
  projectSchema,
  repos,
  reposLabel,
  statusOptions,
} from '../project-record'

interface ProjectsArgs {
  onCreate: (values: ProjectValues) => void | Promise<void>
  onOpenSingle: () => void
}

const meta = {
  args: {
    onCreate: fn(async (_values: ProjectValues) => {}),
    onOpenSingle: fn(),
  },
  render: function Projects({ onCreate, onOpenSingle }) {
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
              <ArrowsOutSimpleIcon aria-hidden />
            </Button>
          }
          footerStart={
            <RecordDialogCreateMore
              checked={createMore}
              label="Create more"
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
            <RecordDialogHeadline
              descriptionLabel="Description"
              descriptionPlaceholder="Add description..."
              onTitleChange={setTitle}
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
                    key={id}
                    onValueChange={(value) =>
                      setDates((current) => ({ ...current, [id]: value }))
                    }
                    value={dates[id] ?? null}
                    labels={{ ...ptBRPropertyLabels.date, fallback: label }}
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
                  <DotsThreeIcon aria-hidden className="size-3.5" />
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
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/RecordDialog/Usages',
} satisfies Meta<ProjectsArgs>

export default meta

type Story = StoryObj<ProjectsArgs>

export const Projects: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Quick capture of a project on the [Inline Properties](?path=/story/patterns-records-recorddialog-layouts--inline-properties) layout: a borderless title and description, and Status, Priority, Lead, Repos and the dates as chips pinned to the bottom. Open as page sits in `actions`, Create more in `footerStart`, and Mod+Enter submits.',
      },
    },
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'New project' }),
    )

    await expect(
      dialog.getByRole('textbox', { name: 'Project title' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Status/ }),
    ).toHaveTextContent('Planned')
    await expect(
      dialog.getByRole('button', { name: /Create Project/ }),
    ).toBeDisabled()
  },
}
