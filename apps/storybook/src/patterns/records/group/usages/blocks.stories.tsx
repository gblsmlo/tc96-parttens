import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/elements/avatar'
import {
  Checklist,
  type ChecklistItem,
  DateProperty,
  PeopleProperty,
  type PeoplePropertyOption,
  RecordGroup,
  RecordGroupAction,
  RecordGroupItem,
  RecordGroupLink,
  RecordGroupRow,
  type RecordGroupVariant,
  RecordPreview,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  Building2Icon,
  CalendarClockIcon,
  CalendarPlusIcon,
  ClipboardListIcon,
  FileSignatureIcon,
  FileTextIcon,
  HistoryIcon,
  type LucideIcon,
  MailIcon,
  PlusIcon,
  ReceiptTextIcon,
  TargetIcon,
  UserPlusIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'

import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'
import { usageParameters } from '../../../../test-utils/usage-kit'
import { NoteDialog } from '../../dialog/note-dialog'
import {
  initialNotes,
  type Note,
  noteAge,
  noteAuthor,
  noteAuthors,
  notePreview,
  noteRecordName,
  notesNow,
  noteTitle,
} from '../../dialog/note-record'

const today = '09/10/2026'

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

const yesNoOptions: readonly SelectPropertyOption[] = [
  { label: 'Sim', value: 'yes' },
  { label: 'Não', value: 'no' },
]

const peopleOptions: readonly PeoplePropertyOption[] = [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Gabriel Melo', value: 'gabriel' },
  { label: 'Pedro Rocha', value: 'pedro' },
]

interface BriefValues {
  expectedTarget: string | null
  primaryObjective: string | null
  secondaryObjective: string | null
}

interface BriefVersion {
  number: number
  savedAt: string
  status: 'draft' | 'published'
  values: BriefValues
}

const objectiveOptions: readonly SelectPropertyOption[] = [
  { label: 'Gerar novas consultas', value: 'new-appointments' },
  { label: 'Divulgar área de atuação', value: 'practice-area' },
  { label: 'Fortalecer indicação', value: 'referrals' },
]

const targetOptions: readonly SelectPropertyOption[] = [
  { label: 'Consulta agendada', value: 'booked-appointment' },
  { label: 'Conversa no WhatsApp', value: 'whatsapp-conversation' },
]

const briefFields: readonly {
  key: keyof BriefValues
  label: string
  empty: string
  options: readonly SelectPropertyOption[]
}[] = [
  {
    empty: 'Sem objetivo 1',
    key: 'primaryObjective',
    label: 'Objetivo 1',
    options: objectiveOptions,
  },
  {
    empty: 'Sem objetivo 2',
    key: 'secondaryObjective',
    label: 'Objetivo 2',
    options: objectiveOptions,
  },
  {
    empty: 'Sem alvo esperado',
    key: 'expectedTarget',
    label: 'Alvo esperado',
    options: targetOptions,
  },
]

const initialVersions: readonly BriefVersion[] = [
  {
    number: 2,
    savedAt: '08/10/2026',
    status: 'draft',
    values: {
      expectedTarget: 'whatsapp-conversation',
      primaryObjective: 'new-appointments',
      secondaryObjective: null,
    },
  },
  {
    number: 1,
    savedAt: '26/09/2026',
    status: 'published',
    values: {
      expectedTarget: 'booked-appointment',
      primaryObjective: 'new-appointments',
      secondaryObjective: null,
    },
  },
]

const statusBadges = {
  draft: <Badge variant="warning">Rascunho</Badge>,
  published: <Badge variant="success">Publicada</Badge>,
} satisfies Record<BriefVersion['status'], ReactNode>

const sameValues = (a: BriefValues, b: BriefValues) =>
  briefFields.every(({ key }) => a[key] === b[key])

const installments = [
  { id: 'parcela-1', name: 'Parcela 1', status: 'Paga · 10/09/2026' },
  { id: 'parcela-2', name: 'Parcela 2', status: 'Prevista · 10/10/2026' },
  { id: 'parcela-3', name: 'Parcela 3', status: 'Prevista · 10/11/2026' },
]

const paymentMethodOptions: readonly SelectPropertyOption[] = [
  { label: 'Boleto', value: 'boleto' },
  { label: 'Pix', value: 'pix' },
  { label: 'Cartão', value: 'card' },
]

const sourceOptions: readonly SelectPropertyOption[] = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Indicação', value: 'referral' },
  { label: 'Google', value: 'google' },
]

const interestOptions: readonly SelectPropertyOption[] = [
  { label: 'Revisional bancária', value: 'banking' },
  { label: 'Trabalhista', value: 'labor' },
  { label: 'Família', value: 'family' },
]

