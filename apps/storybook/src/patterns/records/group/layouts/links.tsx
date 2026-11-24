import { FileTextIcon, ReceiptIcon } from '@phosphor-icons/react'
import { RecordGroup, RecordGroupLink } from '@tc96/parttens'

export function LinkedRecordsGroup() {
  return (
    <RecordGroup title="Parcelas">
      <RecordGroupLink
        href="#/parcelas/1"
        leading={<ReceiptIcon aria-hidden />}
        meta="Paga"
      >
        Parcela 1
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/2"
        leading={<ReceiptIcon aria-hidden />}
        meta="Prevista"
      >
        Parcela 2
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/3"
        leading={<ReceiptIcon aria-hidden />}
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
