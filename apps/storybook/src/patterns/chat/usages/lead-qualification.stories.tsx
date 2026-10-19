import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Action,
  ChatsPanel,
  ChatsPanelItem,
  ChatsPanelList,
  CollectionToolbar,
  FilterRadioSubmenu,
  PersonProperty,
  RecordGroup,
  RecordGroupRow,
  type RecordGroupVariant,
  SelectProperty,
  TextProperty,
  ViewSettingsMenu,
  ViewSettingsSection,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { ChatConversation } from '@tc96/ui/chat/chat-conversation'
import { ChatDatePill } from '@tc96/ui/chat/chat-date-pill'
import { ChatDeliveryIndicator } from '@tc96/ui/chat/chat-delivery-indicator'
import { ChatMessage } from '@tc96/ui/chat/chat-message'
import { ChatEmptyState, ChatStatusBar } from '@tc96/ui/chat/chat-states'
import { useChatScroll } from '@tc96/ui/chat/hooks/use-chat-scroll'
import {
  Composer,
  ComposerActionGroup,
  ComposerActions,
  ComposerInput,
  ComposerSubmit,
  type ComposerValue,
  getComposerText,
} from '@tc96/ui/composer'
import { useMediaQuery } from '@tc96/ui/hooks/use-media-query'
import { ToolbarButton } from '@tc96/ui/toolbar'
import {
  ArrowUpIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  PhoneIcon,
  SearchXIcon,
} from 'lucide-react'
import { useId, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { recordGroupArgTypes } from '../../../test-utils/story-arg-types'
import {
  type AdPlatform,
  attendants,
  BrandLabel,
  channels,
  isLeadStatus,
  type Lead,
  type LeadAnswers,
  LeadAvatar,
  leads,
  platformOptions,
  platforms,
  qualificationQuestions,
  statusOptions,
  unreadLabel,
} from './fixtures/leads'

interface LeadQualificationArgs {
  chatsPanelWidth: number
  defaultPlatform: AdPlatform | ''
  defaultSelectedLeadId?: string
  leads: Lead[]
  onCall: (leadId: string) => void
  onCreateOpportunity: (leadId: string) => void
  onQualify: (leadId: string, answers: LeadAnswers) => void
  onSelectLead: (leadId: string) => void
  onSend: (leadId: string, text: string) => void
  onSendTemplate: (leadId: string) => void
  variant: RecordGroupVariant
  sidebarWidth: number
}

const isAnswered = (answers: LeadAnswers) =>
  Object.values(answers).every((answer) => answer !== null)

interface LeadConversationProps {
  lead: Lead
  onCall: () => void
  onCreateOpportunity: () => void
  onSend: (text: string) => void
  onSendTemplate: () => void
}

function LeadConversation({
  lead,
  onCall,
  onCreateOpportunity,
  onSend,
  onSendTemplate,
}: Readonly<LeadConversationProps>) {
  const [draft, setDraft] = useState<ComposerValue>([])
  const hintId = useId()
  const touchInput = useMediaQuery({ pointer: 'coarse' })
  const scroll = useChatScroll({ itemCount: lead.messages.length })
  const channel = channels[lead.channel].title
  const windowOpen = lead.windowEndsAt !== null

  return (
    <section
      aria-label={`Conversa com ${lead.name}`}
      className="flex min-h-0 min-w-0 flex-col border-x bg-popover"
    >
      <CollectionToolbar
        aria-label="Ações da conversa"
        className="shrink-0 border-b px-4 py-2"
        description={`${channel} · ${platforms[lead.source.platform].label}`}
        endSlot={
          <>
            <ToolbarButton
              onClick={onCall}
              render={<Button variant="outline" />}
            >
              <PhoneIcon aria-hidden="true" />
              Ligar
            </ToolbarButton>
            <Action
              disabled={lead.status !== 'qualified'}
              label="Criar oportunidade"
              onClick={onCreateOpportunity}
            />
          </>
        }
        title={lead.name}
        variant="text"
      />
      <ChatConversation
        jumpLabel="Ir para a mais recente"
        label={`Mensagens com ${lead.name}`}
        scroll={scroll}
      >
        <div className="mx-auto max-w-185 space-y-4 pt-4">
          <ChatDatePill>{lead.day}</ChatDatePill>
          {lead.messages.map((message, index) => (
            <ChatMessage
              animateEntrance={message.own}
              author={lead.name}
              avatar={<LeadAvatar className="size-7 text-xs" lead={lead} />}
              footer={
                message.own ? (
                  <>
                    <time dateTime={message.at}>{message.time}</time>
                    <ChatDeliveryIndicator label="Lida" status="read" />
                  </>
                ) : (
                  <time dateTime={message.at}>{message.time}</time>
                )
              }
              grouped={lead.messages[index - 1]?.own === message.own}
              key={message.id}
              side={message.own ? 'outgoing' : 'incoming'}
            >
              {message.text}
            </ChatMessage>
          ))}
        </div>
      </ChatConversation>
      {windowOpen ? null : (
        <ChatStatusBar
          action={
            <Button onClick={onSendTemplate} size="sm" variant="outline">
              Enviar modelo
            </Button>
          }
          description="Fora da janela de 24h, a Meta só aceita um modelo aprovado."
          title="Janela encerrada"
        />
      )}
      <div className="flex shrink-0 flex-col gap-2.5 px-4 pt-2 pb-4">
        <Composer
          disabled={!windowOpen}
          onSubmit={(value: ComposerValue) => {
            const text = getComposerText(value).trim()
            if (!text) return
            scroll.atBottomRef.current = true
            setDraft([])
            onSend(text)
          }}
          onValueChange={setDraft}
          submitOnEnter="desktop"
          value={draft}
        >
          <ComposerInput
            aria-describedby={touchInput ? undefined : hintId}
            aria-label="Resposta"
            placeholder={`Responder pelo ${channel}…`}
            render={<textarea />}
          />
          <ComposerActions>
            <ComposerActionGroup align="end">
              <ComposerSubmit
                render={
                  <Button aria-label="Enviar resposta" size="icon">
                    <ArrowUpIcon aria-hidden="true" />
                  </Button>
                }
              />
            </ComposerActionGroup>
          </ComposerActions>
        </Composer>
        <div className="flex justify-between gap-3 text-muted-foreground text-xs">
          <p>
            {windowOpen
              ? `Janela de 24h aberta até ${lead.windowEndsAt}`
              : null}
          </p>
          {touchInput ? null : (
            <p id={hintId}>Enter envia / Shift + Enter quebra a linha</p>
          )}
        </div>
      </div>
    </section>
  )
}

interface LeadSidebarProps {
  lead: Lead
  onAnswer: (key: keyof LeadAnswers, value: string | null) => void
  onChange: (patch: Partial<Pick<Lead, 'owner' | 'status'>>) => void
  onQualify: () => void
  variant: RecordGroupVariant
}

function LeadSidebar({
  lead,
  onAnswer,
  onChange,
  onQualify,
  variant,
}: Readonly<LeadSidebarProps>) {
  const platform = platforms[lead.source.platform]
  const channel = channels[lead.channel]
  const qualified = lead.status === 'qualified'

  return (
    <aside
      aria-label="Dados do lead"
      className="flex min-h-0 flex-col gap-3 overflow-y-auto p-4"
    >
      <RecordGroup title="Lead" variant={variant}>
        <RecordGroupRow label="Status">
          <SelectProperty
            ariaLabel="Status"
            onValueChange={(status) => {
              if (isLeadStatus(status)) onChange({ status })
            }}
            options={statusOptions}
            value={lead.status}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Responsável">
          <PersonProperty
            ariaLabel="Responsável"
            onValueChange={(owner) => onChange({ owner })}
            options={attendants}
            placeholder="Sem responsável"
            value={lead.owner}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label="Canal">
          <BrandLabel icon={channel} label={channel.title} />
        </RecordGroupRow>
      </RecordGroup>
      <RecordGroup title="Origem" variant={variant}>
        <RecordGroupRow label="Plataforma">
          <BrandLabel icon={platform.icon} label={platform.label} />
        </RecordGroupRow>
        <RecordGroupRow label="Campanha">
          <TextProperty
            ariaLabel="Campanha"
            value={lead.source.campaign}
            variant="plain"
          />
        </RecordGroupRow>
        <RecordGroupRow label={platform.creativeLabel}>
          <TextProperty
            ariaLabel={platform.creativeLabel}
            fallback={platform.creativeFallback}
            value={lead.source.creative}
            variant="plain"
          />
        </RecordGroupRow>
      </RecordGroup>
      <RecordGroup
        footer={
          <Button
            disabled={qualified || !isAnswered(lead.answers)}
            onClick={onQualify}
            size="sm"
          >
            {qualified ? 'Lead qualificado' : 'Qualificar lead'}
          </Button>
        }
        title="Qualificação"
        variant={variant}
      >
        {qualificationQuestions.map(({ key, label, options }) => (
          <RecordGroupRow key={key} label={label}>
            <SelectProperty
              ariaLabel={label}
              fallback="Sem resposta"
              onValueChange={(value) => onAnswer(key, value)}
              options={options}
              value={lead.answers[key]}
              variant="plain"
            />
          </RecordGroupRow>
        ))}
      </RecordGroup>
    </aside>
  )
}

const meta = {
  args: {
    chatsPanelWidth: 320,
    defaultPlatform: '',
    defaultSelectedLeadId: 'renata',
    leads,
    onCall: fn((_leadId: string) => {}),
    onCreateOpportunity: fn((_leadId: string) => {}),
    onQualify: fn((_leadId: string, _answers: LeadAnswers) => {}),
    onSelectLead: fn((_leadId: string) => {}),
    onSend: fn((_leadId: string, _text: string) => {}),
    onSendTemplate: fn((_leadId: string) => {}),
    sidebarWidth: 416,
    variant: 'card',
  },
  argTypes: {
    chatsPanelWidth: {
      control: { max: 400, min: 260, step: 10, type: 'range' },
    },
    defaultPlatform: {
      control: 'inline-radio',
      options: ['', ...Object.keys(platforms)],
    },
    defaultSelectedLeadId: {
      control: 'select',
      options: leads.map((lead) => lead.id),
    },
    leads: { control: false },
    sidebarWidth: { control: { max: 520, min: 320, step: 10, type: 'range' } },
    variant: recordGroupArgTypes.variant,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A chat page where an agent qualifies the leads of Meta and Google Ads campaigns. `ChatsPanel` lists the conversations, with a `CollectionToolbar` and its `ViewSettingsMenu` filtering them by ad platform; the conversation is the COSS Chat under a `CollectionToolbar` in `text` that calls the lead and creates the opportunity once the lead is qualified; the sidebar stacks `RecordGroup`s for the lead, its campaign origin and the qualification questions. Answering every question enables `Qualificar lead`, which sets the status. Outside the Meta 24h window the composer is disabled and only a template can be sent. The timeline content is capped at 740px, and `chatsPanelWidth` and `sidebarWidth` set the side columns in pixels. The story owns the leads, the selection and the filter, as a consumer would.',
      },
    },
    layout: 'fullscreen',
  },
  render: function LeadQualification({
    chatsPanelWidth,
    defaultPlatform,
    defaultSelectedLeadId,
    leads: initialLeads,
    onCall,
    onCreateOpportunity,
    onQualify,
    onSelectLead,
    onSend,
    onSendTemplate,
    sidebarWidth,
    variant,
  }) {
    const [leadList, setLeadList] = useState(initialLeads)
    const [selectedLeadId, setSelectedLeadId] = useState(defaultSelectedLeadId)
    const [platform, setPlatform] = useState<string>(defaultPlatform)
    const lead = leadList.find((item) => item.id === selectedLeadId)
    const visibleLeads = leadList
      .filter((item) => !platform || item.source.platform === platform)
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))

    const updateLead = (id: string, update: (current: Lead) => Lead) =>
      setLeadList((current) =>
        current.map((item) => (item.id === id ? update(item) : item)),
      )

    return (
      <div
        className="grid h-dvh min-h-160 min-w-5xl"
        style={{
          gridTemplateColumns: `${chatsPanelWidth}px minmax(0, 1fr) ${sidebarWidth}px`,
        }}
      >
        <ChatsPanel
          actions={
            <CollectionToolbar
              aria-label="Ajustes das conversas"
              endSlot={
                <ViewSettingsMenu
                  activeFilterCount={platform ? 1 : 0}
                  onClearFilters={() => setPlatform('')}
                >
                  <ViewSettingsSection label="Filtros">
                    <FilterRadioSubmenu
                      icon={MegaphoneIcon}
                      label="Origem"
                      onValueChange={setPlatform}
                      options={platformOptions}
                      value={platform}
                    />
                  </ViewSettingsSection>
                </ViewSettingsMenu>
              }
            />
          }
          className="h-full min-h-0 pt-2"
          title="Conversas"
          variant="plain"
        >
          {visibleLeads.length === 0 ? (
            <ChatEmptyState
              description="Nenhuma conversa veio desta origem."
              icon={<SearchXIcon aria-hidden="true" />}
              title="Nenhuma conversa encontrada"
            >
              <Button
                onClick={() => setPlatform('')}
                size="sm"
                variant="outline"
              >
                Limpar filtros
              </Button>
            </ChatEmptyState>
          ) : (
            <ChatsPanelList>
              {visibleLeads.map((item) => {
                const lastMessage = item.messages.at(-1)

                return (
                  <ChatsPanelItem
                    avatar={<LeadAvatar lead={item} />}
                    channel={channels[item.channel]}
                    key={item.id}
                    name={item.name}
                    onClick={() => {
                      setSelectedLeadId(item.id)
                      updateLead(item.id, (current) => ({
                        ...current,
                        unreadCount: 0,
                      }))
                      onSelectLead(item.id)
                    }}
                    preview={
                      lastMessage?.own
                        ? `Você: ${lastMessage.text}`
                        : lastMessage?.text
                    }
                    selected={item.id === selectedLeadId}
                    time={
                      <time dateTime={item.lastMessageAt}>{item.time}</time>
                    }
                    unreadCount={item.unreadCount}
                    unreadLabel={unreadLabel(item.unreadCount)}
                  />
                )
              })}
            </ChatsPanelList>
          )}
        </ChatsPanel>
        {lead ? (
          <>
            <LeadConversation
              key={lead.id}
              lead={lead}
              onCall={() => onCall(lead.id)}
              onCreateOpportunity={() => onCreateOpportunity(lead.id)}
              onSend={(text) => {
                updateLead(lead.id, (current) => ({
                  ...current,
                  lastMessageAt: '2026-10-19T14:20',
                  messages: [
                    ...current.messages,
                    {
                      at: '2026-10-19T14:20',
                      id: `${current.id}-${current.messages.length + 1}`,
                      own: true,
                      text,
                      time: '14:20',
                    },
                  ],
                  time: '14:20',
                }))
                onSend(lead.id, text)
              }}
              onSendTemplate={() => onSendTemplate(lead.id)}
            />
            <LeadSidebar
              lead={lead}
              onAnswer={(key, value) =>
                updateLead(lead.id, (current) => ({
                  ...current,
                  answers: { ...current.answers, [key]: value },
                  status:
                    current.status === 'new' ? 'qualifying' : current.status,
                }))
              }
              onChange={(patch) =>
                updateLead(lead.id, (current) => ({ ...current, ...patch }))
              }
              onQualify={() => {
                updateLead(lead.id, (current) => ({
                  ...current,
                  status: 'qualified',
                }))
                onQualify(lead.id, lead.answers)
              }}
              variant={variant}
            />
          </>
        ) : (
          <div className="col-span-2 flex items-center justify-center border-s">
            <ChatEmptyState
              description="Escolha um lead na lista para ver a conversa e qualificá-lo."
              icon={<MessagesSquareIcon aria-hidden="true" />}
              title="Nenhuma conversa aberta"
            />
          </div>
        )}
      </div>
    )
  },
  tags: ['!autodocs'],
  title: 'Patterns/Chat/Usages/Lead Qualification',
} satisfies Meta<LeadQualificationArgs>

