import { RecordGroup, RecordGroupLink } from '@tc96/parttens'
import { FileTextIcon, ReceiptTextIcon } from 'lucide-react'

export function LinkedRecordsGroup() {
  return (
    <RecordGroup title="Parcelas">
      <RecordGroupLink
        href="#/parcelas/1"
        leading={<ReceiptTextIcon aria-hidden />}
        meta="Paga"
      >
        Parcela 1
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/2"
        leading={<ReceiptTextIcon aria-hidden />}
        meta="Prevista"
      >
        Parcela 2
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/3"
        leading={<ReceiptTextIcon aria-hidden />}
        meta="Prevista"
      >
        Parcela 3 do contrato de honorários da ação revisional bancária,
        renegociada em setembro
      </RecordGroupLink>
      <RecordGroupLink
        href="#/documentos/contrato-assinado.pdf"
        leading={<FileTextIcon aria-hidden />}
        meta="PDF · 12/08/2026"
      >
        contrato-assinado.pdf
      </RecordGroupLink>
    </RecordGroup>
  )
}
