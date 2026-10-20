import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupRow,
  Wizard,
  WizardFooter,
  WizardNext,
  WizardPrevious,
} from '@tc96/parttens'
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@tc96/ui/alert-dialog'
import { Button } from '@tc96/ui/button'
import { Checkbox } from '@tc96/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { Kbd } from '@tc96/ui/kbd'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@tc96/ui/toggle-group'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react'
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  acquisitionSources,
  adAccounts,
  bankingPilot,
  budgetModes,
  type CampaignDraft,
  type CampaignObjective,
  type CampaignStepValue,
  campaignDraftKey,
  campaignObjectives,
  campaignSteps,
  clearStoredCampaign,
  contractConversionRanges,
  emptyCampaign,
  entryChannels,
  expectedLeadRanges,
  optionLabel,
  owners,
  readStoredCampaign,
  specialCategories,
  writeStoredCampaign,
} from '../fixtures/campaign'
import { CurrencyField, DateRangeField, SelectField } from '../fixtures/fields'

type UpdateCampaign = (patch: Partial<CampaignDraft>) => void

interface StepProps {
  draft: CampaignDraft
  showErrors: boolean
  update: UpdateCampaign
}

const notSet = 'Sem definição'

const stepIndex = (value: string) =>
  campaignSteps.findIndex((step) => step.value === value)

const isPristine = (draft: CampaignDraft, reached: number) =>
  reached === 0 && JSON.stringify(draft) === JSON.stringify(emptyCampaign)

const hasBudgetAmount = (draft: CampaignDraft) =>
  Number(draft.budgetAmount.replace(',', '.')) > 0

const formatDate = (value: string) =>
  value ? value.split('-').reverse().join('/') : '…'

const modifierLabel =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.userAgent)
    ? '⌘'
    : 'Ctrl'

function BasicsStep({
  draft,
  showErrors,
  titleRef,
  update,
}: Readonly<StepProps & { titleRef: RefObject<HTMLInputElement | null> }>) {
  const titleMissing = showErrors && !draft.title.trim()

  return (
    <div className="flex flex-col gap-6">
      <Field invalid={titleMissing}>
        <FieldLabel>Título</FieldLabel>
        <Input
          size="lg"
          onValueChange={(title) => update({ title })}
          placeholder="Piloto bancário"
          ref={titleRef}
          value={draft.title}
        />
        {titleMissing ? (
          <FieldError match>Informe o título da campanha.</FieldError>
        ) : null}
      </Field>
      <SelectField
        label="Responsável"
        onValueChange={(owner) => update({ owner })}
        options={owners}
        placeholder="Selecione o responsável"
        value={draft.owner}
      />
      <DateRangeField
        label="Período planejado"
        onValueChange={({ from, to }) => update({ endsOn: to, startsOn: from })}
        value={{ from: draft.startsOn, to: draft.endsOn }}
      />
    </div>
  )
}

function CampaignStep({
  draft,
  update,
}: Readonly<Omit<StepProps, 'showErrors'>>) {
  return (
    <div className="flex flex-col gap-6">
      <SelectField
        label="Origem da aquisição"
        onValueChange={(source) => update({ source })}
        options={acquisitionSources}
        placeholder="Selecione a origem"
        value={draft.source}
      />
      <SelectField
        label="Canal de entrada"
        onValueChange={(channel) => update({ channel })}
        options={entryChannels}
        placeholder="Selecione o canal"
        value={draft.channel}
      />
      <SelectField
        label="Leads esperados"
        onValueChange={(expectedLeads) => update({ expectedLeads })}
        options={expectedLeadRanges}
        placeholder={notSet}
        value={draft.expectedLeads}
      />
      <SelectField
        label="Conversão em contratos"
        onValueChange={(conversion) => update({ conversion })}
        options={contractConversionRanges}
        placeholder={notSet}
        value={draft.conversion}
      />
    </div>
  )
}

