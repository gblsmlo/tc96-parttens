import type { ArgTypes } from '@storybook/react-vite'

export interface ViewSettingsControls {
  clear: boolean
  clearLabel: string
  label: string
  savePreference: boolean
  savePreferenceLabel: string
}

export const viewSettingsControlArgs: ViewSettingsControls = {
  clear: true,
  clearLabel: 'Limpar filtros',
  label: 'Exibição',
  savePreference: true,
  savePreferenceLabel: 'Salvar preferência',
}

export const viewSettingsControlArgTypes: Partial<
  ArgTypes<ViewSettingsControls>
> = {
  clear: {
    control: 'boolean',
    description:
      'Passes `onClearFilters`, which adds the clear item to the footer; it stays disabled until a filter is checked.',
  },
  clearLabel: {
    control: 'text',
    description: 'The `clearLabel` of `ViewSettingsMenu`.',
    if: { arg: 'clear' },
  },
  label: {
    control: 'text',
    description:
      'The `label` of `ViewSettingsMenu`, the trigger text; the active filter count follows it.',
  },
  savePreference: {
    control: 'boolean',
    description:
      'Passes `onSavePreference`, which adds the save item to the footer; it stays disabled until a setting changes.',
  },
  savePreferenceLabel: {
    control: 'text',
    description: 'The `savePreferenceLabel` of `ViewSettingsMenu`.',
    if: { arg: 'savePreference' },
  },
}
