import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Checklist,
  type ChecklistItem,
  DateProperty,
  PeopleProperty,
  type PeoplePropertyOption,
  RecordGroup,
  RecordGroupLink,
  RecordGroupRow,
  RecordPreview,
  SelectProperty,
  type SelectPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import {
  CalendarClockIcon,
  ClipboardListIcon,
  FileTextIcon,
  HistoryIcon,
  ReceiptTextIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'

import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { usageParameters } from '../../../../test-utils/usage-kit'

const today = '09/10/2026'

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

const meta = {
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
          'Groups a record page composes to edit and add content, one story per job. Each is a single `RecordGroup`, open here; a page picks the groups its use case needs and passes `defaultOpen={false}` when its footer opens closed.',
      },
    },
  },
  title: 'Patterns/Records/Group/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

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
  parameters: describe(
    'Tracks work to do: a `Checklist` in `plain` inside a `RecordGroup` in `inset`, so the rows sit in the group card at the same 36px as list rows. Check, rename, reorder, delete and add items.',
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('region', { name: 'Tarefas' })
    const tasks = within(group)

    await expect(group).toHaveAttribute('data-variant', 'inset')
    await expect(
      tasks.getByRole('region', { name: 'Lista de tarefas' }),
    ).toHaveAttribute('data-variant', 'plain')
    for (const item of group.querySelectorAll('[data-slot="checklist-item"]')) {
      await expect(item.getBoundingClientRect().height).toBe(36)
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
  render: function Tasks() {
    const [items, setItems] = useState<readonly ChecklistItem[]>([
      { completed: true, id: 'extracts', title: 'Baixar extratos de 2024' },
      { completed: false, id: 'appeal', title: 'Redigir contestação' },
    ])
    const [newItemTitle, setNewItemTitle] = useState('')

    return (
      <RecordGroup title="Tarefas" variant="inset">
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
  render: function Access() {
    const [isPrivate, setIsPrivate] = useState<string | null>('no')
    const [participants, setParticipants] = useState<readonly string[]>([
      'ana',
      'gabriel',
    ])

    return (
      <RecordGroup title="Acesso">
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
  render: function Briefing() {
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
        <RecordGroup title="Briefing">
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
  render: function Versions() {
    const [open, setOpen] = useState(false)
    const [previewNumber, setPreviewNumber] = useState(1)
    const previewed = initialVersions.find(
      (version) => version.number === previewNumber,
    ) as BriefVersion

    return (
      <>
        <RecordGroup title="Versões">
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
  render: function LinkedRecords() {
    return (
      <RecordGroup title="Parcelas">
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
  render: function Document() {
    return (
      <RecordGroup title="Documento">
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

export const DocumentEmpty: StoryObj<{ onAttachDocument: () => void }> = {
  args: { onAttachDocument: fn() },
  parameters: describe(
    'Asks for the missing file: the group starts closed while empty, and opening it shows the absence and the command that attaches one.',
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', {
      name: 'Documento',
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    const documentBlock = regionOf(canvasElement, 'Documento')
    await expect(
      await documentBlock.findByText('Sem documento assinado'),
    ).toBeVisible()
    await userEvent.click(
      await documentBlock.findByRole('button', { name: 'Anexar documento' }),
    )
    await expect(args.onAttachDocument).toHaveBeenCalledTimes(1)
  },
  render: ({ onAttachDocument }) => (
    <RecordGroup
      empty
      footer={
        <Button onClick={onAttachDocument} size="sm" variant="outline">
          Anexar documento
        </Button>
      }
      title="Documento"
    >
      <p className="text-muted-foreground text-sm">Sem documento assinado</p>
    </RecordGroup>
  ),
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
  render: function Billing() {
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
  render: function Details() {
    const [birthDate, setBirthDate] = useState<string | null>(
      '1988-03-14T12:00:00.000Z',
    )
    const [cpf, setCpf] = useState<string | null>('123.456.789-09')
    const [occupation, setOccupation] = useState<string | null>(null)
    const [source, setSource] = useState<string | null>('referral')

    return (
      <RecordGroup title="Mais informações">
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
  render: function Stage() {
    const [interest, setInterest] = useState<string | null>('banking')
    const [urgency, setUrgency] = useState<string | null>(null)

    return (
      <RecordGroup title="Novo Lead">
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
