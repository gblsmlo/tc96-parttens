import type { ArgTypes } from '@storybook/react-vite'
import type { Legal8View } from '@tc96/ui/blocks/data/legal/legal-8'

export interface Legal8Controls {
  counted: boolean
  empty: boolean
  openable: boolean
  runError: boolean
  runnable: boolean
  running: boolean
  savedViews: boolean
  scheduled: boolean
  stopped: boolean
  title: string
  view: Legal8View
}

export const legal8ControlArgs: Legal8Controls = {
  counted: true,
  empty: false,
  openable: true,
  runError: false,
  runnable: true,
  running: false,
  savedViews: true,
  scheduled: true,
  stopped: false,
  title: 'Monitoramento',
  view: 'runs',
}

export const legal8ControlArgTypes: Partial<ArgTypes<Legal8Controls>> = {
  counted: {
    control: 'boolean',
    description:
      'Passes `counts`; on, each view in the switcher popup shows its count, named by `labels.viewCountName`.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no runs and no failures, which renders the empty message of the view.',
  },
  openable: {
    control: 'boolean',
    description:
      'Passes `onOpenFailure`; on, a failure row opens and a run with a failure shows Ver falha.',
  },
  runError: {
    control: 'boolean',
    description: 'Shows `labels.runFailed` under the notice.',
  },
  runnable: {
    control: 'boolean',
    description: 'Passes `onRun`; off, the notice has no action.',
  },
  running: {
    control: 'boolean',
    description: 'Disables the notice action while a run is requested.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews`, `savedViewId`, `savedViewModified`, the saved view callbacks and `onSavePreference`; on, the switcher lists Minhas visões after the views and Exibição ends with Salvar preferência.',
  },
  scheduled: {
    control: 'boolean',
    description:
      'Passes `nextSweepAt`; off, the notice has no description line.',
  },
  stopped: {
    control: 'boolean',
    description:
      'Passes `stoppedSince`; on, the notice is the error alert and its action reads Tentar agora.',
  },
  title: {
    control: 'text',
    description: 'Text of `labels.title`: the name of the section.',
  },
  view: {
    control: 'inline-radio',
    description:
      'The view shown; the switcher and Ver falha change it too and call `onViewChange`.',
    options: ['runs', 'failures'],
  },
}
