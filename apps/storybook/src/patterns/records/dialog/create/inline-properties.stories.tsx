import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  PersonProperty,
  PropertySurface,
  RecordDialog,
  RecordDialogCreateMore,
  RecordDialogHeadline,
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
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
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

interface InlinePropertiesArgs {
  onCreate: (values: ProjectValues) => void | Promise<void>
  onOpenSingle: () => void
}

const meta = {
  args: {
    onCreate: fn(async (_values: ProjectValues) => {}),
    onOpenSingle: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as quick capture with the properties inline: a borderless title and description, and every property as a chip pinned to the bottom. Use it when the fields are few and optional.',
      },
    },
  },
  render: function InlineProperties({ onCreate, onOpenSingle }) {
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
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Inline Properties',
} satisfies Meta<InlinePropertiesArgs>

export default meta

type Story = StoryObj<InlinePropertiesArgs>

export const InlineProperties: Story = {}

export const InlinePropertiesInteraction: Story = {
  ...InlineProperties,
  tags: ['!dev', '!autodocs'],
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New project' })
    const create = within(dialog).getByRole('button', {
      name: 'Create Project',
    })

    expect(create).toBeDisabled()
    const titleInput = within(dialog).getByRole('textbox', {
      name: 'Project title',
    })
    await waitFor(() => expect(titleInput).toHaveFocus())
    await userEvent.tab()
    expect(titleInput).not.toHaveFocus()
    const box = titleInput.getBoundingClientRect()
    await userEvent.pointer({
      coords: { clientX: box.right - 4, clientY: box.top + box.height / 2 },
      keys: '[MouseLeft]',
      target: titleInput,
    })
    expect(titleInput).toHaveFocus()
    expect(within(dialog).queryByRole('button', { name: 'Cancel' })).toBeNull()

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Open as page' }),
    )
    expect(args.onOpenSingle).toHaveBeenCalledTimes(1)

    const panel = document.querySelector('[data-slot="dialog-panel"]')
    const chip = within(dialog).getByRole('combobox', { name: /^Status/ })
    expect(
      (panel?.getBoundingClientRect().bottom ?? 0) -
        chip.getBoundingClientRect().bottom,
    ).toBeLessThan(40)

    await userEvent.type(
      within(dialog).getByRole('textbox', { name: 'Project title' }),
      'Aurora',
    )
    expect(create).toBeEnabled()

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: /^Status/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'In progress' }),
    )
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: /^Status/ }),
      ).toHaveTextContent('In progress'),
    )

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: /^Priority/ }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'High' }))
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: /^Priority/ }),
      ).toHaveTextContent('High'),
    )

    await userEvent.click(within(dialog).getByRole('button', { name: 'Repos' }))
    await userEvent.click(
      await screen.findByRole('menuitemcheckbox', { name: 'lemind/web' }),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: 'web' })).toBeVisible(),
    )
    expect(screen.getByRole('dialog', { name: 'New project' })).toBeVisible()
    expect(args.onCreate).not.toHaveBeenCalled()

    await userEvent.click(create)

    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        description: '',
        lead: null,
        priority: 'high',
        repos: ['lemind/web'],
        startDate: null,
        status: 'in-progress',
        targetDate: null,
        title: 'Aurora',
      }),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }))
    const reopened = await screen.findByRole('dialog', {
      name: 'New project',
    })
    await userEvent.click(
      within(reopened).getByRole('switch', { name: 'Create more' }),
    )
    const next = within(reopened).getByRole('textbox', {
      name: 'Project title',
    })
    await userEvent.type(next, 'Borealis')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() => expect(args.onCreate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(next).toHaveValue(''))
    expect(screen.getByRole('dialog', { name: 'New project' })).toBeVisible()
  },
}

export const FailedSubmit: Story = {
  args: {
    onCreate: fn(async (_values: ProjectValues) => {
      await new Promise((resolve) => setTimeout(resolve, 150))
      throw new Error('Could not create the project. Try again.')
    }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the save fails the dialog stays open, the title and the properties keep their values, the message shows in the alert above the footer and focus returns to the submit button.',
      },
    },
  },
}

export const FailedSubmitInteraction: Story = {
  ...FailedSubmit,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New project' })
    const title = within(dialog).getByRole('textbox', { name: 'Project title' })
    const status = within(dialog).getByRole('combobox', { name: /^Status/ })
    const create = within(dialog).getByRole('button', {
      name: 'Create Project',
    })

    await userEvent.type(title, 'Aurora')
    await userEvent.click(status)
    await userEvent.click(
      await screen.findByRole('option', { name: 'In progress' }),
    )
    await waitFor(() => expect(status).toHaveTextContent('In progress'))

    await userEvent.click(create)
    await within(dialog).findByRole('button', { name: 'Creating' })
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Could not create the project. Try again.',
    )

    await waitFor(() => expect(create).toBeEnabled())
    expect(args.onCreate).toHaveBeenCalledTimes(1)
    expect(title).toHaveValue('Aurora')
    expect(status).toHaveTextContent('In progress')
    expect(dialog).toBeVisible()
    expect(document.activeElement).toBe(create)
  },
  tags: ['!dev', '!autodocs'],
}
