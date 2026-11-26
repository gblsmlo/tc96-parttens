import type { ArgTypes } from '@storybook/react-vite'
import {
  type CenterContent,
  centerContents,
  type LeftContent,
  leftContents,
  type RightContent,
  rightContents,
  type ToolbarModeName,
  toolbarModeNames,
} from './toolbar-variants.ts'

export interface ToolbarControls {
  ariaLabel: string
  center: CenterContent
  description: string
  left: LeftContent
  right: RightContent
  mode: ToolbarModeName
  title: string
}

export const toolbarControlArgs: ToolbarControls = {
  ariaLabel: 'Controles da coleção',
  center: 'none',
  description: 'Acompanhe e organize o trabalho da equipe.',
  left: 'switcher',
  mode: 'plain',
  right: 'settings-and-action',
  title: 'Tarefas',
}

const whenHeading = { arg: 'left', eq: 'heading' } as const

export const toolbarControlArgTypes: Partial<ArgTypes<ToolbarControls>> = {
  ariaLabel: {
    control: 'text',
    description: 'The `aria-label` of `CollectionToolbar`.',
  },
  center: {
    control: 'inline-radio',
    description:
      'What fills `center`: nothing, or `CollectionSearchField`, which then leaves `left`.',
    options: centerContents,
  },
  description: {
    control: 'text',
    description: 'The muted line under the heading; empty removes it.',
    if: whenHeading,
  },
  left: {
    control: 'select',
    description:
      'What fills `left`: `ViewSwitcherMenu`, an `h2` heading with its description, `CollectionSearchField`, or nothing.',
    options: leftContents,
  },
  mode: {
    control: 'inline-radio',
    description: 'The `mode` of `CollectionToolbar`.',
    options: toolbarModeNames,
  },
  right: {
    control: 'select',
    description:
      'What fills `right`: `ViewSettings` and `Action` ("Nova tarefa"), one of them, or nothing.',
    options: rightContents,
  },
  title: {
    control: 'text',
    description: 'The text of the `h2` heading.',
    if: whenHeading,
  },
}
