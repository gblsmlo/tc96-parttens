import type { ArgTypes } from '@storybook/react-vite'
import {
  type AccordionOpenItem,
  accordionOpenItems,
} from './accordion-variants.ts'

export interface AccordionControls {
  defaultValue: AccordionOpenItem
  disabled: boolean
  disabledItem: boolean
  firstTrigger: string
  icons: boolean
  secondTrigger: string
  thirdTrigger: string
}

export const accordionControlArgs: AccordionControls = {
  defaultValue: 'none',
  disabled: false,
  disabledItem: false,
  firstTrigger: 'First section',
  icons: false,
  secondTrigger: 'Second section',
  thirdTrigger: 'Third section',
}

export const accordionControlArgTypes: Partial<ArgTypes<AccordionControls>> = {
  defaultValue: {
    control: 'select',
    description:
      'The `defaultValue` of `Accordion`, as the one item open on mount; changing it remounts the accordion.',
    options: accordionOpenItems,
  },
  disabled: {
    control: 'boolean',
    description:
      'The `disabled` of `Accordion`: every trigger ignores presses and keys. It changes no look of its own.',
  },
  disabledItem: {
    control: 'boolean',
    description:
      'The `disabled` of the third `AccordionItem` alone. It changes no look of its own.',
  },
  firstTrigger: {
    control: 'text',
    description:
      'Text of the first `AccordionTrigger`, which names the button and its panel.',
  },
  icons: {
    control: 'boolean',
    description: 'Adds a decorative icon before the text of every trigger.',
  },
  secondTrigger: {
    control: 'text',
    description:
      'Text of the second `AccordionTrigger`, which names the button and its panel.',
  },
  thirdTrigger: {
    control: 'text',
    description:
      'Text of the third `AccordionTrigger`, which names the button and its panel.',
  },
}