const urgencyOptions: readonly SelectPropertyOption[] = [
  { label: 'Alta', value: 'high' },
  { label: 'Média', value: 'medium' },
  { label: 'Baixa', value: 'low' },
]

interface RecordTrigger {
  icon: LucideIcon
  id: string
  label: string
  meta: ReactNode
}

const initialTriggers: readonly RecordTrigger[] = [
  {
    icon: FileSignatureIcon,
    id: 'contract',
    label: 'Gerar contrato',
    meta: null,
  },
  {
    icon: MailIcon,
    id: 'documents',
    label: 'Solicitar documentos',
    meta: null,
  },
  {
    icon: CalendarPlusIcon,
    id: 'appointment',
    label: 'Agendar consulta',
    meta: null,
  },
  {
    icon: UserPlusIcon,
    id: 'contact',
    label: 'Criar contato',
    meta: null,
  },
  {
    icon: TargetIcon,
    id: 'lead',
    label: 'Criar Lead',
    meta: null,
  },
]

interface UsageArgs {
  variant: RecordGroupVariant
}

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    ...usageParameters,
    docs: {
      description: {
        component:
          'Groups a record page composes to edit and add content, one story per job. Each is a single `RecordGroup`, open here; a page picks the groups its use case needs and passes `defaultOpen={false}` when its footer opens closed. Every story takes the `variant` control (`card`, `inset`, `plain`).',
      },
    },
  },
  title: 'Patterns/Records/Group/Usages',
} satisfies Meta<UsageArgs>

export default meta

type Story = StoryObj<UsageArgs>

const describe = (story: string) => ({ docs: { description: { story } } })

const regionOf = (canvasElement: HTMLElement, name: string) =>
  within(within(canvasElement).getByRole('region', { name }))

const listboxClosed = () =>
  waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

const briefLabels = ['Objetivo 1', 'Objetivo 2', 'Alvo esperado']

const expectWholeLabels = async (
  scope: HTMLElement,
  labels: readonly string[],
) => {
  for (const label of labels) {
    const text = within(scope).getByText(label, {
      selector: '[data-slot="record-group-row-label"] > span',
    })
    await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth)
  }
}

export const Tasks: Story = {
  args: { variant: 'inset' },
  parameters: describe(
    'Tracks work to do: a `Checklist` in `plain` inside a `RecordGroup` (`inset` by default), so its rows take the 32px row height of the group. Check, rename, reorder, delete and add items.',
  ),
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('region', { name: 'Tarefas' })
    const tasks = within(group)

    await expect(group).toHaveAttribute('data-variant', args.variant)
    await expect(
      tasks.getByRole('region', { name: 'Lista de tarefas' }),
    ).toHaveAttribute('data-variant', 'plain')
    for (const item of group.querySelectorAll('[data-slot="checklist-item"]')) {
      await expect(item.getBoundingClientRect().height).toBe(32)
    }

    await userEvent.click(
      tasks.getByRole('checkbox', { name: 'Redigir contestação' }),
    )
    await waitFor(() =>
      expect(
        tasks.getByRole('checkbox', { name: 'Redigir contestação' }),
      ).toBeChecked(),
    )

    const draft = tasks.getByRole('textbox', {
      name: 'Novo item',
    }) as HTMLInputElement
    await userEvent.type(draft, 'Protocolar petição')
    draft.form?.requestSubmit()
    await expect(
      await tasks.findByRole('checkbox', { name: 'Protocolar petição' }),
    ).not.toBeChecked()
  },
  render: function Tasks({ variant }) {
    const [items, setItems] = useState<readonly ChecklistItem[]>([
      { completed: true, id: 'extracts', title: 'Baixar extratos de 2024' },
      { completed: false, id: 'appeal', title: 'Redigir contestação' },
    ])
    const [newItemTitle, setNewItemTitle] = useState('')

    return (
      <RecordGroup title="Tarefas" variant={variant}>
        <Checklist
          ariaLabel="Lista de tarefas"
          items={items}
          locale="pt-BR"
          newItemTitle={newItemTitle}
          onCreate={(title, completed) => {
            setItems((current) => [
              ...current,
              { completed, id: `item-${current.length + 1}`, title },
            ])
            setNewItemTitle('')
          }}
          onItemCompletionChange={(id, completed) =>
            setItems((current) =>
              current.map((item) =>
                item.id === id ? { ...item, completed } : item,
              ),
            )
          }
          onItemDelete={(id) =>
            setItems((current) => current.filter((item) => item.id !== id))
          }
          onItemMove={(id, targetIndex) =>
            setItems((current) => {
              const moving = current.find((item) => item.id === id)
              if (!moving) return current
              const rest = current.filter((item) => item.id !== id)
              return [
                ...rest.slice(0, targetIndex),
                moving,
                ...rest.slice(targetIndex),
              ]
            })
          }
          onItemRename={(id, title) =>
            setItems((current) =>
              current.map((item) =>
                item.id === id ? { ...item, title } : item,
              ),
            )
          }
          onNewItemTitleChange={setNewItemTitle}
          variant="plain"
        />
      </RecordGroup>
    )
  },
}

