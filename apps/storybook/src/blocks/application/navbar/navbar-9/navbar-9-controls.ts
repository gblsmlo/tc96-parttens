import type { ArgTypes } from '@storybook/react-vite'

export interface Navbar9Controls {
  branch: string
  running: boolean
  showBranches: boolean
  showRun: boolean
  showShare: boolean
}

export const navbar9ControlArgs: Navbar9Controls = {
  branch: 'main',
  running: false,
  showBranches: true,
  showRun: true,
  showShare: true,
}

export const navbar9ControlArgTypes: Partial<ArgTypes<Navbar9Controls>> = {
  branch: {
    control: 'select',
    description: 'The `branch` prop, the id of the active ref.',
    options: ['main', 'feat-filtros', 'fix-paginacao', 'v1-4-0', 'producao'],
  },
  running: {
    control: 'boolean',
    description: 'Disables Executar and swaps its text for the pending label.',
  },
  showBranches: {
    control: 'boolean',
    description:
      'Passes `branches` and `onBranchChange`; without them no picker.',
  },
  showRun: {
    control: 'boolean',
    description: 'Passes `onRun`; without it Executar is absent.',
  },
  showShare: {
    control: 'boolean',
    description: 'Passes `onShare`; without it Compartilhar is absent.',
  },
}
