import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  PersonProperty,
  RecordDialog,
  RecordGroup,
  RecordGroupRow,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from '@tc96/ui/accordion'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  BellIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  GitBranchIcon,
  HashIcon,
  type LucideIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon,
  WorkflowIcon,
} from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, within } from 'storybook/test'
import { initialContacts } from '../../collection/fixtures/contacts'
import { CreateContactDialog, type NewContact } from './create-contact-dialog'
import { CreateEventDialog } from './create-event-dialog'
import type { EventSlot, EventValues } from './event-record'
import { LeadDialog } from './lead-dialog'
import type { NewLead } from './lead-record'
import { NoteDialog } from './note-dialog'
import { type NoteValues, noteRecordName } from './note-record'
import { people, repos } from './project-record'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/RecordDialog/Usages',
} satisfies Meta

export default meta

const companies = initialContacts.map((contact) => contact.company)
const roles = initialContacts.map((contact) => contact.role)

interface ContactsArgs {
  onCreate: (contact: NewContact) => void
}

export const Contacts: StoryObj<ContactsArgs> = {
  args: { onCreate: fn((_contact: NewContact) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'The create step of the Contacts collection, on the [Inline Properties](?path=/story/patterns-records-recorddialog-layouts--inline-properties) layout without `stretchBody`: the name as a borderless title, a short description below it, and every other field as a property chip. Telefone, E-mail, Tipo (CPF or CNPJ) and Documento are always shown. The ... chip opens a menu whose switches show or hide Etapa, Tags, Empresa and Cargo; Etapa starts at Sem etapa and has no Lead. Empresa and Cargo share one combobox chip: search, the existing roles or companies of the collection, and a footer that creates the typed name and selects it. The Contacts usage of `Patterns/Collection` opens the same dialog from Novo contato.',
      },
    },
  },
  render: function Contacts({ onCreate }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Novo contato
        </Button>
        <CreateContactDialog
          companies={companies}
          onCreate={onCreate}
          onOpenChange={setOpen}
          open={open}
          roles={roles}
        />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo contato' }),
    )

    await expect(dialog.getByRole('textbox', { name: 'Nome' })).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Mais propriedades' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /Criar contato/ }),
    ).toBeDisabled()
  },
}

interface LeadsArgs {
  onCreate: (lead: NewLead) => void
}

export const Leads: StoryObj<LeadsArgs> = {
  args: { onCreate: fn((_lead: NewLead) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'The create step of a lead, on the [Row Properties](?path=/story/patterns-records-recorddialog-layouts--row-properties) layout: a borderless title and description, then labeled rows (`RecordGroupRow`) for Etapa, Origem, Responsável and Próxima ação. Etapa starts at Novo, Origem, Responsável and Próxima ação start empty, and Próxima ação lists the next step (Ligar, Enviar e-mail, Agendar reunião, Enviar proposta, Fazer follow-up). Criar lead stays disabled until the title has text.',
      },
    },
  },
  render: function Leads({ onCreate }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Novo lead
        </Button>
        <LeadDialog onCreate={onCreate} onOpenChange={setOpen} open={open} />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo lead' }),
    )

    await expect(dialog.getByRole('textbox', { name: 'Título' })).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Etapa/ }),
    ).toHaveTextContent('Novo')
  },
}

interface NoteArgs {
  onSave: (values: NoteValues) => void | Promise<void>
}

export const Note: StoryObj<NoteArgs> = {
  args: { onSave: fn((_values: NoteValues) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'A new note on a record, on the [Property Bar Over Body](?path=/story/patterns-records-recorddialog-layouts--property-bar-over-body) layout: the record name as the ancestor, then the headline title without a description, Status, Prioridade and Responsável as a bar of `plain` property chips, the same properties as the layout, and a `RichTextEditor` that fills the rest of the dialog in the `readable` column. Criar nota stays disabled until the title or the body has text. The Notes usage of `Patterns/Records/Group/Usages` opens the same dialog from the + action.',
      },
      source: { inlineLimit: 250 },
    },
  },
  render: function NoteUsage({ onSave }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Nova nota
        </Button>
        <NoteDialog
          note={null}
          onCopyLink={() => {}}
          onOpenChange={setOpen}
          onSave={onSave}
          open={open}
          recordName={noteRecordName}
        />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Nova nota' }),
    )

    await expect(dialog.getByText(noteRecordName)).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Status/ }),
    ).toHaveTextContent('Planejada')
    await expect(
      dialog.getByRole('button', { name: /Criar nota/ }),
    ).toBeDisabled()
  },
}