export const Triggers: StoryObj<
  UsageArgs & { onRun: (id: string) => Promise<void> }
> = {
  args: { onRun: fn(() => delay(400)) },
  parameters: describe(
    'Runs commands on the record: each row is a trigger (icon and command) rendered as a `button`, with the `meta` slot on the right left empty for now. The row is busy while its command runs and keeps focus.',
  ),
  play: async ({ args, canvasElement }) => {
    const triggers = regionOf(canvasElement, 'Ações')
    const contract = triggers.getByRole('button', { name: 'Gerar contrato' })

    await expect(
      Array.from(
        canvasElement.querySelectorAll('[data-slot="record-group-link"]'),
        (row) => row.textContent,
      ),
    ).toEqual([
      'Gerar contrato',
      'Solicitar documentos',
      'Agendar consulta',
      'Criar contato',
      'Criar Lead',
    ])
    await expect(
      canvasElement.querySelector('[data-slot="record-group-link-meta"]'),
    ).toBeNull()

    await userEvent.click(contract)
    await expect(args.onRun).toHaveBeenCalledWith('contract')
    await expect(contract).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(contract)
    await expect(args.onRun).toHaveBeenCalledTimes(1)

    await waitFor(() => expect(contract).toHaveAttribute('aria-busy', 'false'))
    await expect(contract).toHaveFocus()
  },
  render: function Triggers({ onRun, variant }) {
    const [runningId, setRunningId] = useState<string | null>(null)

    const run = async (id: string) => {
      if (runningId) return
      setRunningId(id)
      await onRun(id)
      setRunningId(null)
    }

    return (
      <RecordGroup title="Ações" variant={variant}>
        {initialTriggers.map(({ icon: Icon, id, label, meta }) => (
          <RecordGroupLink
            aria-busy={runningId === id}
            key={id}
            leading={<Icon aria-hidden />}
            meta={meta}
            onClick={() => run(id)}
            render={<button type="button" />}
          >
            {label}
          </RecordGroupLink>
        ))}
      </RecordGroup>
    )
  },
}