export default meta
type Story = StoryObj<typeof meta>

const describe = (story: string) => ({ docs: { description: { story } } })

const regionOf = (canvasElement: HTMLElement, name: string) =>
  within(within(canvasElement).getByRole('region', { name }))

const listboxClosed = () =>
  waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

const answer = async (
  scope: ReturnType<typeof within>,
  question: string,
  option: string,
) => {
  await userEvent.click(
    scope.getByRole('combobox', { name: new RegExp(`^${question}`) }),
  )
  await userEvent.click(await screen.findByRole('option', { name: option }))
  await listboxClosed()
}

export const Default: Story = {}

export const QualifyLead: Story = {
  parameters: describe(
    'Answering the two open questions enables `Qualificar lead`; qualifying sets the status to `Qualificado`, reports the answers through `onQualify` and enables `Criar oportunidade` in the conversation toolbar.',
  ),
  play: async ({ args, canvasElement }) => {
    const qualification = regionOf(canvasElement, 'Qualificação')
    const lead = regionOf(canvasElement, 'Lead')
    const qualify = qualification.getByRole('button', {
      name: 'Qualificar lead',
    })
    const createOpportunity = within(canvasElement).getByRole('button', {
      name: 'Criar oportunidade',
    })
    await expect(qualify).toBeDisabled()
    await expect(createOpportunity).toHaveAttribute('aria-disabled', 'true')

    await answer(qualification, 'Conta de luz', 'R$ 300 a R$ 800')
    await expect(qualify).toBeDisabled()
    await answer(qualification, 'Prazo', 'Até 3 meses')
    await waitFor(() => expect(qualify).toBeEnabled())

    await userEvent.click(qualify)
    await expect(args.onQualify).toHaveBeenCalledWith('renata', {
      bill: '300-to-800',
      decisionMaker: 'yes',
      property: 'house',
      timeline: 'three-months',
    })
    await expect(lead.getByText('Qualificado')).toBeVisible()
    await expect(
      qualification.getByRole('button', { name: 'Lead qualificado' }),
    ).toBeDisabled()
    await waitFor(() =>
      expect(createOpportunity).toHaveAttribute('aria-disabled', 'false'),
    )
    await userEvent.click(createOpportunity)
    await expect(args.onCreateOpportunity).toHaveBeenCalledWith('renata')
  },
}

