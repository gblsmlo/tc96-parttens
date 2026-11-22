import type { ArgTypes } from '@storybook/react-vite'

export const crmWidgetNames = [
  'deals',
  'pipeline',
  'activity-feed',
  'contact',
] as const

export type CrmWidgetName = (typeof crmWidgetNames)[number]

export interface CrmControls {
  action: boolean
  empty: boolean
  title: string
  visibleCount: number
  widget: CrmWidgetName
}

export const crmControlArgs: CrmControls = {
  action: true,
  empty: false,
  title: '',
  visibleCount: 5,
  widget: 'deals',
}

export const crmControlArgTypes: Partial<ArgTypes<CrmControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds the `action` of the widget: a `View all` button in the header, or the `More actions` icon button of `ContactWidget`. `PipelineWidget` drops it when it has `periods`.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no data: the empty label of `DealsWidget` and `ActivityFeedWidget`, no stages for `PipelineWidget`, no recent activity for `ContactWidget`.',
  },
  title: {
    control: 'text',
    description:
      'The `title` of the card. Empty keeps the title of the widget; `ContactWidget` has none, since the person names it.',
  },
  visibleCount: {
    control: { max: 8, min: 1, type: 'number' },
    description:
      'The `visibleCount` of the `expand` prop: how many rows show before the rest folds under `Ver todas`.',
  },
  widget: {
    control: 'select',
    description: 'Picks the widget of the family to render.',
    options: crmWidgetNames,
  },
}
