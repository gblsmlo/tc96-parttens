import type { ArgTypes } from '@storybook/react-vite'
import type { FlowDirection } from '@tc96/ui/patterns'
import {
  type CanvasRunName,
  canvasDirectionNames,
  canvasRunNames,
} from './canvas-variants.ts'

export interface CanvasControls {
  controls: boolean
  direction: FlowDirection
  edgeControls: boolean
  empty: boolean
  loading: boolean
  locked: boolean
  minimap: boolean
  run: CanvasRunName
  selected: boolean
  shortcuts: boolean
  stepMenu: boolean
}

export const canvasControlArgs: CanvasControls = {
  controls: true,
  direction: 'horizontal',
  edgeControls: false,
  empty: false,
  loading: false,
  locked: false,
  minimap: true,
  run: 'last-run',
  selected: false,
  shortcuts: true,
  stepMenu: false,
}

export const canvasControlArgTypes: Partial<ArgTypes<CanvasControls>> = {
  controls: {
    control: 'boolean',
    description:
      'Adds `FlowCanvasControls`, with a lock toggle of the story as `children`.',
  },
  direction: {
    control: 'inline-radio',
    description:
      'The `direction` of `FlowCanvas`; the sample graph is laid out again with `tidyTree` for it.',
    options: canvasDirectionNames,
  },
  edgeControls: {
    control: 'boolean',
    description:
      'When on, passes `edgeControls`; off leaves the default, which is on in `vertical`. The buttons show on hover or focus.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no steps and no connections: the empty state.',
  },
  loading: {
    control: 'boolean',
    description: 'The `loading` of `FlowCanvas`.',
  },
  locked: {
    control: 'boolean',
    description:
      'The `locked` of `FlowCanvas`, also held by the lock toggle in the controls.',
  },
  minimap: {
    control: 'boolean',
    description: 'Adds `FlowCanvasMinimap`, shown from `md`.',
  },
  run: {
    control: 'select',
    description:
      'The `run` of every step: the sample last run (success, failed, skipped and not run), all succeeded, all running, or no run.',
    options: canvasRunNames,
  },
  selected: {
    control: 'boolean',
    description:
      'Starts with `Lead qualificado?` as `selectedStepId`, which shows its toolbar.',
  },
  shortcuts: {
    control: 'boolean',
    description:
      'Adds `FlowShortcutsPopover` to the controls; it shows only with `controls`.',
  },
  stepMenu: {
    control: 'boolean',
    description:
      'When on, passes `stepMenu`; off leaves the default, which is on in `vertical`.',
  },
}