export const SwitchLead: Story = {
  parameters: describe(
    'Opening another conversation clears its unread count and swaps the conversation and the sidebar; a Meta Ads lead shows the ad instead of the keyword, and the first answer moves a new lead to `Em qualificação`.',
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: /^Diego Almeida.*2 não lidas/ }),
    ).toBeVisible()

    await userEvent.click(
      canvas.getByRole('button', { name: /^Diego Almeida/ }),
    )
    await expect(args.onSelectLead).toHaveBeenCalledWith('diego')
    await expect(
      canvas.getByRole('button', { name: /^Diego Almeida/ }),
    ).toHaveAttribute('aria-current', 'true')
    await expect(
      canvas.getByRole('button', { name: /^Diego Almeida/ }),
    ).not.toHaveAccessibleName(/não lidas/)
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Diego Almeida' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('log', { name: 'Mensagens com Diego Almeida' }),
    ).toHaveTextContent('Funciona pra apartamento?')

    const origin = regionOf(canvasElement, 'Origem')
    await expect(origin.getByText('Meta Ads')).toBeVisible()
    await expect(origin.getByText('Anúncio')).toBeVisible()
    await expect(origin.queryByText('Palavra-chave')).toBeNull()

    const lead = regionOf(canvasElement, 'Lead')
    await expect(lead.getByText('Novo')).toBeVisible()
    await answer(
      regionOf(canvasElement, 'Qualificação'),
      'Imóvel',
      'Apartamento',
    )
    await expect(lead.getByText('Em qualificação')).toBeVisible()
  },
}

