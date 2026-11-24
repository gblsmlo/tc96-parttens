import {
  AddressBookIcon,
  BankIcon,
  BellIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingsIcon,
  FileTextIcon,
  FlagIcon,
  GearIcon,
  HashIcon,
  type Icon as PhosphorIcon,
  ScalesIcon,
  StackIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
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
  PersonProperty,
  type PersonPropertyOption,
  RecordDialog,
  RecordGroup,
  RecordGroupRow,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
} from '@tc96/ui/patterns'
import { Switch } from '@tc96/ui/switch'
import { useState } from 'react'
import { expect, fn, screen, userEvent, within } from 'storybook/test'
import { initialContacts } from '../../collection/fixtures/contacts'
import { CreateContactDialog, type NewContact } from './create-contact-dialog'
import { CreateEventDialog } from './create-event-dialog'
import type { EventSlot, EventValues } from './event-record'
import {
  lawsuitClients,
  lawsuitContractOptions,
  lawsuitInstanceOptions,
  lawsuitOwners,
  lawsuitPartyRoleOptions,
  lawsuitPhaseOptions,
} from './lawsuit-record'
import { LeadDialog } from './lead-dialog'
import type { NewLead } from './lead-record'
import { NoteDialog } from './note-dialog'
import { type NoteValues, noteRecordName } from './note-record'

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

type ManualLawsuitValues = Record<string, string | boolean | null>

interface ManualLawsuitRow {
  fallback?: string
  icon: PhosphorIcon
  id: string
  label: string
  options?: readonly SelectPropertyOption[]
  people?: readonly PersonPropertyOption[]
  toggle?: true
}

interface ManualLawsuitSection {
  description: string
  icon: PhosphorIcon
  id: string
  rows: readonly ManualLawsuitRow[]
  title: string
}

const manualLawsuitSections: readonly ManualLawsuitSection[] = [
  {
    description: 'Número, ação e onde o processo corre.',
    icon: BankIcon,
    id: 'lawsuit',
    rows: [
      {
        fallback: 'Adicionar número',
        icon: HashIcon,
        id: 'number',
        label: 'Número',
      },
      {
        fallback: 'Adicionar ação',
        icon: ScalesIcon,
        id: 'action',
        label: 'Ação',
      },
      {
        fallback: 'Adicionar objeto',
        icon: BookOpenIcon,
        id: 'subject',
        label: 'Objeto',
      },
      {
        fallback: 'Adicionar foro',
        icon: BankIcon,
        id: 'venue',
        label: 'Foro',
      },
      {
        fallback: 'Adicionar vara',
        icon: BuildingsIcon,
        id: 'division',
        label: 'Vara',
      },
      {
        fallback: 'Escolher instância',
        icon: StackIcon,
        id: 'instance',
        label: 'Instância',
        options: lawsuitInstanceOptions,
      },
    ],
    title: 'Processo',
  },
  {
    description: 'Quem participa do processo e em qual papel.',
    icon: UsersIcon,
    id: 'party',
    rows: [
      {
        fallback: 'Adicionar nome',
        icon: UserIcon,
        id: 'partyName',
        label: 'Nome',
      },
      {
        fallback: 'Escolher papel',
        icon: TagIcon,
        id: 'partyRole',
        label: 'Papel',
        options: lawsuitPartyRoleOptions,
      },
      {
        fallback: 'Escolher contato',
        icon: AddressBookIcon,
        id: 'partyContact',
        label: 'Contato',
        people: lawsuitClients,
      },
    ],
    title: 'Partes',
  },
  {
    description: 'Quem acompanha o processo no escritório.',
    icon: BriefcaseIcon,
    id: 'office',
    rows: [
      {
        fallback: 'Escolher responsável',
        icon: UserIcon,
        id: 'owner',
        label: 'Responsável',
        people: lawsuitOwners,
      },
      {
        fallback: 'Escolher fase',
        icon: FlagIcon,
        id: 'phase',
        label: 'Fase',
        options: lawsuitPhaseOptions,
      },
      {
        fallback: 'Vincular contrato',
        icon: FileTextIcon,
        id: 'contract',
        label: 'Contrato',
        options: lawsuitContractOptions,
      },
    ],
    title: 'Escritório',
  },
  {
    description: 'Como o processo é acompanhado no tribunal.',
    icon: GearIcon,
    id: 'settings',
    rows: [{ icon: BellIcon, id: 'monitor', label: 'Monitorar', toggle: true }],
    title: 'Configurações',
  },
]

