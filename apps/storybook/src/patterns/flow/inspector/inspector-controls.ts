import type { ArgTypes } from '@storybook/react-vite'
import type { FlowInspectorTab, FlowRunStatus } from '@tc96/parttens'
import {
  type InspectorLogSetName,
  inspectorLogSetNames,
  inspectorRunStatusNames,
  inspectorTabNames,
} from './inspector-variants.ts'

export interface InspectorControls {
  badge: string
  disabledTabs: boolean
  footer: boolean
  headerActions: boolean
  icon: boolean
  logs: InspectorLogSetName
  open: boolean
  runStatus: FlowRunStatus
  tab: FlowInspectorTab
  title: string
  unconnected: boolean
  width: string
}

export const inspectorControlArgs: InspectorControls = {
  badge: 'Visualizando',
  disabledTabs: false,
  footer: true,
  headerActions: true,
  icon: true,
  logs: 'entries',
  open: true,
  runStatus: 'failed',
  tab: 'build',
  title: 'Enviar cobrança',
  unconnected: false,
  width: '24rem',
}

export const inspectorControlArgTypes: Partial<ArgTypes<InspectorControls>> = {
  badge: {
    control: 'text',
    description: 'The `badge` under the title; empty removes the part.',
  },
  disabledTabs: {
    control: 'boolean',
    description: 'Passes `disabledTabs` with `status` and `logs`.',
  },
  footer: {
    control: 'boolean',
    description:
      'Passes two buttons as `children`, the footer; off removes the footer.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes a delete button as `headerActions`, before the close button.',
  },
  icon: {
    control: 'boolean',
    description: 'Passes the `icon` of the step type.',
  },
  logs: {
    control: 'inline-radio',
    description:
      'The `entries` of the `FlowInspectorLogs` in Logs: three entries, or none (the empty state with its action).',
    options: inspectorLogSetNames,
  },
  open: {
    control: 'boolean',
    description:
      'The `open` of `FlowInspector`; closed, the story shows a button that opens it again.',
  },
  runStatus: {
    control: 'select',
    description:
      'The `status` of the `FlowInspectorStatus` in Status: the state of the last run.',
    options: inspectorRunStatusNames,
  },
  tab: {
    control: 'inline-radio',
    description: 'The `tab` the inspector opens on.',
    options: inspectorTabNames,
  },
  title: {
    control: 'text',
    description: 'The `title` of `FlowInspector`, the `h2` of the header.',
  },
  unconnected: {
    control: 'boolean',
    description: 'The `unconnected` of `FlowInspector`: the alert in Build.',
  },
  width: {
    control: 'text',
    description: 'The `width` of the docked panel, any CSS length.',
  },
}
