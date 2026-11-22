import type { ArgTypes } from '@storybook/react-vite'

export const gamificationWidgetNames = [
  'level',
  'streak',
  'achievements',
  'quests',
  'hud',
  'footer',
] as const

export type GamificationWidgetName = (typeof gamificationWidgetNames)[number]

export interface GamificationControls {
  action: boolean
  firstDay: boolean
  title: string
  widget: GamificationWidgetName
}

export const gamificationControlArgs: GamificationControls = {
  action: false,
  firstDay: false,
  title: '',
  widget: 'level',
}

export const gamificationControlArgTypes: Partial<
  ArgTypes<GamificationControls>
> = {
  action: {
    control: 'boolean',
    description:
      'Adds an `action` button to the header of `LevelWidget`, `StreakWidget`, `AchievementsWidget` and `QuestsWidget`. On the last two it replaces the count (`1 de 3`) and the `description` that the header shows without it. `ProgressHud` and `ProgressFooter` have no `action`.',
  },
  firstDay: {
    control: 'boolean',
    description:
      'Passes the data of a learner who has not started: no XP, no streak, every achievement locked, every quest open, and a footer with no score. `ProgressFooter` shows its empty ring for the missing score.',
  },
  title: {
    control: 'text',
    description:
      'The `title` of the card, or the `aria-label` of `ProgressHud`. Empty keeps the default text; `ProgressFooter` has none.',
  },
  widget: {
    control: 'select',
    description: 'Picks the widget of the family to render.',
    options: gamificationWidgetNames,
  },
}