type SetupValues = Record<string, string | null>

interface SetupRow {
  fallback: string
  icon: LucideIcon
  id: string
  label: string
  options?: readonly SelectPropertyOption[]
}

interface SetupSection {
  description: string
  icon: LucideIcon
  id: string
  rows: readonly SetupRow[]
  title: string
}

const option = (label: string, value = label): SelectPropertyOption => ({
  label,
  value,
})

const setupSections: readonly SetupSection[] = [
  {
    description: 'Who runs the project and when the team reviews it.',
    icon: ShieldCheckIcon,
    id: 'ownership',
    rows: [
      { fallback: 'Add owner', icon: UserIcon, id: 'owner', label: 'Owner' },
      {
        fallback: 'Add alias',
        icon: BriefcaseIcon,
        id: 'alias',
        label: 'Alias',
      },
      {
        fallback: 'Add review window',
        icon: CalendarClockIcon,
        id: 'review',
        label: 'Review',
        options: [
          option('Weekly', 'weekly'),
          option('Every two weeks', 'biweekly'),
          option('Monthly', 'monthly'),
        ],
      },
    ],
    title: 'Ownership',
  },
  {
    description: 'Where the work lives and where updates are posted.',
    icon: WorkflowIcon,
    id: 'integrations',
    rows: [
      {
        fallback: 'Add repository',
        icon: GitBranchIcon,
        id: 'repository',
        label: 'Repository',
        options: repos.map((repo) => option(repo)),
      },
      {
        fallback: 'Add channel',
        icon: HashIcon,
        id: 'channel',
        label: 'Channel',
        options: ['#launch', '#engineering', '#design'].map((channel) =>
          option(channel),
        ),
      },
    ],
    title: 'Integrations',
  },
  {
    description: 'Who hears about it when the project is blocked.',
    icon: BellIcon,
    id: 'alerts',
    rows: [
      {
        fallback: 'Add person',
        icon: MailIcon,
        id: 'escalation',
        label: 'Escalation',
      },
    ],
    title: 'Alerts',
  },
]

const initialSetupValues: SetupValues = {
  alias: 'growth-command',
  owner: 'ana',
  review: null,
}

const setupStatus = (section: SetupSection, values: SetupValues) => {
  const filled = section.rows.filter(({ id }) => values[id]).length
  if (filled === section.rows.length)
    return { label: 'Done', variant: 'success' } as const
  if (filled > 0) return { label: 'In progress', variant: 'info' } as const
  return { label: 'Pending', variant: 'secondary' } as const
}

const isPersonRow = (row: SetupRow) =>
  row.id === 'owner' || row.id === 'escalation'

interface ProjectSetupArgs {
  onCreate: (values: SetupValues) => void
}