function ObjectiveOption({
  objective,
}: Readonly<{ objective: CampaignObjective }>) {
  return (
    <span className="flex min-w-0 flex-col text-start">
      <span className="truncate">{objective.label}</span>
      <span className="truncate text-muted-foreground text-xs">
        {objective.description}
      </span>
    </span>
  )
}

function AdsStep({
  draft,
  firstAccountRef,
  showErrors,
  update,
}: Readonly<
  StepProps & { firstAccountRef: RefObject<HTMLButtonElement | null> }
>) {
  const id = useId()
  const accountsMissing = showErrors && draft.adAccounts.length === 0

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground text-sm">
        Criada no Meta, uma vez em cada conta escolhida.
      </p>
      <fieldset
        aria-describedby={accountsMissing ? `${id}-accounts-error` : undefined}
        className="flex flex-col gap-3"
      >
        <legend className="mb-3 font-medium text-sm">Contas de anúncios</legend>
        {adAccounts.map((account, index) => (
          <div className="flex items-center gap-2" key={account.value}>
            <Checkbox
              aria-invalid={accountsMissing || undefined}
              checked={draft.adAccounts.includes(account.value)}
              id={`${id}-${account.value}`}
              onCheckedChange={(checked) =>
                update({
                  adAccounts: checked
                    ? [...draft.adAccounts, account.value]
                    : draft.adAccounts.filter(
                        (value) => value !== account.value,
                      ),
                })
              }
              ref={index === 0 ? firstAccountRef : undefined}
            />
            <label
              className="flex items-center gap-2 text-sm"
              htmlFor={`${id}-${account.value}`}
            >
              {account.label}
              <span className="text-muted-foreground text-xs">
                {account.currency}
              </span>
            </label>
          </div>
        ))}
        {accountsMissing ? (
          <p
            className="text-destructive-foreground text-xs"
            id={`${id}-accounts-error`}
          >
            Escolha ao menos uma conta de anúncios.
          </p>
        ) : null}
      </fieldset>
      <Field>
        <FieldLabel>Nome da campanha de anúncios</FieldLabel>
        <Input
          size="lg"
          onValueChange={(adName) => update({ adName })}
          value={draft.adName ?? draft.title}
        />
      </Field>
      <Field>
        <FieldLabel>Objetivo</FieldLabel>
        <Select
          itemToStringValue={(item) => item.value}
          onValueChange={(objective) => {
            if (objective) update({ objective: objective.value })
          }}
          value={campaignObjectives.find(
            (objective) => objective.value === draft.objective,
          )}
        >
          <SelectTrigger className="py-1" size="lg">
            <SelectValue>
              {(objective: CampaignObjective) => (
                <ObjectiveOption objective={objective} />
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {campaignObjectives.map((objective) => (
              <SelectItem key={objective.value} value={objective}>
                <ObjectiveOption objective={objective} />
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </Field>
      <SelectField
        description="Confira se o anúncio fala de crédito ou de produtos financeiros, como empréstimos. O Meta limita idade, gênero e raio de localização nessas categorias."
        label="Categoria especial"
        onValueChange={(specialCategory) => update({ specialCategory })}
        options={specialCategories}
        placeholder="Selecione a categoria"
        value={draft.specialCategory}
      />
    </div>
  )
}

function BudgetStep({
  amountRef,
  draft,
  showErrors,
  update,
}: Readonly<StepProps & { amountRef: RefObject<HTMLInputElement | null> }>) {
  const amountMissing =
    showErrors && draft.budgetMode === 'daily' && !hasBudgetAmount(draft)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted-foreground text-sm">
        Vale para a campanha de anúncios no Meta. O orçamento é opcional.
      </p>
      <ToggleGroup
        aria-label="Tipo de orçamento"
        onValueChange={([mode]) => {
          if (mode === 'none' || mode === 'daily') update({ budgetMode: mode })
        }}
        value={[draft.budgetMode]}
        variant="outline"
      >
        {budgetModes.map((mode) => (
          <ToggleGroupItem key={mode.value} value={mode.value}>
            {mode.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {draft.budgetMode === 'daily' ? (
        <CurrencyField
          error={amountMissing ? 'Informe um valor maior que zero.' : undefined}
          inputRef={amountRef}
          label="Valor por dia"
          onValueChange={(budgetAmount) => update({ budgetAmount })}
          value={draft.budgetAmount}
        />
      ) : null}
    </div>
  )
}

interface ReviewSection {
  rows: [string, ReactNode][]
  step: CampaignStepValue
  title: string
}

function ReviewStep({
  draft,
  onEdit,
}: Readonly<{
  draft: CampaignDraft
  onEdit: (step: CampaignStepValue) => void
}>) {
  const accounts = adAccounts.filter((account) =>
    draft.adAccounts.includes(account.value),
  )
  const period =
    draft.startsOn || draft.endsOn
      ? `${formatDate(draft.startsOn)} a ${formatDate(draft.endsOn)}`
      : notSet
  const sections: ReviewSection[] = [
    {
      rows: [
        ['Título', draft.title],
        ['Responsável', optionLabel(owners, draft.owner) ?? notSet],
        ['Período planejado', period],
      ],
      step: 'basics',
      title: 'Informações iniciais',
    },
    {
      rows: [
        [
          'Origem da aquisição',
          optionLabel(acquisitionSources, draft.source) ?? notSet,
        ],
        [
          'Canal de entrada',
          optionLabel(entryChannels, draft.channel) ?? notSet,
        ],
        [
          'Leads esperados',
          optionLabel(expectedLeadRanges, draft.expectedLeads) ?? notSet,
        ],
        [
          'Conversão',
          optionLabel(contractConversionRanges, draft.conversion) ?? notSet,
        ],
      ],
      step: 'campaign',
      title: 'Campanha',
    },
    {
      rows: [
        [
          'Contas de anúncios',
          <span className="flex min-w-0 flex-col" key="accounts">
            {accounts.map((account) => (
              <span className="truncate" key={account.value}>
                {account.label} ({account.currency})
              </span>
            ))}
          </span>,
        ],
        ['Nome', draft.adName ?? draft.title],
        ['Objetivo', optionLabel(campaignObjectives, draft.objective)],
        [
          'Categoria especial',
          optionLabel(specialCategories, draft.specialCategory) ?? notSet,
        ],
      ],
      step: 'ads',
      title: 'Campanha de anúncios',
    },
    {
      rows: [
        [
          'Orçamento',
          draft.budgetMode === 'daily'
            ? `R$ ${draft.budgetAmount} por dia, em cada conta`
            : 'Sem orçamento',
        ],
      ],
      step: 'budget',
      title: 'Orçamento',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <RecordGroup
          actions={
            <RecordGroupAction
              icon={PencilIcon}
              label={`Editar ${section.title}`}
              onClick={() => onEdit(section.step)}
            />
          }
          key={section.step}
          title={section.title}
          variant="inset"
        >
          {section.rows.map(([label, detail]) => (
            <RecordGroupRow align="between" key={label} label={label}>
              {detail}
            </RecordGroupRow>
          ))}
        </RecordGroup>
      ))}
    </div>
  )
}

function DiscardButton({ onDiscard }: Readonly<{ onDiscard: () => void }>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            aria-label="Descartar criação"
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <Trash2Icon aria-hidden="true" />
      </AlertDialogTrigger>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Descartar esta criação?</AlertDialogTitle>
          <AlertDialogDescription>
            O que você preencheu neste navegador será apagado. Não dá para
            desfazer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancelar
          </AlertDialogClose>
          <AlertDialogClose
            onClick={onDiscard}
            render={<Button variant="destructive" />}
          >
            Descartar criação
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  )
}

interface CampaignWizardArgs {
  onCancel: () => void
  onDiscard: () => void
  onSubmit: (draft: CampaignDraft) => void
}

function CampaignWizard({
  onCancel,
  onDiscard,
  onSubmit,
}: Readonly<CampaignWizardArgs>) {
  const [stored] = useState(readStoredCampaign)
  const [draft, setDraft] = useState(() => stored?.draft ?? emptyCampaign)
  const [step, setStep] = useState(() => stored?.step ?? 'basics')
  const [reached, setReached] = useState(() => stored?.reached ?? 0)
  const [showErrors, setShowErrors] = useState(false)
  const [created, setCreated] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const firstAccountRef = useRef<HTMLButtonElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)
  const saved = !created && !isPristine(draft, reached)
  const steps = campaignSteps.map((item, index) => ({
    ...item,
    disabled: index > reached,
  }))
  const invalid: Record<string, boolean> = {
    ads: draft.adAccounts.length === 0,
    basics: !draft.title.trim(),
    budget: draft.budgetMode === 'daily' && !hasBudgetAmount(draft),
  }
  const invalidFocus: Record<string, RefObject<HTMLElement | null>> = {
    ads: firstAccountRef,
    basics: titleRef,
    budget: amountRef,
  }

  useEffect(() => {
    if (saved) writeStoredCampaign({ draft, reached, step })
  }, [draft, reached, saved, step])

  const update: UpdateCampaign = (patch) =>
    setDraft((current) => ({ ...current, ...patch }))

  const goTo = (next: string) => {
    setStep(next)
    setReached((current) => Math.max(current, stepIndex(next)))
    setShowErrors(false)
  }

  const reset = () => {
    clearStoredCampaign()
    setDraft(emptyCampaign)
    setStep('basics')
    setReached(0)
    setShowErrors(false)
    setCreated(false)
  }

  const create = () => {
    if (created) return
    onSubmit(draft)
    clearStoredCampaign()
    setCreated(true)
  }

  const createOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step === 'review') create()
  }

  const submitOnModEnter = (event: KeyboardEvent<HTMLFormElement>) => {
    if (step !== 'review' || event.key !== 'Enter') return
    if (!event.metaKey && !event.ctrlKey) return
    event.preventDefault()
    event.currentTarget.requestSubmit()
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <header className="flex min-h-8 flex-wrap items-center gap-3">
        <nav aria-label="Trilha">
          <ol className="m-0 flex list-none items-center gap-1.5 p-0 text-sm">
            <li className="text-muted-foreground">Campanhas</li>
            <li aria-hidden="true" className="text-muted-foreground">
              <ChevronRightIcon className="size-4" />
            </li>
            <li aria-current="page" className="font-medium">
              Nova campanha
            </li>
          </ol>
        </nav>
        {saved ? (
          <div className="ms-auto flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              Progresso salvo neste navegador
            </span>
            <DiscardButton
              onDiscard={() => {
                reset()
                onDiscard()
              }}
            />
          </div>
        ) : null}
      </header>
      <form onKeyDown={submitOnModEnter} onSubmit={createOnSubmit}>
        <Wizard
          label="Etapas da campanha"
          onValueChange={goTo}
          steps={steps}
          value={step}
        >
          {step === 'basics' ? (
            <BasicsStep
              draft={draft}
              showErrors={showErrors}
              titleRef={titleRef}
              update={update}
            />
          ) : null}
          {step === 'campaign' ? (
            <CampaignStep draft={draft} update={update} />
          ) : null}
          {step === 'ads' ? (
            <AdsStep
              draft={draft}
              firstAccountRef={firstAccountRef}
              showErrors={showErrors}
              update={update}
            />
          ) : null}
          {step === 'budget' ? (
            <BudgetStep
              amountRef={amountRef}
              draft={draft}
              showErrors={showErrors}
              update={update}
            />
          ) : null}
          {step === 'review' ? (
            <ReviewStep draft={draft} onEdit={goTo} />
          ) : null}
          <output className="flex items-center gap-2 text-sm empty:hidden">
            {created ? (
              <>
                <CircleCheckIcon aria-hidden="true" className="size-4" />
                Campanha {draft.title} criada.
              </>
            ) : null}
          </output>
          <WizardFooter>
            {step === 'basics' ? (
              <Button onClick={onCancel} variant="ghost">
                Cancelar
              </Button>
            ) : (
              <WizardPrevious>
                <ArrowLeftIcon aria-hidden="true" />
                Voltar
              </WizardPrevious>
            )}
            {step === 'review' ? (
              <Button
                aria-keyshortcuts="Meta+Enter Control+Enter"
                disabled={created}
                type="submit"
              >
                Criar campanha
                <Kbd
                  aria-hidden="true"
                  className="bg-primary-foreground/16 text-primary-foreground"
                >
                  {modifierLabel} ↵
                </Kbd>
              </Button>
            ) : (
              <WizardNext
                onClick={(event) => {
                  if (!invalid[step]) return
                  event.preventDefault()
                  setShowErrors(true)
                  invalidFocus[step]?.current?.focus()
                }}
              >
                Continuar
                <ArrowRightIcon aria-hidden="true" />
              </WizardNext>
            )}
          </WizardFooter>
        </Wizard>
      </form>
    </div>
  )
}

const seedResumedCampaign = () =>
  writeStoredCampaign({ draft: bankingPilot, reached: 4, step: 'review' })

const storedCampaign = () => localStorage.getItem(campaignDraftKey)

const meta = {
  args: {
    onCancel: fn(),
    onDiscard: fn(),
    onSubmit: fn((_draft: CampaignDraft) => {}),
  },
  parameters: {
    docs: {
      description: {
        component:
          'A campaign creation flow on the `Wizard` pattern, with the structure of the `Deal` usage: the initial info (title, owner and planned period), the campaign data, the Meta ad campaign (accounts, objective, special category), an optional daily budget and a review with one inset `RecordGroup` per step, whose action edits it. The fields go one per row, and the objective is a `Select` with object values whose description truncates. The story owns the draft and saves it in `localStorage` while it differs from an empty one, so a reload resumes it at the same step; the trash button asks before discarding it. `WizardNext` cancels its move while the step is invalid and focuses the field, the nav reaches steps up to the furthest one visited, and on the review `Criar campanha` or ⌘/Ctrl + Enter creates the campaign.',
      },
    },
    layout: 'padded',
  },
  render: (args) => <CampaignWizard {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Wizard/Usages/Campaign',
} satisfies Meta<CampaignWizardArgs>

export default meta

type Story = StoryObj<typeof meta>

const nextButton = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('button', { name: 'Continuar' })

export const Default: Story = {
  beforeEach: () => {
    if (import.meta.env.VITEST) clearStoredCampaign()
  },
  parameters: {
    docs: {
      description: {
        story:
          'No scripted interaction. Fill a step and reload: the draft comes back from `localStorage` at the same step.',
      },
    },
  },
}

export const CreateCampaign: Story = {
  beforeEach: clearStoredCampaign,
  parameters: {
    docs: {
      description: {
        story:
          'The full walk from an empty draft: each step blocks `Continuar` until it is valid, the progress is saved after the first change, and ⌘/Ctrl + Enter on the review creates the campaign and clears the saved draft.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByText('Progresso salvo neste navegador'),
    ).toBeNull()

    await userEvent.click(nextButton(canvasElement))
    await expect(
      canvas.getByText('Informe o título da campanha.'),
    ).toBeVisible()
    const title = canvas.getByRole('textbox', { name: 'Título' })
    await expect(title).toHaveFocus()

    await userEvent.type(title, 'Piloto bancário')
    await expect(
      canvas.getByText('Progresso salvo neste navegador'),
    ).toBeVisible()
    await userEvent.click(nextButton(canvasElement))
    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Campanha' })).toHaveFocus(),
    )
    await expect(
      canvas.getByRole('combobox', { name: 'Origem da aquisição' }),
    ).toHaveTextContent('Meta Ads')

    await userEvent.click(nextButton(canvasElement))
    await waitFor(() =>
      expect(
        canvas.getByRole('region', { name: 'Campanha de anúncios' }),
      ).toHaveFocus(),
    )
    await expect(
      canvas.getByRole('textbox', { name: 'Nome da campanha de anúncios' }),
    ).toHaveValue('Piloto bancário')

    const objective = canvas.getByRole('combobox', { name: 'Objetivo' })
    await expect(objective).toHaveTextContent('Leads')
    await userEvent.click(objective)
    await userEvent.click(
      await within(canvasElement.ownerDocument.body).findByRole('option', {
        name: /^Tráfego/,
      }),
    )
    await expect(objective).toHaveTextContent('Levar pessoas ao site')

    await userEvent.click(nextButton(canvasElement))
    await expect(
      canvas.getByText('Escolha ao menos uma conta de anúncios.'),
    ).toBeVisible()
    await userEvent.click(
      canvas.getByRole('checkbox', { name: /Conta principal/ }),
    )
    await userEvent.click(nextButton(canvasElement))

    await userEvent.click(canvas.getByRole('button', { name: 'Diário' }))
    await userEvent.click(nextButton(canvasElement))
    await expect(
      canvas.getByText('Informe um valor maior que zero.'),
    ).toBeVisible()
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Valor por dia' }),
      '50',
    )
    await userEvent.click(nextButton(canvasElement))

    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Revisão' })).toHaveFocus(),
    )
    await expect(canvas.getByText('R$ 50 por dia, em cada conta')).toBeVisible()
    await expect(JSON.parse(storedCampaign() ?? 'null')).toMatchObject({
      reached: 4,
      step: 'review',
    })

    await userEvent.keyboard('{Meta>}{Enter}{/Meta}')

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        adAccounts: ['main'],
        budgetAmount: '50',
        budgetMode: 'daily',
        objective: 'traffic',
        title: 'Piloto bancário',
      }),
    )
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Campanha Piloto bancário criada.',
    )
    await expect(storedCampaign()).toBeNull()
  },
}

