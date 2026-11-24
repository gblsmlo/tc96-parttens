import type { AvatarStackPerson } from '@tc96/parttens/widgets/shared/avatar-stack'

export interface Card4Meeting {
  attendees: readonly AvatarStackPerson[]
  duration: string
  id: string
  timeRange: string
  title: string
}

export interface Card4Labels {
  attendees: (title: string) => string
  emptyDescription: string
  emptyTitle: string
  join: string
  joinMeeting: (title: string) => string
  title: string
}

export interface Card4Props {
  className?: string
  labels?: Partial<Card4Labels>
  maxAttendees?: number
  meetings: readonly Card4Meeting[]
  onJoin?: (meetingId: string) => void
}
