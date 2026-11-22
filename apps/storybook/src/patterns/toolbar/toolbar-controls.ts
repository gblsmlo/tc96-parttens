import type { ArgTypes } from '@storybook/react-vite'
import {
  type SwitcherVariantName,
  switcherVariantNames,
  type ToolbarVariantName,
  toolbarVariantNames,
} from './toolbar-variants.ts'

export interface ToolbarControls {
  action: boolean
  ariaLabel: string
  centerSlot: boolean
  description: string
  settings: boolean
  switcher: boolean
  switcherCreate: boolean
  switcherIcon: boolean
  switcherLoading: boolean
  switcherOptions: boolean
  switcherSearch: boolean
  switcherVariant: SwitcherVariantName
  title: string
  variant: ToolbarVariantName
}

export const toolbarControlArgs: ToolbarControls = {
  action: true,
  ariaLabel: 'Controles da coleção',
  centerSlot: false,
  description: 'Acompanhe e organize o trabalho da equipe.',
  settings: true,
  switcher: true,
  switcherCreate: false,
  switcherIcon: true,
  switcherLoading: false,
  switcherOptions: false,
  switcherSearch: false,
  switcherVariant: 'ghost',
  title: 'Tarefas',
  variant: 'plain',
}

export const toolbarControlArgTypes: Partial<ArgTypes<ToolbarControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds `Action` ("Nova tarefa") to `endSlot`, after the view settings.',
  },
  ariaLabel: {
    control: 'text',
    description: 'The `aria-label` of `CollectionToolbar`.',
  },
  centerSlot: {
    control: 'boolean',
    description:
      'Fills `centerSlot` with a day, week and month toggle that stays at the middle of the toolbar.',
  },
  description: {
    control: 'text',
    description:
      'The `description` of `CollectionToolbar`; only `variant="text"` takes it, so the other variants ignore this text.',
  },
  settings: {
    control: 'boolean',
    description:
      'Adds `ViewSettingsMenu` to `endSlot`, with the layout tabs, a display section and the filters.',
  },
  switcher: {
    control: 'boolean',
    description:
      'Fills `startSlot` with `ViewSwitcherMenu`, its saved views and the selected one as the trigger label.',
  },
  switcherCreate: {
    control: 'boolean',
    description:
      'Adds `ViewSwitcherCreate` at the end of the popover; it adds a view and selects it.',
  },
  switcherIcon: {
    control: 'boolean',
    description:
      'Gives `ViewSwitcherMenu` and every `ViewSwitcherItem` an `icon`.',
  },
  switcherLoading: {
    control: 'boolean',
    description:
      'Sets `loading` on `ViewSwitcherItems`: only the selected view stays, followed by skeleton rows. Open the trigger to see them.',
  },
  switcherOptions: {
    control: 'boolean',
    description:
      'Gives the selected `ViewSwitcherItem` its `options` menu: favorite, duplicate and delete.',
  },
  switcherSearch: {
    control: 'boolean',
    description:
      'Adds `ViewSwitcherSearch` at the top of the popover; the story filters the views by what is typed.',
  },
  switcherVariant: {
    control: 'select',
    description: 'The `variant` of `ViewSwitcherMenu`.',
    options: switcherVariantNames,
  },
  title: {
    control: 'text',
    description:
      'The `title` of `CollectionToolbar`; only `variant="text"` shows it, as the heading.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `CollectionToolbar`.',
    options: toolbarVariantNames,
  },
}
