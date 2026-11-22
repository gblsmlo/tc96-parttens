import type { ArgTypes } from '@storybook/react-vite'
import {
  type BreadcrumbElementName,
  type BreadcrumbSeparatorName,
  breadcrumbElementNames,
  breadcrumbSeparatorNames,
} from './breadcrumb-variants.ts'

export interface BreadcrumbControls {
  element: BreadcrumbElementName
  ellipsis: boolean
  page: string
  separator: BreadcrumbSeparatorName
}

export const breadcrumbControlArgs: BreadcrumbControls = {
  element: 'a',
  ellipsis: false,
  page: 'Annual report',
  separator: 'chevron',
}

export const breadcrumbControlArgTypes: Partial<ArgTypes<BreadcrumbControls>> =
  {
    element: {
      control: 'inline-radio',
      description:
        'Renders every `BreadcrumbLink` as an `a` with `href`, or as a `button` through `render`.',
      options: breadcrumbElementNames,
    },
    ellipsis: {
      control: 'boolean',
      description:
        'Replaces Documents and Finance with a `BreadcrumbEllipsis` inside a `Menu` trigger that lists them.',
    },
    page: {
      control: 'text',
      description:
        'Text of `BreadcrumbPage`; empty removes the part and the separator before it.',
    },
    separator: {
      control: 'inline-radio',
      description:
        'Children of every `BreadcrumbSeparator`: none, which renders the chevron, or a `/`.',
      options: breadcrumbSeparatorNames,
    },
  }
