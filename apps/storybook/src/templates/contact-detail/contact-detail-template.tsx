import { Avatar, AvatarFallback } from '@tc96/elements/avatar'
import { Text } from '@tc96/elements/text'
import { getInitials } from '@tc96/helpers/initials'
import {
  type Activity,
  ActivityFeedWidget,
  DateProperty,
  DealsWidget,
  type Deal as DealsWidgetDeal,
  EmailProperty,
  PhoneProperty,
  RecordGroup,
  RecordGroupRow,
  SelectProperty,
  TagsProperty,
  TextProperty,
  type WidgetTone,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarCheckIcon,
  CalendarIcon,
  CircleDotIcon,
  FileTextIcon,
  HandshakeIcon,
  MailIcon,
  MonitorPlayIcon,
  PhoneIcon,
  PlusIcon,
  TagIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import {
  type Contact,
  stageOptions as contactStageOptions,
  initialContacts,
  tagOptions,
} from '../../patterns/collection-views/fixtures/contacts'
import {
  type ActivityKind,
  activityKindOptions,
  type DealActivity,
  initialActivities,
} from '../../patterns/collection-views/fixtures/deal-activities'
import {
  type Deal,
  stageOptions as dealStageOptions,
  initialDeals,
} from '../../patterns/collection-views/fixtures/deals'
import {
  peopleById,
  TIME_ZONE,
} from '../../patterns/collection-views/fixtures/tasks'

const LOCALE = 'pt-BR'

const activityIcon: Record<ActivityKind, ReactNode> = {
  call: <PhoneIcon />,
  closing: <CalendarCheckIcon />,
  demo: <MonitorPlayIcon />,
  meeting: <CalendarIcon />,
  proposal: <FileTextIcon />,
}

const dealStageTone: Partial<Record<Deal['stage'], WidgetTone>> = {
  lost: 'destructive',
  negotiation: 'warning',
  proposal: 'info',
  won: 'success',
}

const activityDate = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  timeZone: TIME_ZONE,
})

const closeDate = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

const ownerOf = (ownerId: string) => {
  const person = peopleById.get(ownerId)
  return {
    fallback: person?.initials,
    id: ownerId,
    label: person?.name ?? ownerId,
  }
}

const toWidgetDeal = (deal: Deal): DealsWidgetDeal => {
  const stage = dealStageOptions.find((option) => option.value === deal.stage)
  return {
    closeLabel: `Fecha em ${closeDate.format(new Date(deal.closeDate))}`,
    company: deal.id,
    id: deal.id,
    name: deal.company,
    owner: ownerOf(deal.ownerId),
    stage: {
      label: stage?.label ?? deal.stage,
      tone: dealStageTone[deal.stage],
    },
    value: deal.value,
  }
}

const toActivity = (activity: DealActivity): Activity => {
  const kind = activityKindOptions.find(
    (option) => option.value === activity.kind,
  )
  return {
    description: kind?.label,
    icon: activityIcon[activity.kind],
    id: activity.id,
    person: ownerOf(activity.ownerId),
    timeLabel: activityDate.format(new Date(activity.start)),
    title: activity.title,
  }
}

export interface ContactDetailTemplateProps {
  activities?: readonly DealActivity[]
  contact?: Contact
  deals?: readonly Deal[]
}

export function ContactDetailTemplate({
  activities = initialActivities,
  contact = initialContacts[0] as Contact,
  deals = initialDeals,
}: Readonly<ContactDetailTemplateProps>) {
  const contactDeals = deals.filter((deal) => deal.company === contact.company)
  const dealIds = new Set(contactDeals.map((deal) => deal.id))
  const contactActivities = activities
    .filter((activity) => dealIds.has(activity.dealId))
    .sort((a, b) => b.start.localeCompare(a.start))

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button className="self-start" size="sm" variant="ghost">
          <ArrowLeftIcon aria-hidden="true" />
          Voltar para contatos
        </Button>

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 gap-0.5">
              <h1 className="font-semibold text-2xl">{contact.name}</h1>
              <Text foreground="muted" size="sm" truncate>
                {contact.role} · {contact.company}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <MailIcon aria-hidden="true" />
              Registrar e-mail
            </Button>
            <Button>
              <PlusIcon aria-hidden="true" />
              Novo negócio
            </Button>
          </div>
        </header>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <RecordGroup title="Detalhes do contato">
          <RecordGroupRow
            label="Etapa"
            leading={<CircleDotIcon aria-hidden="true" />}
          >
            <SelectProperty
              ariaLabel="Etapa"
              options={contactStageOptions}
              readOnly
              value={contact.stage}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow
            label="Empresa"
            leading={<BuildingIcon aria-hidden="true" />}
          >
            <TextProperty
              ariaLabel="Empresa"
              value={contact.company}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow
            label="Cargo"
            leading={<BriefcaseIcon aria-hidden="true" />}
          >
            <TextProperty
              ariaLabel="Cargo"
              value={contact.role}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow
            label="E-mails"
            leading={<MailIcon aria-hidden="true" />}
          >
            <EmailProperty
              ariaLabel="E-mails"
              readOnly
              value={contact.emails}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow
            label="Telefones"
            leading={<PhoneIcon aria-hidden="true" />}
          >
            <PhoneProperty
              ariaLabel="Telefones"
              readOnly
              value={contact.phones}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow label="Tags" leading={<TagIcon aria-hidden="true" />}>
            <TagsProperty
              ariaLabel="Tags"
              options={tagOptions}
              readOnly
              value={contact.tags}
              variant="plain"
            />
          </RecordGroupRow>
          <RecordGroupRow
            label="Último contato"
            leading={<HandshakeIcon aria-hidden="true" />}
          >
            <DateProperty
              ariaLabel="Último contato"
              locale={LOCALE}
              readOnly
              timeZone={TIME_ZONE}
              value={contact.lastContactAt.slice(0, 10)}
              variant="plain"
            />
          </RecordGroupRow>
        </RecordGroup>

        <div className="grid content-start gap-4">
          <DealsWidget
            deals={contactDeals.map(toWidgetDeal)}
            emptyLabel="Nenhum negócio com esta empresa"
            format={{
              currency: 'BRL',
              locale: LOCALE,
              maximumFractionDigits: 0,
            }}
            ownerLabel="Responsável"
            title="Negócios"
          />
          <ActivityFeedWidget
            activities={contactActivities.map(toActivity)}
            emptyLabel="Nenhuma atividade registrada"
            title="Atividade"
          />
        </div>
      </div>
    </div>
  )
}