export const ProjectSetup: StoryObj<ProjectSetupArgs> = {
  args: { onCreate: fn((_values: SetupValues) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'The setup of a project, on the [Description Over Body](?path=/story/patterns-records-recorddialog-layouts--description-over-body) layout: the trail and the dialog description, with no headline, and sections in an accordion, each with an icon, a title, a description and a status derived from its rows. Each section holds a `RecordGroup` with `collapsible={false}` and no `title`, so the accordion is the only fold and its trigger the only heading, and its rows are selectable: a person picker, an inline text or a select.',
      },
    },
  },
  render: function ProjectSetup({ onCreate }) {
    const [open, setOpen] = useState(true)
    const [values, setValues] = useState(initialSetupValues)
    const update = (id: string, value: string | null) =>
      setValues((current) => ({ ...current, [id]: value }))

    const control = (row: SetupRow) => {
      const value = values[row.id] ?? null
      if (isPersonRow(row))
        return (
          <PersonProperty
            ariaLabel={row.label}
            onValueChange={(next) => update(row.id, next)}
            options={people}
            placeholder={row.fallback}
            value={value}
            variant="plain"
          />
        )
      if (row.options)
        return (
          <SelectProperty
            ariaLabel={row.label}
            placeholder={row.fallback}
            onValueChange={(next) => update(row.id, next)}
            options={row.options}
            value={value}
            variant="plain"
          />
        )
      return (
        <TextProperty
          ariaLabel={row.label}
          editing="inline"
          fallback={row.fallback}
          onCommit={(next) => update(row.id, next)}
          value={value}
          variant="plain"
        />
      )
    }

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Set up project
        </Button>
        <RecordDialog
          cancelLabel="Cancel"
          description="Fill in each section before the project goes live."
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) setValues(initialSetupValues)
          }}
          onSubmit={() => {
            onCreate(values)
            return true
          }}
          open={open}
          submitLabel="Save setup"
          title="Project setup"
          titleAncestor="Projects"
        >
          <Accordion defaultValue={[setupSections[0]?.id]}>
            {setupSections.map((section) => {
              const status = setupStatus(section, values)

              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger>
                    <span className="flex flex-1 items-start gap-3">
                      <IconFrame shape="rounded" size="sm">
                        <section.icon aria-hidden />
                      </IconFrame>
                      <span className="grid flex-1 gap-0.5">
                        <span>{section.title}</span>
                        <span className="font-normal text-muted-foreground">
                          {section.description}
                        </span>
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionPanel>
                    <RecordGroup className="ms-11" collapsible={false}>
                      {section.rows.map((row) => (
                        <RecordGroupRow
                          key={row.id}
                          label={row.label}
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
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Project setup' }),
    )

    await expect(
      dialog.getByRole('button', { name: /^Ownership/ }),
    ).toHaveAttribute('aria-expanded', 'true')
    await expect(
      dialog
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['Project setup'])
    await expect(dialog.getByText('Owner')).toBeVisible()
    await expect(
      dialog.getByRole('combobox', { name: /^Review/ }),
    ).toBeVisible()
  },
}

interface EventsArgs {
  onCreate: (values: EventValues) => void
  slot: EventSlot
}

export const Events: StoryObj<EventsArgs> = {
  argTypes: {
    onCreate: { control: false },
    slot: {
      control: 'object',
      description:
        'The day (an ISO instant at noon UTC) and the `HH:mm` window of the Date row. The dialog reads it when it mounts and when it closes, so a change shows on the next open.',
    },
  },
  args: {
    onCreate: fn((_values: EventValues) => {}),
    slot: { date: '2026-10-14T12:00:00.000Z', end: '10:00', start: '09:00' },
  },
  parameters: {
    docs: {
      description: {
        story: [
          'A calendar event or appointment on the [Row Properties](?path=/story/patterns-records-recorddialog-layouts--row-properties) layout, prefilled with the slot the calendar picked: a borderless title and description, then rows ordered from what places the event to what classifies it: Date (a `ScheduleProperty` for the day, times, repeat and reminders), Guests, Location, Type (Event, Appointment), Calendar (Appointments, Sales, Personal) and Availability (Busy, Free). The title follows Type.',
          'Location commits on blur and Mod+Enter submits in the same event, so the draft lives in `useRecordDraft` and `onSubmit` reads `latest`. An end before the start, or a failed save, shows in `errorMessage`. Create more keeps the dialog open after saving and puts the fields back to the slot.',
          'The `Calendar` story of `Patterns/Collection/Usages` opens the same dialog from Nova atividade and from an empty slot of the time grid, giving it a new `key` for each request instead of passing a new slot to an open dialog.',
        ].join('\n\n'),
      },
    },
  },
  render: function Events({ onCreate, slot }) {
    const [open, setOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Nova atividade
        </Button>
        <CreateEventDialog
          onCreate={onCreate}
          onOpenChange={setOpen}
          open={open}
          slot={slot}
        />
      </>
    )
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'New event' }),
    )

    await expect(
      dialog.getByRole('button', { name: /^Date:/ }),
    ).toHaveTextContent('Oct 14 · 09:00 – 10:00')
    await expect(
      dialog.getByRole('combobox', { name: /^Availability/ }),
    ).toHaveTextContent('Busy')
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled()
  },
}