export const Access: Story = {
  parameters: describe(
    'Sets who sees the record: field rows with a label and a `properties` value in `plain`, edited in place.',
  ),
  play: async ({ canvasElement }) => {
    const access = regionOf(canvasElement, 'Acesso')

    await expect(access.getByText('Privado')).toBeVisible()
    await userEvent.click(access.getByRole('combobox', { name: /^Privado/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Sim' }))
    await waitFor(() => expect(access.getByText('Sim')).toBeVisible())
    await listboxClosed()
  },
  render: function Access({ variant }) {
    const [isPrivate, setIsPrivate] = useState<string | null>('no')
    const [participants, setParticipants] = useState<readonly string[]>([
      'ana',
      'gabriel',
    ])

    return (
      <RecordGroup title="Acesso" variant={variant}>
        <RecordGroupRow label="Privado">
          <SelectProperty
            ariaLabel="Privado"
            onValueChange={setIsPrivate}
            options={yesNoOptions}
            value={isPrivate}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Participantes">
          <PeopleProperty
            ariaLabel="Participantes"
            onValueChange={setParticipants}
            options={peopleOptions}
            value={participants}
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

export const Briefing: Story = {
  parameters: describe(
    'Edits a form behind one row: the row (icon, title, status badge) opens a `RecordPreview` with the fields, the save state in its description and the commands that save a draft or publish a version in its footer.',
  ),
  play: async ({ canvasElement }) => {
    const trigger = regionOf(canvasElement, 'Briefing').getByRole('button', {
      name: 'Briefing Rascunho',
    })
    await expect(getComputedStyle(trigger).textAlign).toBe('start')

    await userEvent.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Briefing' })
    const briefing = within(dialog)
    await expectWholeLabels(dialog, briefLabels)
    const status = briefing.getByTestId('brief-status')
    const saveDraft = briefing.getByRole('button', { name: 'Salvar rascunho' })
    const publish = briefing.getByRole('button', { name: 'Publicar versão' })
    await expect(status).toHaveTextContent('Rascunho salvo em 08/10/2026')
    await expect(saveDraft).toBeDisabled()

    await userEvent.click(
      briefing.getByRole('combobox', { name: /^Objetivo 2/ }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Fortalecer indicação' }),
    )
    await waitFor(() => expect(saveDraft).toBeEnabled())
    await expect(status).toHaveTextContent('Alterações não salvas')
    await listboxClosed()

    await userEvent.click(saveDraft)
    await waitFor(() =>
      expect(status).toHaveTextContent('Rascunho salvo em 09/10/2026'),
    )
    await userEvent.click(publish)
    await waitFor(() =>
      expect(status).toHaveTextContent('Versão 2 publicada em 09/10/2026'),
    )
    await expect(publish).toBeDisabled()

    await userEvent.click(briefing.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(trigger).toHaveAccessibleName('Briefing Publicada')
  },
  render: function Briefing({ variant }) {
    const [versions, setVersions] = useState(initialVersions)
    const latest = versions[0] as BriefVersion
    const [brief, setBrief] = useState<BriefValues>(latest.values)
    const [open, setOpen] = useState(false)
    const dirty = !sameValues(brief, latest.values)

    const commit = (status: BriefVersion['status']) =>
      setVersions((current) => {
        const [head, ...rest] = current as [BriefVersion, ...BriefVersion[]]
        const next = { savedAt: today, status, values: brief }
        return head.status === 'draft'
          ? [{ ...head, ...next }, ...rest]
          : [{ ...next, number: head.number + 1 }, ...current]
      })

    const status = dirty
      ? 'Alterações não salvas'
      : latest.status === 'draft'
        ? `Rascunho salvo em ${latest.savedAt}`
        : `Versão ${latest.number} publicada em ${latest.savedAt}`

    return (
      <>
        <RecordGroup title="Briefing" variant={variant}>
          <RecordGroupLink
            leading={<ClipboardListIcon aria-hidden />}
            meta={statusBadges[latest.status]}
            onClick={() => setOpen(true)}
            render={<button type="button" />}
          >
            Briefing
          </RecordGroupLink>
        </RecordGroup>
        <RecordPreview
          closeLabel="Fechar"
          description={
            <span aria-live="polite" data-testid="brief-status">
              {status}
            </span>
          }
          footer={
            <>
              <Button
                disabled={!dirty}
                onClick={() => commit('draft')}
                variant="outline"
              >
                Salvar rascunho
              </Button>
              <Button
                disabled={!dirty && latest.status === 'published'}
                onClick={() => commit('published')}
              >
                Publicar versão
              </Button>
            </>
          }
          onOpenChange={setOpen}
          open={open}
          title="Briefing"
        >
          {briefFields.map((field) => (
            <RecordGroupRow key={field.key} label={field.label}>
              <SelectProperty
                ariaLabel={field.label}
                fallback={field.empty}
                onValueChange={(value) =>
                  setBrief((current) => ({ ...current, [field.key]: value }))
                }
                options={field.options}
                value={brief[field.key]}
                variant="plain"
              />
            </RecordGroupRow>
          ))}
        </RecordPreview>
      </>
    )
  },
}

export const Versions: Story = {
  parameters: describe(
    'Lists the history of a record: each version is a trigger row (icon, title, status badge) that opens its fields, read-only, in a `RecordPreview`.',
  ),
  play: async ({ canvasElement }) => {
    const versions = regionOf(canvasElement, 'Versões')
    const first = versions.getByRole('button', { name: 'Versão 1 Publicada' })

    await expect(
      versions.getByRole('button', { name: 'Versão 2 Rascunho' }),
    ).toBeVisible()
    await expect(first).not.toHaveAttribute('aria-expanded')

    await userEvent.click(first)
    const dialog = await screen.findByRole('dialog', { name: 'Versão 1' })
    const preview = within(dialog)
    await expectWholeLabels(dialog, briefLabels)
    await waitFor(() =>
      expect(preview.getByText('Publicada em 26/09/2026')).toBeVisible(),
    )
    await expect(preview.getByText('Consulta agendada')).toBeVisible()

    await userEvent.click(preview.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(first).toHaveFocus())
  },
  render: function Versions({ variant }) {
    const [open, setOpen] = useState(false)
    const [previewNumber, setPreviewNumber] = useState(1)
    const previewed = initialVersions.find(
      (version) => version.number === previewNumber,
    ) as BriefVersion

    return (
      <>
        <RecordGroup title="Versões" variant={variant}>
          {initialVersions.map((version) => (
            <RecordGroupLink
              key={version.number}
              leading={<HistoryIcon aria-hidden />}
              meta={statusBadges[version.status]}
              onClick={() => {
                setPreviewNumber(version.number)
                setOpen(true)
              }}
              render={<button type="button" />}
            >
              {`Versão ${version.number}`}
            </RecordGroupLink>
          ))}
        </RecordGroup>
        <RecordPreview
          closeLabel="Fechar"
          description={
            previewed.status === 'draft'
              ? `Rascunho salvo em ${previewed.savedAt}`
              : `Publicada em ${previewed.savedAt}`
          }
          onOpenChange={setOpen}
          open={open}
          title={`Versão ${previewed.number}`}
        >
          {briefFields.map((field) => (
            <RecordGroupRow key={field.key} label={field.label}>
              <SelectProperty
                ariaLabel={`${field.label} da versão ${previewed.number}`}
                fallback={field.empty}
                options={field.options}
                readOnly
                value={previewed.values[field.key]}
                variant="plain"
              />
            </RecordGroupRow>
          ))}
        </RecordPreview>
      </>
    )
  },
}

export const LinkedRecords: Story = {
  parameters: describe(
    'Follows records tied to this one: each row is a link (entity icon, name, status and date) that opens the linked record.',
  ),
  play: async ({ canvasElement }) => {
    const links = regionOf(canvasElement, 'Parcelas').getAllByRole('link')

    await expect(links.map((link) => link.textContent)).toEqual([
      'Parcela 1Paga · 10/09/2026',
      'Parcela 2Prevista · 10/10/2026',
      'Parcela 3Prevista · 10/11/2026',
    ])
    await expect(links[1]).toHaveAttribute('href', '#/lancamentos/parcela-2')
  },
  render: function LinkedRecords({ variant }) {
    return (
      <RecordGroup title="Parcelas" variant={variant}>
        {installments.map((installment) => (
          <RecordGroupLink
            href={`#/lancamentos/${installment.id}`}
            key={installment.id}
            leading={<ReceiptTextIcon aria-hidden />}
            meta={installment.status}
          >
            {installment.name}
          </RecordGroupLink>
        ))}
      </RecordGroup>
    )
  },
}

export const Document: Story = {
  parameters: describe(
    'Shows the file attached to the record: a link row with the type icon, the file name, and the type and date.',
  ),
  play: async ({ canvasElement }) => {
    await expect(
      regionOf(canvasElement, 'Documento').getByRole('link', {
        name: 'contrato-assinado.pdf PDF · 12/08/2026',
      }),
    ).toHaveAttribute('href', '#/documentos/contrato-assinado.pdf')
  },
  render: function Document({ variant }) {
    return (
      <RecordGroup title="Documento" variant={variant}>
        <RecordGroupLink
          href="#/documentos/contrato-assinado.pdf"
          leading={<FileTextIcon aria-hidden />}
          meta="PDF · 12/08/2026"
        >
          contrato-assinado.pdf
        </RecordGroupLink>
      </RecordGroup>
    )
  },
}

export const Empty: Story = {
  parameters: describe(
    'Shows that the record has no file yet: the group starts closed while empty, and opening it shows the absence as text at the start of the content, with no vertical padding and no footer.',
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Documento',
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    const message = await regionOf(canvasElement, 'Documento').findByText(
      'Sem documento assinado',
    )
    await expect(message).toBeVisible()
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement
    await expect(getComputedStyle(content).paddingTop).toBe('0px')
    await expect(getComputedStyle(content).paddingBottom).toBe('0px')
    await expect(getComputedStyle(message).textAlign).toBe('start')
    await expect(
      canvasElement.querySelector('[data-slot="record-group-footer"]'),
    ).toBeNull()
  },
  render: function Empty({ variant }) {
    return (
      <RecordGroup empty title="Documento" variant={variant}>
        <p className="text-muted-foreground text-sm">Sem documento assinado</p>
      </RecordGroup>
    )
  },
}

export const Billing: Story = {
  parameters: describe(
    'Fills a form and runs its command: field rows, with the command that issues the charge in the group footer, inside the same group.',
  ),
  play: async ({ canvasElement }) => {
    const charge = regionOf(canvasElement, 'Cobrança')
    const issue = charge.getByRole('button', { name: 'Emitir cobrança' })
    await expect(charge.getByText('Não emitida')).toBeVisible()
    await expect(issue).toBeDisabled()

    await userEvent.click(charge.getByRole('combobox', { name: /^Meio/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Pix' }))
    await waitFor(() => expect(issue).toBeEnabled())
    await listboxClosed()

    await userEvent.click(issue)
    await expect(charge.getByText('Emitida em 09/10/2026')).toBeVisible()
    await expect(
      charge.getByRole('button', { name: 'Emitir segunda via' }),
    ).toBeEnabled()
  },
  render: function Billing({ variant }) {
    const [method, setMethod] = useState<string | null>(null)
    const [issuedAt, setIssuedAt] = useState<string | null>(null)

    return (
      <RecordGroup
        footer={
          <Button
            disabled={method === null}
            onClick={() => setIssuedAt(today)}
            size="sm"
            variant={issuedAt ? 'outline' : 'default'}
          >
            {issuedAt ? 'Emitir segunda via' : 'Emitir cobrança'}
          </Button>
        }
        title="Cobrança"
        variant={variant}
      >
        <RecordGroupRow label="Meio">
          <SelectProperty
            ariaLabel="Meio"
            fallback="Sem meio"
            onValueChange={setMethod}
            options={paymentMethodOptions}
            value={method}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Vencimento">
          <DateProperty
            ariaLabel="Vencimento"
            locale="pt-BR"
            readOnly
            timeZone="UTC"
            value="2026-10-10T12:00:00.000Z"
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Emissão">
          <TextProperty
            ariaLabel="Emissão"
            fallback="Não emitida"
            value={issuedAt ? `Emitida em ${issuedAt}` : null}
            variant="plain"
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

export const Details: Story = {
  parameters: describe(
    'Keeps secondary data: field rows edited in place, with “Sem …” for an empty value.',
  ),
  play: async ({ canvasElement }) => {
    await expectWholeLabels(
      within(canvasElement).getByRole('region', { name: 'Mais informações' }),
      ['Nascimento', 'CPF', 'Profissão', 'Origem'],
    )
    const details = regionOf(canvasElement, 'Mais informações')
    await expect(details.getByRole('textbox', { name: 'CPF' })).toHaveValue(
      '123.456.789-09',
    )

    const occupation = details.getByRole('textbox', { name: 'Profissão' })
    await expect(occupation).toHaveAttribute('placeholder', 'Sem profissão')
    await userEvent.type(occupation, 'Engenheira')
    await userEvent.tab()
    await expect(occupation).toHaveValue('Engenheira')
  },
  render: function Details({ variant }) {
    const [birthDate, setBirthDate] = useState<string | null>(
      '1988-03-14T12:00:00.000Z',
    )
    const [cpf, setCpf] = useState<string | null>('123.456.789-09')
    const [occupation, setOccupation] = useState<string | null>(null)
    const [source, setSource] = useState<string | null>('referral')

    return (
      <RecordGroup title="Mais informações" variant={variant}>
        <RecordGroupRow label="Nascimento">
          <DateProperty
            ariaLabel="Nascimento"
            locale="pt-BR"
            onValueChange={setBirthDate}
            timeZone="UTC"
            value={birthDate}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="CPF">
          <TextProperty
            ariaLabel="CPF"
            editing="inline"
            onCommit={setCpf}
            value={cpf}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Profissão">
          <TextProperty
            ariaLabel="Profissão"
            editing="inline"
            fallback="Sem profissão"
            onCommit={setOccupation}
            value={occupation}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Origem">
          <SelectProperty
            ariaLabel="Origem"
            onValueChange={setSource}
            options={sourceOptions}
            value={source}
            variant="plain"
          />
        </RecordGroupRow>
      </RecordGroup>
    )
  },
}

export const Stage: Story = {
  parameters: describe(
    'Holds the work of the current stage: field rows and a link to a record the stage produced, such as the scheduled appointment.',
  ),
  play: async ({ canvasElement }) => {
    const stage = regionOf(canvasElement, 'Novo Lead')
    await expect(stage.getByText('Sem urgência')).toBeVisible()
    await expect(
      stage.getByRole('link', {
        name: 'Consulta inicial Agendada · 14/10 às 10:00',
      }),
    ).toHaveAttribute('href', '#/agenda/consulta-inicial')

    await userEvent.click(stage.getByRole('combobox', { name: /^Urgência/ }))
    await userEvent.click(await screen.findByRole('option', { name: 'Alta' }))
    await waitFor(() => expect(stage.getByText('Alta')).toBeVisible())
    await listboxClosed()
  },
  render: function Stage({ variant }) {
    const [interest, setInterest] = useState<string | null>('banking')
    const [urgency, setUrgency] = useState<string | null>(null)

    return (
      <RecordGroup title="Novo Lead" variant={variant}>
        <RecordGroupRow label="Interesse">
          <SelectProperty
            ariaLabel="Interesse"
            onValueChange={setInterest}
            options={interestOptions}
            value={interest}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Urgência">
          <SelectProperty
            ariaLabel="Urgência"
            fallback="Sem urgência"
            onValueChange={setUrgency}
            options={urgencyOptions}
            value={urgency}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupLink
          href="#/agenda/consulta-inicial"
          leading={<CalendarClockIcon aria-hidden />}
          meta="Agendada · 14/10 às 10:00"
        >
          Consulta inicial
        </RecordGroupLink>
      </RecordGroup>
    )
  },
}

interface ActivityEntry {
  actor: { initials: string; name: string }
  ago: string
  at: string
  id: string
  summary: ReactNode
}

const gabriel = { initials: 'G', name: 'Gabriel Melo' }

const activityEntries: readonly ActivityEntry[] = [
  {
    actor: gabriel,
    ago: 'há 1 mês',
    at: '2026-09-09T14:20',
    id: 'company',
    summary: (
      <>
        <span className="text-muted-foreground">alterou</span> Empresa{' '}
        <span className="text-muted-foreground">para</span>{' '}
        <span className="inline-flex items-center gap-1 align-bottom">
          <Building2Icon aria-hidden className="size-4 text-muted-foreground" />
          PayPal
        </span>
      </>
    ),
  },
  {
    actor: gabriel,
    ago: 'há 1 mês',
    at: '2026-09-09T14:18',
    id: 'attributes',
    summary: (
      <>
        <span className="text-muted-foreground">alterou</span> 2 atributos
      </>
    ),
  },
  {
    actor: gabriel,
    ago: 'há 1 mês',
    at: '2026-09-09T14:15',
    id: 'created',
    summary: (
      <>
        <span className="text-muted-foreground">criou</span> Pessoa
      </>
    ),
  },
]

export const Activity: StoryObj<UsageArgs & { onViewAll: () => void }> = {
  args: { onViewAll: fn(), variant: 'inset' },
  argTypes: { onViewAll: { control: false } },
  parameters: describe(
    'Shows what changed on the record, newest first: each entry is a `RecordGroupItem` with the author avatar, a sentence with the names in ink and the verbs muted, and the relative date as a `time` in the trailing slot. `Ver tudo` in `actions` opens the full history.',
  ),
  play: async ({ args, canvasElement }) => {
    const activity = regionOf(canvasElement, 'Atividade')

    await expect(
      canvasElement.querySelector('[data-slot="record-group"]'),
    ).toHaveAttribute('data-variant', args.variant)
    await expect(
      Array.from(
        canvasElement.querySelectorAll('[data-slot="record-group-item-title"]'),
        (title) => title.textContent,
      ),
    ).toEqual([
      'Gabriel Melo alterou Empresa para PayPal',
      'Gabriel Melo alterou 2 atributos',
      'Gabriel Melo criou Pessoa',
    ])
    await expect(
      Array.from(canvasElement.querySelectorAll('time'), (time) =>
        time.getAttribute('datetime'),
      ),
    ).toEqual(['2026-09-09T14:20', '2026-09-09T14:18', '2026-09-09T14:15'])

    await userEvent.click(activity.getByRole('button', { name: 'Ver tudo' }))
    await expect(args.onViewAll).toHaveBeenCalledTimes(1)
  },
  render: function Activity({ onViewAll, variant }) {
    return (
      <RecordGroup
        actions={
          <Button onClick={onViewAll} size="xs" variant="ghost">
            Ver tudo
          </Button>
        }
        title="Atividade"
        variant={variant}
      >
        {activityEntries.map(({ actor, ago, at, id, summary }) => (
          <RecordGroupItem
            key={id}
            leading={
              <Avatar aria-hidden size="xs">
                <AvatarFallback>{actor.initials}</AvatarFallback>
              </Avatar>
            }
            title={
              <>
                {actor.name} {summary}
              </>
            }
          >
            <time className="text-muted-foreground" dateTime={at}>
              {ago}
            </time>
          </RecordGroupItem>
        ))}
      </RecordGroup>
    )
  },
}

const authorInitial = (id: string) =>
  noteAuthors.find((author) => author.value === id)?.label.charAt(0) ?? ''

export const Notes: StoryObj<
  UsageArgs & { onCopyLink: (id: string) => void; onViewAll: () => void }
> = {
  args: {
    onCopyLink: fn((_id: string) => {}),
    onViewAll: fn(),
    variant: 'inset',
  },
  argTypes: {
    onCopyLink: { control: false },
    onViewAll: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Keeps the notes of the record, newest first: the title carries the count, and each note is a `RecordGroupLink` rendered as a `button` with the author avatar, the title in ink, the first lines of the body muted and the relative date as a `time` in `meta`. A row opens the note in the `NoteDialog` of `Patterns/Records/Dialog/Usages/Notes`, + opens it empty, and a save moves the note to the top. One `NoteDialog` serves every request and resets its fields when `note` changes. `Ver tudo` opens the full list.',
      },
      source: { inlineLimit: 250 },
    },
  },
  play: async ({ args, canvasElement }) => {
    const group = within(canvasElement).getByRole('region', {
      name: /^Notas/,
    })
    const notes = within(group)
    const names = () =>
      Array.from(
        group.querySelectorAll('[data-slot="record-group-link-name"]'),
        (name) => name.textContent,
      )

    await expect(group).toHaveAttribute('data-variant', args.variant)
    await expect(group).toHaveAccessibleName('Notas 2')
    await expect(names()).toEqual([
      'Preferências de contato Prefere contato por WhatsApp depois das 18h.',
      'Nota sem título Esta nota não tem conteúdo',
    ])
    await expect(
      Array.from(group.querySelectorAll('time'), (time) => time.textContent),
    ).toEqual(['há 2 minutos', 'há 3 dias'])

    await userEvent.click(notes.getByRole('button', { name: 'Ver tudo' }))
    await expect(args.onViewAll).toHaveBeenCalledTimes(1)

    await userEvent.click(notes.getByRole('button', { name: 'Nova nota' }))
    const created = within(
      await screen.findByRole('dialog', { name: 'Nova nota' }),
    )
    await userEvent.type(
      created.getByRole('textbox', { name: 'Título da nota' }),
      'Ligação de retorno',
    )
    await userEvent.click(created.getByRole('button', { name: /Criar nota/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(group).toHaveAccessibleName('Notas 3')
    await expect(names()[0]).toBe(
      'Ligação de retorno Esta nota não tem conteúdo',
    )
    await expect(group.querySelector('time')).toHaveTextContent('agora')

    const contact = notes.getByRole('button', {
      name: /^Preferências de contato/,
    })
    await userEvent.click(contact)
    const edited = within(
      await screen.findByRole('dialog', { name: 'Editar nota' }),
    )
    await expect(
      edited.getByRole('textbox', { name: 'Título da nota' }),
    ).toHaveValue('Preferências de contato')
    await userEvent.click(edited.getByRole('button', { name: 'Copiar link' }))
    await expect(args.onCopyLink).toHaveBeenCalledWith('note-contact')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  render: function Notes({ onCopyLink, onViewAll, variant }) {
    const [notes, setNotes] = useState<readonly Note[]>(initialNotes)
    const [editing, setEditing] = useState<Note | null>(null)
    const [open, setOpen] = useState(false)

    const openNote = (note: Note | null) => {
      setEditing(note)
      setOpen(true)
    }

    return (
      <>
        <RecordGroup
          actions={
            <>
              <Button onClick={onViewAll} size="xs" variant="ghost">
                Ver tudo
              </Button>
              <RecordGroupAction
                icon={PlusIcon}
                label="Nova nota"
                onClick={() => openNote(null)}
              />
            </>
          }
          title={
            <span className="inline-flex items-center gap-1.5">
              Notas <Badge variant="outline">{notes.length}</Badge>
            </span>
          }
          variant={variant}
        >
          {notes.map((note) => (
            <RecordGroupLink
              key={note.id}
              leading={
                <Avatar aria-hidden size="xs">
                  <AvatarFallback>{authorInitial(note.author)}</AvatarFallback>
                </Avatar>
              }
              meta={
                <time dateTime={note.updatedAt}>{noteAge(note.updatedAt)}</time>
              }
              onClick={() => openNote(note)}
              render={<button type="button" />}
            >
              {noteTitle(note)}{' '}
              <span className="text-muted-foreground">{notePreview(note)}</span>
            </RecordGroupLink>
          ))}
        </RecordGroup>
        <NoteDialog
          note={editing}
          onCopyLink={onCopyLink}
          onOpenChange={setOpen}
          onSave={(values) =>
            setNotes((current) => {
              const saved: Note = {
                author: editing?.author ?? noteAuthor,
                id: editing?.id ?? `note-${current.length + 1}`,
                ...values,
                updatedAt: notesNow,
              }
              return [saved, ...current.filter((note) => note.id !== saved.id)]
            })
          }
          open={open}
          recordName={noteRecordName}
        />
      </>
    )
  },
}
