import type {
  CollectionDefinition,
  SelectPropertyOption,
  TagsPropertyOption,
} from '@tc96/parttens'
import {
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  CircleOffIcon,
  HandshakeIcon,
} from 'lucide-react'

export type ContactStage =
  | 'none'
  | 'lead'
  | 'qualified'
  | 'customer'
  | 'inactive'

export type ContactTag =
  | 'decision-maker'
  | 'referral'
  | 'event'
  | 'newsletter'
  | 'vip'

export interface Contact {
  company: string
  description?: string
  emails: string[]
  id: string
  lastContactAt: string
  name: string
  phones: string[]
  role: string
  stage: ContactStage
  tags: ContactTag[]
}

export const stageOptions = [
  { icon: CircleIcon, label: 'Sem etapa', tone: 'neutral', value: 'none' },
  { icon: CircleDashedIcon, label: 'Lead', tone: 'neutral', value: 'lead' },
  {
    icon: CircleDotIcon,
    label: 'Qualificado',
    tone: 'info',
    value: 'qualified',
  },
  { icon: HandshakeIcon, label: 'Cliente', tone: 'success', value: 'customer' },
  { icon: CircleOffIcon, label: 'Inativo', tone: 'warning', value: 'inactive' },
] as const satisfies readonly (SelectPropertyOption & {
  value: ContactStage
})[]

export const tagOptions: readonly TagsPropertyOption<ContactTag>[] = [
  { label: 'Decisor', value: 'decision-maker' },
  { label: 'Indicação', value: 'referral' },
  { label: 'Evento', value: 'event' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'VIP', value: 'vip' },
]

export const isContactStage = (value: string): value is ContactStage =>
  stageOptions.some((option) => option.value === value)

export const initialContacts: Contact[] = [
  {
    company: 'Padaria Estrela',
    emails: ['marcos.tavares@padariaestrela.example'],
    id: 'CT-301',
    lastContactAt: '2026-10-09T14:00:00.000Z',
    name: 'Marcos Tavares',
    phones: ['+5511987650101'],
    role: 'Sócio-fundador',
    stage: 'lead',
    tags: ['decision-maker'],
  },
  {
    company: 'Clínica Vida Plena',
    emails: ['renata.costa@vidaplena.example'],
    id: 'CT-302',
    lastContactAt: '2026-10-06T17:30:00.000Z',
    name: 'Renata Costa',
    phones: ['+5521998760202', '+552133340202'],
    role: 'Diretora administrativa',
    stage: 'lead',
    tags: ['event'],
  },
  {
    company: 'Construtora Horizonte',
    emails: ['paulo.nunes@horizonte.example', 'compras@horizonte.example'],
    id: 'CT-303',
    lastContactAt: '2026-10-12T13:00:00.000Z',
    name: 'Paulo Nunes',
    phones: ['+5531991230303'],
    role: 'Gerente de compras',
    stage: 'qualified',
    tags: ['decision-maker', 'referral'],
  },
  {
    company: 'Escola Aprender',
    emails: ['juliana.prado@aprender.example'],
    id: 'CT-304',
    lastContactAt: '2026-10-01T15:00:00.000Z',
    name: 'Juliana Prado',
    phones: [],
    role: 'Coordenadora pedagógica',
    stage: 'qualified',
    tags: ['newsletter'],
  },
  {
    company: 'Logística Rápida',
    emails: ['fernando.alves@lograpida.example'],
    id: 'CT-305',
    lastContactAt: '2026-10-13T18:00:00.000Z',
    name: 'Fernando Alves',
    phones: ['+5541996540505'],
    role: 'Diretor de operações',
    stage: 'qualified',
    tags: ['decision-maker', 'vip'],
  },
  {
    company: 'Café Montanha',
    emails: ['beatriz.lopes@cafemontanha.example'],
    id: 'CT-306',
    lastContactAt: '2026-09-29T12:00:00.000Z',
    name: 'Beatriz Lopes',
    phones: ['+5535988870606'],
    role: 'Proprietária',
    stage: 'lead',
    tags: ['referral'],
  },
  {
    company: 'Banco Aurora',
    emails: ['ricardo.melo@bancoaurora.example', 'ricardo@pessoal.example'],
    id: 'CT-307',
    lastContactAt: '2026-10-14T11:30:00.000Z',
    name: 'Ricardo Melo',
    phones: ['+5511976540707'],
    role: 'Head de tecnologia',
    stage: 'customer',
    tags: ['decision-maker', 'vip'],
  },
  {
    company: 'Farmácia Central',
    emails: ['luciana.reis@farmaciacentral.example'],
    id: 'CT-308',
    lastContactAt: '2026-10-10T16:00:00.000Z',
    name: 'Luciana Reis',
    phones: ['+5551995430808'],
    role: 'Gerente regional',
    stage: 'customer',
    tags: ['event'],
  },
  {
    company: 'Studio Forma',
    emails: ['andre.santos@studioforma.example'],
    id: 'CT-309',
    lastContactAt: '2026-10-02T19:00:00.000Z',
    name: 'André Santos',
    phones: ['+351912345678'],
    role: 'Diretor criativo',
    stage: 'customer',
    tags: ['newsletter', 'referral'],
  },
  {
    company: 'Mercado Bom Preço',
    emails: ['claudia.ferreira@bompreco.example'],
    id: 'CT-310',
    lastContactAt: '2026-09-24T14:30:00.000Z',
    name: 'Cláudia Ferreira',
    phones: ['+5571993211010'],
    role: 'Gerente financeira',
    stage: 'customer',
    tags: ['decision-maker'],
  },
  {
    company: 'Hotel Litoral',
    emails: ['gustavo.ribeiro@hotellitoral.example'],
    id: 'CT-311',
    lastContactAt: '2026-08-18T13:00:00.000Z',
    name: 'Gustavo Ribeiro',
    phones: ['+5548991121111'],
    role: 'Gerente geral',
    stage: 'inactive',
    tags: [],
  },
  {
    company: 'Auto Peças Avenida',
    emails: [],
    id: 'CT-312',
    lastContactAt: '2026-07-30T15:00:00.000Z',
    name: 'Sérgio Batista',
    phones: ['+5562984561212'],
    role: 'Comprador',
    stage: 'inactive',
    tags: ['event'],
  },
  {
    company: 'Banco Aurora',
    emails: ['patricia.gomes@bancoaurora.example'],
    id: 'CT-313',
    lastContactAt: '2026-10-08T17:00:00.000Z',
    name: 'Patrícia Gomes',
    phones: ['+5511965431313'],
    role: 'Analista de compras',
    stage: 'customer',
    tags: ['newsletter'],
  },
  {
    company: 'Escola Aprender',
    emails: ['roberto.dias@aprender.example'],
    id: 'CT-314',
    lastContactAt: '2026-10-11T12:30:00.000Z',
    name: 'Roberto Dias',
    phones: [],
    role: 'Diretor',
    stage: 'qualified',
    tags: ['decision-maker'],
  },
]

export const contactGroupings: CollectionDefinition<Contact>['groupings'] = [
  {
    getGroupId: (contact) => contact.stage,
    id: 'stage',
    label: 'Etapa',
    options: stageOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
    setGroupId: (contact, groupId) =>
      groupId && isContactStage(groupId)
        ? { ...contact, stage: groupId }
        : contact,
  },
]

export const createContactCollection = (
  items: readonly Contact[],
): CollectionDefinition<Contact> => ({
  getKey: (contact) => contact.id,
  getLabel: (contact) => contact.name,
  groupings: contactGroupings,
  items,
})
