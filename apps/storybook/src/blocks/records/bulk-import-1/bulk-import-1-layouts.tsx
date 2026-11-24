import {
  BulkImport1,
  type BulkImport1Props,
  type BulkImportRow,
} from '@tc96/blocks/records/bulk-import-1'
import { RecordGroup, RecordGroupRow, SelectProperty } from '@tc96/parttens'
import { type ReactNode, useState } from 'react'
import type { BulkImport1Controls } from './bulk-import-1-controls.ts'

export const sampleColumns = ['Nome', 'E-mail', 'Empresa']

export const sampleRows: readonly BulkImportRow[] = [
  {
    cells: ['Ana Souza', 'ana@aurora.com', 'Aurora'],
    id: 'ana',
    label: 'Ana Souza',
  },
  {
    cells: ['Bruno Lima', 'bruno@aurora.com', 'Aurora'],
    id: 'bruno',
    label: 'Bruno Lima',
  },
  {
    cells: ['Carla Mendes', 'carla@boreal.com', 'Boreal'],
    disabledReason: 'Já cadastrado',
    id: 'carla',
    label: 'Carla Mendes',
  },
]

export interface ComposedBulkImport1Props
  extends BulkImport1Controls,
    Partial<
      Pick<
        BulkImport1Props,
        'onImport' | 'onOpenChange' | 'onSearchAgain' | 'onStepChange'
      >
    > {
  children?: ReactNode
  defaultSelected?: readonly string[]
  onSelectedChange?: (selected: readonly string[]) => void
}

const owners = [
  { label: 'Ana Souza', value: 'ana' },
  { label: 'Bruno Lima', value: 'bruno' },
]

function SharedFields() {
  const [owner, setOwner] = useState<string | null>('ana')
  return (
    <RecordGroup collapsible={false} title="Vale para todos">
      <RecordGroupRow label="Responsável">
        <SelectProperty
          ariaLabel="Responsável"
          onValueChange={setOwner}
          options={owners}
          value={owner}
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}

export function ComposedBulkImport1({
  children,
  defaultSelected = ['ana', 'bruno'],
  importing,
  onImport = () => true,
  onOpenChange = () => undefined,
  onSearchAgain = () => undefined,
  onSelectedChange,
  onStepChange = () => undefined,
  progress,
  searching,
  step,
  title,
}: Readonly<ComposedBulkImport1Props>) {
  const [selected, setSelected] = useState(defaultSelected)

  return (
    <BulkImport1
      columns={sampleColumns}
      importing={importing}
      labels={{ ancestor: 'Contatos', title }}
      onImport={onImport}
      onOpenChange={onOpenChange}
      onSearchAgain={onSearchAgain}
      onSelectedChange={(next) => {
        setSelected(next)
        onSelectedChange?.(next)
      }}
      onStepChange={onStepChange}
      open
      progress={
        progress
          ? [
              {
                detail: 'importado',
                id: 'ana',
                status: 'done',
                title: 'Ana Souza',
              },
              {
                detail: 'importando',
                id: 'bruno',
                status: 'running',
                title: 'Bruno Lima',
              },
            ]
          : undefined
      }
      query="Planilha contatos.csv"
      rows={sampleRows}
      searchedAt="Lida às 09:40"
      searching={searching}
      selected={selected}
      step={step}
    >
      {children ?? <SharedFields />}
    </BulkImport1>
  )
}
