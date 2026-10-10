import type { Meta, StoryObj } from '@storybook/react-vite'
import type { RichTextValue } from '@tc96/parttens'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { placeCaretAtEnd } from '../../../test-utils/rich-text-typing'
import {
  clearStored,
  paragraph,
  readStored,
  text,
  usageParameters,
} from '../../../test-utils/usage-kit'
import {
  type CampaignBrief,
  CampaignBriefEditor,
} from '../fixtures/campaign-brief'

const storageKey = 'tc96:usage:campaign-brief'

const section = (heading: string, block: unknown = paragraph(text(''))) => [
  { children: [text(heading)], type: 'h2' },
  block,
]

const trackingUrl = (source: string) =>
  `https://example.com/agendar?utm_source=${source}&utm_campaign=outubro`

const trackingLink = (source: string) => ({
  children: [
    {
      children: [
        text(''),
        {
          children: [text(trackingUrl(source))],
          type: 'a',
          url: trackingUrl(source),
        },
        text(''),
      ],
      type: 'lic',
    },
  ],
  type: 'li',
})

const template: CampaignBrief = {
  body: [
    ...section('Audiência-alvo'),
    ...section('Mensagem'),
    ...section('Tom de voz'),
    ...section('Nota de planejamento'),
    ...section('URLs de rastreamento'),
    ...section('Leituras de aquisição'),
  ] as unknown as RichTextValue,
  description: null,
  expectedTarget: null,
  primaryObjective: null,
  secondaryObjective: null,
  title: '',
}

const filled: CampaignBrief = {
  body: [
    ...section(
      'Audiência-alvo',
      paragraph(
        text(
          'Pessoas de 30 a 55 anos da região que já pesquisaram o serviço e ainda não marcaram uma consulta.',
        ),
      ),
    ),
    ...section(
      'Mensagem',
      paragraph(
        text('Atendimento de perto, com horário que cabe na sua rotina.'),
      ),
    ),
    ...section(
      'Tom de voz',
      paragraph(text('Acolhedor e direto, sem jargão técnico.')),
    ),
    ...section(
      'Nota de planejamento',
      paragraph(
        text(
          'Começar pelo Instagram e medir as conversas no WhatsApp antes de ampliar o orçamento.',
        ),
      ),
    ),
    ...section('URLs de rastreamento', {
      children: [trackingLink('instagram'), trackingLink('whatsapp')],
      type: 'ul',
    }),
    ...section(
      'Leituras de aquisição',
      paragraph(
        text(
          'Custo por conversa abaixo de R$ 15 na primeira semana; acima de R$ 25, revisar o público.',
        ),
      ),
    ),
  ] as unknown as RichTextValue,
  description: 'Campanha de outubro para trazer contatos novos.',
  expectedTarget: 'whatsapp-conversation',
  primaryObjective: 'new-appointments',
  secondaryObjective: 'referrals',
  title: 'Outubro · Novas consultas',
}

const meta = {
  args: { initial: template, storageKey },
  beforeEach: () => clearStored(storageKey),
  component: CampaignBriefEditor,
  parameters: {
    ...usageParameters,
    docs: {
      description: {
        component:
          'A template page for writing a campaign brief. The header holds the title, a description and the inline property bar (primary objective, secondary objective, expected target); the body is the rich text editor seeded with one `h2` per brief section; the footer counts the sections with text and shows whether the draft is saved.',
      },
    },
  },
  render: (args) => (
    <div className="w-3xl max-w-full">
      <CampaignBriefEditor {...args} />
    </div>
  ),
  title: 'Patterns/Rich Text Editor/Usages/Campaign Brief',
} satisfies Meta<typeof CampaignBriefEditor>

export default meta

type Story = StoryObj<typeof meta>

const briefEditor = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('textbox', { name: 'Briefing' })

export const Template: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: 'Título' })).toHaveValue(
      '',
    )
    await expect(
      canvas.getByRole('textbox', { name: 'Descrição' }),
    ).toHaveAttribute('placeholder', 'Adicione uma descrição')

    const properties = canvas.getByRole('group', {
      name: 'Propriedades do briefing',
    })
    await expect(
      within(properties)
        .getAllByRole('combobox')
        .map((property) => property.getAttribute('aria-label')),
    ).toEqual(['Objetivo primário', 'Objetivo secundário', 'Target esperado'])

    const headings = Array.from(
      briefEditor(canvasElement).querySelectorAll('h2'),
      (heading) => heading.textContent,
    )
    await expect(headings).toEqual([
      'Audiência-alvo',
      'Mensagem',
      'Tom de voz',
      'Nota de planejamento',
      'URLs de rastreamento',
      'Leituras de aquisição',
    ])
    await expect(
      canvas.getByText('0 de 6 seções preenchidas'),
    ).toBeInTheDocument()
    await expect(canvas.getByText('Ainda não salvo')).toBeInTheDocument()
  },
}

export const Filled: Story = {
  args: { initial: filled },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('combobox', {
        name: 'Objetivo primário: Gerar novas consultas',
      }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('combobox', {
        name: 'Target esperado: Conversa no WhatsApp',
      }),
    ).toBeInTheDocument()
    await expect(
      within(briefEditor(canvasElement)).getByRole('link', {
        name: trackingUrl('whatsapp'),
      }),
    ).toHaveAttribute('href', trackingUrl('whatsapp'))
    await expect(
      canvas.getByText('6 de 6 seções preenchidas'),
    ).toBeInTheDocument()
  },
}

export const ChooseAnObjective: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Objetivo primário' }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Fortalecer indicação' }),
    )

    await expect(
      await canvas.findByRole('combobox', {
        name: 'Objetivo primário: Fortalecer indicação',
      }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(readStored<CampaignBrief>(storageKey)?.primaryObjective).toBe(
        'referrals',
      ),
    )
    await expect(canvas.getByText('Salvo neste navegador')).toBeInTheDocument()
  },
}

export const FillASection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editor = briefEditor(canvasElement)
    const firstEmptyLine = editor.querySelector('[data-slate-zero-width]')
    placeCaretAtEnd(editor, firstEmptyLine?.parentElement ?? null)
    await waitFor(() => expect(editor).toHaveFocus())
    await userEvent.keyboard('Pessoas da região')

    await waitFor(() =>
      expect(canvas.getByText('1 de 6 seções preenchidas')).toBeInTheDocument(),
    )
    await waitFor(() =>
      expect(
        JSON.stringify(readStored<CampaignBrief>(storageKey)?.body),
      ).toContain('"text":"Pessoas da região"'),
    )
  },
}

export const WriteADescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('textbox', { name: 'Descrição' }))
    await userEvent.keyboard('Campanha de outubro')
    await userEvent.tab()

    await waitFor(() =>
      expect(readStored<CampaignBrief>(storageKey)?.description).toBe(
        'Campanha de outubro',
      ),
    )
    await expect(canvas.getByText('Salvo neste navegador')).toBeInTheDocument()
  },
}
