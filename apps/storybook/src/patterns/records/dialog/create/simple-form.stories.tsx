import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordDialog } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Field, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { Switch } from '@tc96/ui/switch'
import { Textarea } from '@tc96/ui/textarea'
import { Maximize2Icon } from 'lucide-react'
import { useId, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  type ProjectValues,
  people,
  priorityOptions,
  projectSchema,
  repos,
  reposLabel,
  statusOptions,
} from '../project-record'

const statusItems = statusOptions.map(({ label, value }) => ({ label, value }))
const priorityItems = priorityOptions.map(({ label, value }) => ({
  label,
  value,
}))
const leadItems = people.map(({ label, value }) => ({ label, value }))
const repoItems = repos.map((repo) => ({ label: repo, value: repo }))

interface SimpleFormArgs {
  onCreate: (values: ProjectValues) => void
  onOpenSingle: () => void
}

const meta = {
  args: {
    onCreate: fn((_values: ProjectValues) => {}),
    onOpenSingle: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'RecordDialog as explicit entry: the same fields and payload as Inline Properties, as labeled fields that scroll in the panel. Use it for long bodies or required fields that need a visible label.',
      },
    },
  },
  render: function SimpleForm({ onCreate, onOpenSingle }) {
    const [open, setOpen] = useState(true)
    const [createMore, setCreateMore] = useState(false)
    const createMoreId = useId()
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState('planned')
    const [priority, setPriority] = useState('none')
    const [lead, setLead] = useState<string | null>(null)
    const [selectedRepos, setSelectedRepos] = useState<string[]>([])

    const reset = () => {
      setTitle('')
      setStatus('planned')
      setPriority('none')
      setLead(null)
      setSelectedRepos([])
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
            <div className="flex items-center gap-2">
              <Switch
                checked={createMore}
                id={createMoreId}
                onCheckedChange={setCreateMore}
              />
              <label className="text-sm" htmlFor={createMoreId}>
                Create more
              </label>
            </div>
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
              startDate: null,
              status,
              targetDate: null,
              title,
            })
            if (!parsed.success) return false
            onCreate(parsed.data)
            if (createMore) reset()
            return true
          }}
          open={open}
          submitDisabled={title.trim() === ''}
          submitLabel="Create Project"
          submitOnModEnter
          submittingLabel="Creating"
          title="New project"
          titleAncestor="Lemind"
        >
          <div className="grid gap-4">
            <Field name="title">
              <FieldLabel>Title</FieldLabel>
              <Input
                autoFocus
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Project title"
                value={title}
              />
            </Field>
            <Field name="description">
              <FieldLabel>Description</FieldLabel>
              <Textarea
                className="[&_textarea]:resize-none"
                placeholder="Add description..."
              />
            </Field>
            <Field name="status">
              <FieldLabel>Status</FieldLabel>
              <Select
                items={statusItems}
                onValueChange={(value) => setStatus(value ?? 'planned')}
                value={status}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {statusItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
            <Field name="priority">
              <FieldLabel>Priority</FieldLabel>
              <Select
                items={priorityItems}
                onValueChange={(value) => setPriority(value ?? 'none')}
                value={priority}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {priorityItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
            <Field name="lead">
              <FieldLabel>Lead</FieldLabel>
              <Select items={leadItems} onValueChange={setLead} value={lead}>
                <SelectTrigger>
                  <SelectValue placeholder="No lead" />
                </SelectTrigger>
                <SelectPopup>
                  {leadItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
            <Field name="repos">
              <FieldLabel>Repos</FieldLabel>
              <Select
                items={repoItems}
                multiple
                onValueChange={setSelectedRepos}
                value={selectedRepos}
              >
                <SelectTrigger>
                  <SelectValue>
                    {(value: string[]) =>
                      value.length === 0 ? 'No repos' : reposLabel(value)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectPopup>
                  {repoItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </Field>
          </div>
        </RecordDialog>
      </>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Create/Simple Form',
} satisfies Meta<SimpleFormArgs>

export default meta

type Story = StoryObj<SimpleFormArgs>

export const SimpleForm: Story = {}

export const SimpleFormInteraction: Story = {
  ...SimpleForm,
  play: async ({ args }) => {
    const dialog = await screen.findByRole('dialog', { name: 'New project' })
    const create = within(dialog).getByRole('button', {
      name: /Create Project/,
    })
    const title = within(dialog).getByRole('textbox', { name: 'Title' })

    expect(create).toBeDisabled()
    await waitFor(() => expect(title).toHaveFocus())
    await userEvent.type(title, 'Aurora')
    expect(create).toBeEnabled()

    await userEvent.click(
      within(dialog).getByRole('combobox', { name: 'Status' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'In progress' }),
    )
    await userEvent.click(
      within(dialog).getByRole('combobox', { name: 'Priority' }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'High' }))
    await waitFor(() =>
      expect(
        within(dialog).getByRole('combobox', { name: 'Priority' }),
      ).toHaveTextContent('High'),
    )

    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() =>
      expect(args.onCreate).toHaveBeenCalledWith({
        description: '',
        lead: null,
        priority: 'high',
        repos: [],
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
    const next = within(reopened).getByRole('textbox', { name: 'Title' })
    await userEvent.type(next, 'Borealis')
    await userEvent.keyboard('{Control>}{Enter}{/Control}')
    await waitFor(() => expect(args.onCreate).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(next).toHaveValue(''))
    expect(screen.getByRole('dialog', { name: 'New project' })).toBeVisible()
    expect(
      within(reopened).getByRole('combobox', { name: 'Status' }),
    ).toHaveTextContent('Planned')
  },
  tags: ['!dev', '!autodocs'],
}
