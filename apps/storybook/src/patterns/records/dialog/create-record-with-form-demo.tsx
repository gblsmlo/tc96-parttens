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
import { Textarea } from '@tc96/ui/textarea'
import { Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import { CreateMoreSwitch } from './create-more'
import { delay } from './delay'
import {
  type ProjectValues,
  people,
  priorityOptions,
  projectSchema,
  repos,
  reposLabel,
  statusOptions,
} from './project-record'

const statusItems = statusOptions.map(({ label, value }) => ({ label, value }))
const priorityItems = priorityOptions.map(({ label, value }) => ({
  label,
  value,
}))
const leadItems = people.map(({ label, value }) => ({ label, value }))
const repoItems = repos.map((repo) => ({ label: repo, value: repo }))

export function CreateRecordWithFormDemo({
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
            startDate: null,
            status,
            targetDate: null,
            title,
          })
          if (!parsed.success) return false
          await delay(150)
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
}
