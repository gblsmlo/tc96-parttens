import {
  BuildingIcon,
  CalendarBlankIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  PhoneIcon,
} from '@phosphor-icons/react'
import {
  type Activity,
  type Deal,
  IconFrame,
  type MarketShareSegment,
  type PipelineStage,
} from '@tc96/parttens'

export type PipelinePeriod = 'month' | 'quarter'

export const pipelinePeriods = [
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
] as const

export const pipelineStages: Record<PipelinePeriod, PipelineStage[]> = {
  month: [
    { count: 18, id: 'lead', label: 'Lead', value: 96000 },
    { count: 11, id: 'qualified', label: 'Qualified', value: 74500 },
    { count: 6, id: 'proposal', label: 'Proposal', value: 52000 },
    { count: 3, id: 'negotiation', label: 'Negotiation', value: 31000 },
    { count: 2, id: 'won', label: 'Won', value: 18400 },
  ],
  quarter: [
    { count: 54, id: 'lead', label: 'Lead', value: 288000 },
    { count: 32, id: 'qualified', label: 'Qualified', value: 214000 },
    { count: 17, id: 'proposal', label: 'Proposal', value: 149000 },
    { count: 9, id: 'negotiation', label: 'Negotiation', value: 92000 },
    { count: 7, id: 'won', label: 'Won', value: 61200 },
  ],
}

export const people = {
  ana: { id: 'ana', label: 'Ana Martins' },
  gabriel: { id: 'gabriel', label: 'Gabriel Melo' },
  marina: { id: 'marina', label: 'Marina Souza' },
}

const companyIcon = (
  <IconFrame>
    <BuildingIcon aria-hidden="true" />
  </IconFrame>
)

export const deals: Deal[] = [
  {
    closeLabel: 'Closes Jun 30',
    company: 'Acme Corp',
    icon: companyIcon,
    id: 'acme',
    name: 'Website redesign',
    owner: people.ana,
    stage: { label: 'Negotiation', tone: 'warning' },
    value: 48000,
  },
  {
    closeLabel: 'Closes Jul 12',
    company: 'Globex',
    icon: companyIcon,
    id: 'globex',
    name: 'Annual license',
    owner: people.gabriel,
    stage: { label: 'Proposal', tone: 'info' },
    value: 32500,
  },
  {
    closeLabel: 'Closed Jun 2',
    company: 'Initech',
    icon: companyIcon,
    id: 'initech',
    name: 'Onboarding package',
    owner: people.marina,
    stage: { label: 'Won', tone: 'success' },
    value: 12500.5,
  },
]

export const bareDeals: Deal[] = [
  { id: 'support', name: 'Support plan', value: 4800 },
  { id: 'training', name: 'Team training', value: 2250 },
]

export const activities: Activity[] = [
  {
    description: 'Discussed renewal terms and the Q3 rollout.',
    icon: <PhoneIcon aria-hidden="true" />,
    id: 'call',
    person: people.ana,
    timeLabel: '2h ago',
    title: 'called Acme Corp',
    tone: 'success',
  },
  {
    icon: <EnvelopeSimpleIcon aria-hidden="true" />,
    id: 'mail',
    person: people.gabriel,
    timeLabel: '5h ago',
    title: 'sent a proposal to Globex',
    tone: 'info',
  },
  {
    description: 'Demo scheduled for Thursday, 10:00.',
    icon: <CalendarBlankIcon aria-hidden="true" />,
    id: 'meeting',
    person: people.marina,
    timeLabel: 'Yesterday',
    title: 'booked a demo with Initech',
  },
  {
    icon: <FileTextIcon aria-hidden="true" />,
    id: 'note',
    person: people.ana,
    timeLabel: '2 days ago',
    title: 'flagged Umbrella as at risk',
    tone: 'warning',
  },
]

export const contactActivities: Activity[] = [
  {
    description: 'Asked for the enterprise tier comparison.',
    icon: <PhoneIcon aria-hidden="true" />,
    id: 'call',
    person: people.gabriel,
    timeLabel: '2h ago',
    title: 'called Ana',
    tone: 'success',
  },
  {
    icon: <EnvelopeSimpleIcon aria-hidden="true" />,
    id: 'mail',
    person: people.marina,
    timeLabel: 'Yesterday',
    title: 'sent the renewal proposal',
    tone: 'info',
  },
  {
    description: 'Quarterly review booked for Jun 18, 14:00.',
    icon: <CalendarBlankIcon aria-hidden="true" />,
    id: 'meeting',
    person: people.gabriel,
    timeLabel: '3 days ago',
    title: 'scheduled a review',
  },
]

export const leadSources: MarketShareSegment[] = [
  { change: 0.082, id: 'organic', label: 'Organic', value: 42 },
  { change: 0.031, id: 'referral', label: 'Referral', value: 28 },
  { change: -0.012, id: 'paid', label: 'Paid', value: 18 },
  {
    change: 0.004,
    color: 'var(--muted-foreground)',
    id: 'other',
    label: 'Other',
    value: 12,
  },
]