export const Resumed: Story = {
  beforeEach: seedResumedCampaign,
  parameters: {
    docs: {
      description: {
        story:
          'A draft saved at the review comes back there. The pencil of a section jumps to its step and the panel takes focus, because the button that moved is gone; the nav returns to the review.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Revisão' })).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', { name: 'Editar Orçamento' }),
    )
    await waitFor(() =>
      expect(canvas.getByRole('region', { name: 'Orçamento' })).toHaveFocus(),
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Sem orçamento' }))
    await userEvent.click(canvas.getByRole('button', { name: /^Revisão/ }))

    await expect(canvas.getByText('Sem orçamento')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Criar campanha' }),
    )
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ budgetMode: 'none', title: 'Piloto bancário' }),
    )
  },
}

export const Discard: Story = {
  beforeEach: seedResumedCampaign,
  parameters: {
    docs: {
      description: {
        story:
          'The trash button asks in an `AlertDialog` before discarding; confirming clears the saved draft and returns to an empty first step.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Descartar criação' }),
    )
    const dialog = await body.findByRole('alertdialog', {
      name: 'Descartar esta criação?',
    })
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Descartar criação' }),
    )

    await expect(args.onDiscard).toHaveBeenCalled()
    await waitFor(() =>
      expect(
        canvas.getByRole('region', { name: 'Informações iniciais' }),
      ).toBeVisible(),
    )
    await expect(canvas.getByRole('textbox', { name: 'Título' })).toHaveValue(
      '',
    )
    await expect(storedCampaign()).toBeNull()
    await waitFor(() => expect(body.queryByRole('alertdialog')).toBeNull())
  },
}
