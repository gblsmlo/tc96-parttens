import type { ArgTypes } from '@storybook/react-vite'
import type {
  Crm1Archived,
  Crm1Mode,
  Crm1Variant,
} from '@tc96/ui/blocks/data/crm/crm-1'

export interface Crm1Controls {
  archivedFilter: Crm1Archived
  bulkActions: boolean
  empty: boolean
  headerActions: boolean
  mode: Crm1Mode
  openable: boolean
  paginated: boolean
  savedViews: boolean
  variant: Crm1Variant
  viewCounts: boolean
}

export const crm1ControlArgs: Crm1Controls = {
  archivedFilter: 'exclude',
  bulkActions: true,
  empty: false,
  headerActions: true,
  mode: 'table',
  openable: true,
  paginated: true,
  savedViews: true,
  variant: 'people',
  viewCounts: true,
}

export const crm1ControlArgTypes: Partial<ArgTypes<Crm1Controls>> = {
  archivedFilter: {
    control: 'inline-radio',
    description:
      'The initial Arquivados filter; `exclude` hides the archived contacts, `include` shows them with the muted Arquivado mark.',
    options: ['exclude', 'include', 'only'],
  },
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange`, `onBulkArchive`, `onBulkUnarchive` and, for Empresas, `onBulkSectorChange`; off, the table has no select column and no action bar.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no records, which renders the empty message of the variant.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Exibição and Nova pessoa or Nova empresa after it.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
    options: ['list', 'table'],
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row and a list title open the record.',
  },
  paginated: {
    control: 'boolean',
    description:
      'Passes `page`, `pageCount`, `pageSize` and `total`; off, the footer is not rendered.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews` and their callbacks; on, the switcher lists Minhas visões and Salvar visualização, and Exibição offers Salvar preferência.',
  },
  variant: {
    control: 'inline-radio',
    description:
      'The collection: `people` (Pessoa, E-mail, Telefone, CPF, Tags) or `companies` (Empresa, Telefone, CNPJ, Setor, Tags and Definir setor).',
    options: ['people', 'companies'],
  },
  viewCounts: {
    control: 'boolean',
    description:
      'Passes `counts`; on, Pessoas and Empresas in the switcher popup show their count.',
  },
}
