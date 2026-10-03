import { getInitials } from '@tc96/helpers/initials'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { MailIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import type { AvatarStackPerson } from '../shared/avatar-stack'
import { CardWidgetShell } from '../shared/card-widget-shell'
import type { WidgetExpandProps } from '../shared/expandable-list'
import { type Activity, ActivityTimeline } from './activity-timeline'

export interface ContactChannelLabels {
  email: string
  phone: string
  whatsapp: string
}

export interface ContactTag {
  id: string
  label: ReactNode
}

export interface ContactWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  activities?: readonly Activity[]
  activitiesLabel?: string
  channelLabels?: ContactChannelLabels
  company?: ReactNode
  email?: string
  expand?: WidgetExpandProps
  emptyLabel?: ReactNode
  person: AvatarStackPerson
  phone?: string
  jobTitle?: ReactNode
  tags?: readonly ContactTag[]
  whatsapp?: string
}

const defaultChannelLabels: ContactChannelLabels = {
  email: 'E-mail',
  phone: 'Ligar',
  whatsapp: 'WhatsApp',
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`
}

export function ContactWidget({
  action,
  activities,
  activitiesLabel = 'Atividade recente',
  channelLabels = defaultChannelLabels,
  className,
  company,
  email,
  expand,
  emptyLabel,
  jobTitle,
  person,
  phone,
  tags,
  whatsapp,
  ...props
}: Readonly<ContactWidgetProps>): ReactElement {
  const titleId = useId()
  const channels = [
    email
      ? { href: `mailto:${email}`, icon: MailIcon, id: 'email' as const }
      : null,
    phone
      ? { href: `tel:${phone}`, icon: PhoneIcon, id: 'phone' as const }
      : null,
    whatsapp
      ? {
          href: whatsappHref(whatsapp),
          icon: MessageCircleIcon,
          id: 'whatsapp' as const,
        }
      : null,
  ].filter((channel) => channel !== null)

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="contact"
      {...props}
    >
      <CardPanel className="grid gap-5 p-5">
        <div className="flex items-start gap-3">
          <span className="flex shrink-0 rounded-full border border-input bg-card">
            <Avatar className="size-12 text-sm">
              {person.imageUrl ? (
                <AvatarImage alt="" src={person.imageUrl} />
              ) : null}
              <AvatarFallback>
                {person.fallback ?? getInitials(person.label)}
              </AvatarFallback>
            </Avatar>
          </span>
          <div className="grid min-w-0 flex-1 gap-1">
            <h3 className="truncate font-semibold text-base" id={titleId}>
              {person.label}
            </h3>
            {jobTitle || company ? (
              <p className="truncate text-muted-foreground text-sm">
                {jobTitle}
                {jobTitle && company ? ' · ' : null}
                {company}
              </p>
            ) : null}
            {tags?.length ? (
              <ul
                className="flex flex-wrap gap-1 pt-1"
                data-slot="contact-tags"
              >
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <Badge variant="outline">{tag.label}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {action}
        </div>
        {channels.length ? (
          <div className="flex flex-wrap gap-2" data-slot="contact-channels">
            {channels.map((channel) => (
              <Button
                data-channel={channel.id}
                key={channel.id}
                render={
                  <a
                    href={channel.href}
                    {...(channel.id === 'whatsapp'
                      ? { rel: 'noreferrer', target: '_blank' }
                      : {})}
                  />
                }
                size="sm"
                variant="outline"
              >
                <channel.icon aria-hidden="true" />
                {channelLabels[channel.id]}
              </Button>
            ))}
          </div>
        ) : null}
        {activities ? (
          <div className="grid gap-3">
            <h4
              className="text-muted-foreground text-sm"
              id={`${titleId}-activities`}
            >
              {activitiesLabel}
            </h4>
            <ActivityTimeline
              activities={activities}
              aria-label={activitiesLabel}
              {...(emptyLabel === undefined ? {} : { emptyLabel })}
              {...(expand ? { expand } : {})}
              {...(expand ? { expand } : {})}
            />
          </div>
        ) : null}
      </CardPanel>
    </CardWidgetShell>
  )
}
