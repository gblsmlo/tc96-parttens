import { RecordDialog, RecordDialogHeadline } from '@tc96/parttens'
import { useEffect } from 'react'
import { delay } from './delay'
import { ProcessDialogTitle } from './process-dialog-title'
import { ProcessImportError } from './process-import-error'
import type { NewProcess } from './process-record'
import { ProcessSections } from './process-sections'
import {
  type ImportSimulation,
  useProcessDraft,
  useProcessImport,
} from './use-process-import'

export function ProcessCreateDialog({
  number,
  onCreate,
  onOpenChange,
  open,
  simulation,
}: Readonly<{
  number: string
  onCreate: (process: NewProcess) => void
  onOpenChange: (open: boolean) => void
  open: boolean
  simulation: ImportSimulation
}>) {
  const importer = useProcessImport(simulation)
  const draft = useProcessDraft(importer.data)
  const { reset, start } = importer

  useEffect(() => {
    if (open) start()
    else reset()
  }, [open, reset, start])

  return (
    <RecordDialog
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) draft.reset()
      }}
      onSubmit={async () => {
        await delay(150)
        onCreate({
          fields: draft.fields,
          lawyers: draft.lawyers,
          number,
          parties: draft.parties,
          title: draft.title,
        })
        return true
      }}
      open={open}
      submitDisabled={importer.pending.length > 0}
      submitLabel="Criar processo"
      submitOnModEnter
      submittingLabel="Criando"
      title={<ProcessDialogTitle number={number} />}
      titleAncestor="Processos"
    >
      <div className="grid gap-5">
        <RecordDialogHeadline
          onTitleChange={draft.setTitle}
          title={draft.title}
          titleLabel="Título"
          titlePlaceholder="Título do processo"
        />
        <ProcessImportError
          failed={importer.failed}
          onRetry={() => {
            for (const source of importer.failed) void importer.retry(source)
          }}
        />
        <ProcessSections draft={draft} status={importer.status} />
      </div>
    </RecordDialog>
  )
}
