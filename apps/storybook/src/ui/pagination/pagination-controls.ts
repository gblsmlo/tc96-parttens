import type { ArgTypes } from '@storybook/react-vite'
import {
  type PaginationElementName,
  type PaginationSizeName,
  paginationElementNames,
  paginationPages,
  paginationSizeNames,
} from './pagination-variants.ts'

export interface PaginationControls {
  activePage: number
  element: PaginationElementName
  ellipsis: boolean
  next: boolean
  pages: boolean
  previous: boolean
  size: PaginationSizeName
}

export const paginationControlArgs: PaginationControls = {
  activePage: 2,
  element: 'a',
  ellipsis: true,
  next: true,
  pages: true,
  previous: true,
  size: 'default',
}

export const paginationControlArgTypes: Partial<ArgTypes<PaginationControls>> =
  {
    activePage: {
      control: 'select',
      description:
        'Number of the page link that takes `isActive`; 0 leaves every page inactive.',
      options: [0, ...paginationPages],
    },
    element: {
      control: 'inline-radio',
      description:
        'Renders every link as an `a` with `href`, or as a `Button` through `render`.',
      options: paginationElementNames,
    },
    ellipsis: {
      control: 'boolean',
      description: 'Adds a `PaginationEllipsis` after the page links.',
    },
    next: {
      control: 'boolean',
      description: 'Adds a `PaginationNext` at the end.',
    },
    pages: {
      control: 'boolean',
      description: 'Adds the `PaginationLink` items of pages 1, 2 and 3.',
    },
    previous: {
      control: 'boolean',
      description: 'Adds a `PaginationPrevious` at the start.',
    },
    size: {
      control: 'select',
      description:
        'Sets `size` on every link: `icon-<value>` on the page links (`icon` for `default`), `<value>` on Previous and Next.',
      options: paginationSizeNames,
    },
  }
