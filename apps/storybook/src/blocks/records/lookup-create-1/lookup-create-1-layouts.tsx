import {
  LookupCreate1,
  type LookupCreate1Props,
  type RecordsStatusRow,
} from '@tc96/blocks/records/lookup-create-1'
import { RecordGroup, RecordGroupRow, TextProperty } from '@tc96/parttens'
import type { ReactNode } from 'react'
import type {
  LookupCreate1Controls,
  LookupSourceSet,
} from './lookup-create-1-controls.ts'

const sourceSets: Record<LookupSourceSet, readonly RecordsStatusRow[]> = {
  answered: [
    {
      detail: 'razão social e endereço',
      id: 'tax',
      status: 'done',
      title: 'Receita',
    },
    {
      detail: 'sócios',
      id: 'registry',
      status: 'done',
      title: 'Junta Comercial',
    },
  ],
  failed: [
    {
      detail: 'razão social e endereço',
      id: 'tax',
      status: 'done',
      title: 'Receita',
    },
    {
      detail: 'não respondeu',
      id: 'registry',
      status: 'failed',
      title: 'Junta Comercial',
    },
  ],
  none: [],
  searching: [
    {
      detail: 'buscando razão social e endereço',
      id: 'tax',
      status: 'running',
      title: 'Receita',
    },
    {
      detail: 'buscando sócios',
      id: 'registry',
      status: 'running',
      title: 'Junta Comercial',
    },
  ],
}

export const sampleAlternatives = [
  {
    description: 'Importa várias empresas de uma planilha.',
    id: 'sheet',
    title: 'Importar planilha',
  },
  {
    description: 'Sem buscar nas fontes.',
    id: 'manual',
    title: 'Preencher à mão',
  },
]

export interface ComposedLookupCreate1Props
  extends LookupCreate1Controls,
    Partial<
      Pick<
        LookupCreate1Props,
        | 'onAlternative'
        | 'onIdentifierChange'
        | 'onOpenChange'
        | 'onRetry'
        | 'onStepChange'
        | 'onSubmit'
        | 'onTitleChange'
      >
    > {
  children?: ReactNode
  identifier?: string
}

export function ComposedLookupCreate1({
  alternatives,
  children,
  identifier = '12.345.678/0001',
  identifierState,
  onAlternative,
  onIdentifierChange = () => undefined,
  onOpenChange = () => undefined,
  onRetry = () => undefined,
  onStepChange = () => undefined,
  onSubmit = () => true,
  onTitleChange = () => undefined,
  recordTitle,
  sources,
  step,
  title,
}: Readonly<ComposedLookupCreate1Props>) {
  return (
    <LookupCreate1
      alternatives={alternatives ? sampleAlternatives : undefined}
      existing={{
        description: 'Esta empresa já está cadastrada: Aurora Comércio Ltda.',
        href: '#/empresas/aurora',
      }}
      identifier={identifier}
      identifierState={identifierState}
      labels={{
        ancestor: 'Empresas',
        identifier: 'CNPJ',
        identifierPlaceholder: '00.000.000/0000-00',
        openExisting: 'Abrir empresa',
        submit: 'Criar empresa',
        title,
        titleField: 'Nome da empresa',
      }}
      onAlternative={onAlternative}
      onIdentifierChange={onIdentifierChange}
      onOpenChange={onOpenChange}
      onRetry={onRetry}
      onStepChange={onStepChange}
      onSubmit={onSubmit}
      onTitleChange={onTitleChange}
      open
      recordTitle={recordTitle}
      sources={sourceSets[sources]}
      step={step}
    >
      {children ?? (
        <RecordGroup collapsible={false} title="Dados">
          <RecordGroupRow label="Endereço">
            <TextProperty
              editing="inline"
              fallback="Adicionar endereço"
              value={null}
              variant="plain"
              ariaLabel="Endereço"
            />
          </RecordGroupRow>
        </RecordGroup>
      )}
    </LookupCreate1>
  )
}