const initialManualLawsuitValues: ManualLawsuitValues = {
  instance: 'first',
  monitor: true,
  owner: 'admin',
  phase: 'initial',
}

const manualLawsuitStatus = (
  section: ManualLawsuitSection,
  values: ManualLawsuitValues,
) => {
  const filled = section.rows.filter(
    ({ id }) => typeof values[id] === 'boolean' || Boolean(values[id]),
  ).length
  if (filled === section.rows.length)
    return { label: 'Concluída', variant: 'success' } as const
  if (filled > 0) return { label: 'Em andamento', variant: 'info' } as const
  return { label: 'Pendente', variant: 'secondary' } as const
}

interface LawsuitsArgs {
  onCreate: (values: ManualLawsuitValues) => void
}

export const Lawsuits: StoryObj<LawsuitsArgs> = {
  args: { onCreate: fn((_values: ManualLawsuitValues) => {}) },
  parameters: {
    docs: {
      description: {
        story:
          'A lawsuit filled in by hand, on the [Description Over Body](?path=/story/patterns-records-recorddialog-layouts--description-over-body) layout: the trail and the dialog description, with no headline, and Processo, Partes, Escritório and Configurações in an accordion, each with an icon, a title, a description and a status derived from its rows. Each section holds a `RecordGroup` with `collapsible={false}` and no `title`, so the accordion is the only fold and its trigger the only heading. Partes takes a name, a role (Cliente, Parte contrária, Testemunha, Correspondente, Indicação) and a contact, and Configurações holds Monitorar as a `Switch`; Instância, Responsável, Fase and Monitorar start filled, and Mod+Enter submits.',
      },
    },
  },
  play: async ({ args }) => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Processo manual' }),
    )

    await expect(
      dialog.getByRole('button', { name: /^Processo/ }),
    ).toHaveAttribute('aria-expanded', 'true')
    await expect(
      dialog.getByRole('combobox', { name: /^Instância/ }),
    ).toHaveTextContent('1º grau')
    await expect(
      dialog.getByRole('button', { name: /^Configurações/ }),
    ).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(
      dialog.getByRole('button', { name: /Criar processo/ }),
    )
    await expect(args.onCreate).toHaveBeenCalledWith(initialManualLawsuitValues)
  },
  render: function Lawsuits({ onCreate }) {
    const [values, setValues] = useState(initialManualLawsuitValues)
    const update = (id: string, value: string | boolean | null) =>
      setValues((current) => ({ ...current, [id]: value }))

    const control = (row: ManualLawsuitRow) => {
      if (row.toggle)
        return (
          <Switch
            aria-label={row.label}
            checked={values[row.id] === true}
            onCheckedChange={(next) => update(row.id, next)}
          />
        )
      const current = values[row.id]
      const value = typeof current === 'string' ? current : null
      if (row.people)
        return (
          <PersonProperty
            ariaLabel={row.label}
            onValueChange={(next) => update(row.id, next)}
            options={row.people}
            placeholder={row.fallback}
            value={value}
            variant="plain"
          />
        )
      if (row.options)
        return (
          <SelectProperty
            ariaLabel={row.label}
            onValueChange={(next) => update(row.id, next)}
            options={row.options}
            placeholder={row.fallback}
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
      <RecordDialog
        cancelLabel="Cancelar"
        description="Preencha cada seção antes de criar o processo."
        onOpenChange={(next) => {
          if (!next) setValues(initialManualLawsuitValues)
        }}
        onSubmit={() => {
          onCreate(values)
          return true
        }}
        open
        submitLabel="Criar processo"
        submitOnModEnter
        submittingLabel="Criando"
        title="Processo manual"
        titleAncestor="Processos"
      >
        <Accordion defaultValue={[manualLawsuitSections[0]?.id]}>
          {manualLawsuitSections.map((section) => {
            const status = manualLawsuitStatus(section, values)

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
    )
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
