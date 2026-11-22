import type { ArgTypes } from '@storybook/react-vite'

export const productivityWidgetNames = [
  'task-progress',
  'upcoming-event',
  'project-card',
  'agenda',
  'world-clock',
] as const

export type ProductivityWidgetName = (typeof productivityWidgetNames)[number]

export const productivityTones = ['default', 'inverted'] as const

export type ProductivityTone = (typeof productivityTones)[number]

export interface ProductivityControls {
  action: boolean
  empty: boolean
  live: boolean
  periods: boolean
  title: string
  tone: ProductivityTone
  widget: ProductivityWidgetName
}

export const productivityControlArgs: ProductivityControls = {
  action: true,
  empty: false,
  live: false,
  periods: true,
  title: '',
  tone: 'default',
  widget: 'task-progress',
}

export const productivityControlArgTypes: Partial<
  ArgTypes<ProductivityControls>
> = {
  action: {
    control: 'boolean',
    description:
      'Adds the `action` of the widget: the `More options` icon button of `ProjectCardWidget` and `Add event` on `AgendaWidget`. The other widgets have no `action`.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no events to `AgendaWidget`, so the selected day shows its `emptyLabel`. The other widgets keep their data.',
  },
  live: {
    control: 'boolean',
    description:
      'The `live` of `UpcomingEventWidget`: adds a red dot before the `eyebrow`. Only the event card takes it.',
  },
  periods: {
    control: 'boolean',
    description:
      'Passes `periods` to `TaskProgressWidget`, which adds the period toggle to the header and moves the trend into the panel. Without it the trend sits in the header.',
  },
  title: {
    control: 'text',
    description:
      'The `title` of the card; for `WorldClockWidget` the `label` that names it. Empty keeps the default text.',
  },
  tone: {
    control: 'inline-radio',
    description:
      'The `tone` of `TaskProgressWidget`: `inverted` renders the card in the dark palette of the theme. The other widgets have no tone.',
    options: productivityTones,
  },
  widget: {
    control: 'select',
    description: 'Picks the widget of the family to render.',
    options: productivityWidgetNames,
  },
}