export const SendReply: Story = {
  parameters: describe(
    'Enter sends the reply through the lead channel: the message joins the conversation, the input clears and the list preview shows it.',
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Resposta' })
    await expect(input).toHaveAttribute(
      'placeholder',
      'Responder pelo WhatsApp…',
    )

    await userEvent.type(input, 'Consegue me mandar uma foto da conta?')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSend).toHaveBeenCalledWith(
      'renata',
      'Consegue me mandar uma foto da conta?',
    )
    await expect(
      within(
        canvas.getByRole('log', { name: 'Mensagens com Renata Sousa' }),
      ).getByText('Consegue me mandar uma foto da conta?'),
    ).toBeVisible()
    await waitFor(() => expect(input).toHaveValue(''))
    await expect(
      canvas.getByRole('button', { name: /^Renata Sousa/ }),
    ).toHaveTextContent('Você: Consegue me mandar uma foto da conta?')
  },
}

export const FilterByPlatform: Story = {
  parameters: describe(
    '`Origem` in the `Exibição` menu keeps only the leads of one ad platform; the trigger counts the active filter.',
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Exibição' }))
    await userEvent.click(await body.findByRole('menuitem', { name: 'Origem' }))
    await userEvent.click(
      await body.findByRole('menuitemradio', { name: 'Meta Ads' }),
    )
    await userEvent.keyboard('[Escape][Escape]')
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull())

    const list = canvas.getByRole('list', { name: 'Conversas' })
    await expect(
      within(list)
        .getAllByRole('listitem')
        .map(
          (item) =>
            item.querySelector('[data-slot="chats-panel-item-name"]')
              ?.textContent,
        ),
    ).toEqual(['Diego Almeida', 'Marina Costa'])
    await expect(
      canvas.getByRole('button', { name: 'Exibição (1)' }),
    ).toBeVisible()
  },
}

export const ClosedWindow: Story = {
  args: { defaultSelectedLeadId: 'paulo' },
  parameters: describe(
    'A conversation past the Meta 24h window: the composer is disabled and the status bar offers to send an approved template.',
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('textbox', { name: 'Resposta' }),
    ).toBeDisabled()
    await expect(canvas.getByText('Janela encerrada')).toBeVisible()
    await expect(
      regionOf(canvasElement, 'Origem').getByText('Sem palavra-chave'),
    ).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Enviar modelo' }))
    await expect(args.onSendTemplate).toHaveBeenCalledWith('paulo')
  },
}

export const NoConversationOpen: Story = {
  args: { defaultSelectedLeadId: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Nenhuma conversa aberta')).toBeVisible()
    await expect(canvas.queryByRole('complementary')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: /^Marina Costa/ }))
    await expect(
      canvas.getByRole('complementary', { name: 'Dados do lead' }),
    ).toBeVisible()
  },
}
