import type { ArgTypes } from '@storybook/react-vite'
import type { TabsSize, TabsVariant } from '@tc96/ui/tabs'
import {
  type TabsOrientation,
  type TabValue,
  tabsOrientations,
  tabsSizeNames,
  tabsVariantNames,
  tabValues,
} from './tabs-variants.ts'

export interface TabsControls {
  defaultValue: TabValue
  disabledTab: boolean
  firstTab: string
  icons: boolean
  orientation: TabsOrientation
  secondTab: string
  size: TabsSize
  thirdTab: string
  variant: TabsVariant
}

export const tabsControlArgs: TabsControls = {
  defaultValue: 'overview',
  disabledTab: false,
  firstTab: 'Overview',
  icons: false,
  orientation: 'horizontal',
  secondTab: 'Activity',
  size: 'default',
  thirdTab: 'Settings',
  variant: 'default',
}

export const tabsControlArgTypes: Partial<ArgTypes<TabsControls>> = {
  defaultValue: {
    control: 'select',
    description:
      'The `defaultValue` of `Tabs`: the tab active on mount; changing it remounts the tabs.',
    options: tabValues,
  },
  disabledTab: {
    control: 'boolean',
    description: 'The `disabled` of the third `TabsTab` alone.',
  },
  firstTab: {
    control: 'text',
    description:
      'Text of the first `TabsTab`, which names the tab and its panel.',
  },
  icons: {
    control: 'boolean',
    description: 'Adds a decorative icon before the text of every `TabsTab`.',
  },
  orientation: {
    control: 'inline-radio',
    description: 'The `orientation` of `Tabs`.',
    options: tabsOrientations,
  },
  secondTab: {
    control: 'text',
    description:
      'Text of the second `TabsTab`, which names the tab and its panel.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `TabsList`, inherited by every `TabsTab`.',
    options: tabsSizeNames,
  },
  thirdTab: {
    control: 'text',
    description:
      'Text of the third `TabsTab`, which names the tab and its panel.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `TabsList`.',
    options: tabsVariantNames,
  },
}
