import {
  RecordDialog,
  RecordDialogHeadline,
  RecordStatusItem,
  RecordStatusList,
} from '@tc96/parttens'
import { Alert, AlertAction, AlertDescription } from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { Field, FieldDescription, FieldLabel } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { sleep } from '../../../test-utils/sleep'
import {
  LawsuitFields,
  LawsuitOffice,
  lawsuitNumberHints,
  useLawsuitForm,
} from './lawsuit-form'
import {
  existingLawsuit,
  type LawsuitLookup,
  type LawsuitStep,
  type LawsuitValues,
} from './lawsuit-record'

interface LawsuitDialogProps {
  lookup: LawsuitLookup
  onCreate: (values: LawsuitValues) => void
  onCreateCase: (values: LawsuitValues) => void
  onOpenChange: (open: boolean) => void
  onOpenExisting: (number: string) => void
  onSearchByOab: () => void
  open: boolean
}

export function LawsuitDialog({
  lookup,
  onCreate,
  onCreateCase,
  onOpenChange,
  onOpenExisting,
  onSearchByOab,
  open,
}: Readonly<LawsuitDialogProps>) {
  const [step, setStep] = useState<LawsuitStep>('origin')
  const form = useLawsuitForm(lookup)
  const { creating, draft, numberState, setCreating, title, update } = form

  const close = (next: boolean) => {
    onOpenChange(next)
    if (next) return
    setStep('origin')
    form.reset()
  }

  const goTo = (next: LawsuitStep, withLookup: boolean) => {
    form.begin(withLookup)
    setStep(next)
  }

  const detailsHint = creating
    ? undefined
    : title.trim() === ''
      ? 'Dê um título para criar.'
      : form.searching
        ? 'Pode criar agora. O que ainda estiver em busca aparece na página do processo.'
        : undefined

  const back = (
    <Button
      disabled={creating}
      onClick={() => setStep('origin')}
      type="button"
      variant="outline"
    >
      Voltar
    </Button>
  )

  const submitDetails = async () => {
    const values = form.resolved()
    if (values.title.trim() === '') return false
    setCreating(true)
    await sleep(600)
    setCreating(false)
    if (step === 'case') onCreateCase(values)
    else onCreate(values)
    return true
  }

  if (step === 'origin')
    return (
      <RecordDialog
        cancelLabel="Cancelar"
        onOpenChange={close}
        onSubmit={() => {
          if (numberState !== 'free') return false
          goTo('details', true)
          return false
        }}
        open={open}
        size="small"
        step={step}
        submitDisabled={numberState !== 'free'}
        submitHint={lawsuitNumberHints[numberState]}
        submitLabel="Continuar"
        title="Novo processo"
        titleAncestor="Processos"
      >
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel>Número do processo</FieldLabel>
            <Input
              autoComplete="off"
              inputMode="numeric"
              onChange={(event) => update({ number: event.target.value })}
              placeholder="0000000-00.0000.0.00.0000"
              value={draft.number}
            />
            <FieldDescription>
              Buscamos os dados no DJEN, no DataJud e no tribunal.
            </FieldDescription>
          </Field>
          {numberState === 'taken' ? (
            <Alert variant="info">
              <AlertDescription>
                Este número já está no escritório: {existingLawsuit.title}, com{' '}
                {existingLawsuit.owner}.
              </AlertDescription>
              <AlertAction>
                <Button
                  onClick={() => onOpenExisting(draft.number)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Abrir processo
                </Button>
              </AlertAction>
            </Alert>
          ) : null}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-muted-foreground text-sm">
              Outras formas de começar
            </legend>
            {[
              {
                description: 'Importa vários processos de uma vez.',
                onClick: onSearchByOab,
                title: 'Buscar pela OAB',
              },
              {
                description: 'Cria um caso, sem número.',
                onClick: () => goTo('case', false),
                title: 'Ainda não foi distribuído',
              },
              {
                description: 'Sem buscar no tribunal.',
                onClick: () => goTo('details', false),
                title: 'Preencher à mão',
              },
            ].map((option) => (
              <Button
                className="h-auto justify-between py-2 text-start"
                key={option.title}
                onClick={option.onClick}
                type="button"
                variant="outline"
              >
                <span className="flex flex-col">
                  <span>{option.title}</span>
                  <span className="font-normal text-muted-foreground text-xs">
                    {option.description}
                  </span>
                </span>
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            ))}
          </fieldset>
        </div>
      </RecordDialog>
    )

  if (step === 'case')
    return (
      <RecordDialog
        cancelLabel="Cancelar"
        footerStart={back}
        onOpenChange={close}
        onSubmit={submitDetails}
        open={open}
        size="small"
        step={step}
        submitDisabled={draft.title.trim() === ''}
        submitHint={
          draft.title.trim() === '' ? 'Dê um título para criar.' : undefined
        }
        submitLabel="Criar caso"
        submitOnModEnter
        submittingLabel="Criando…"
        title="Novo caso"
        titleAncestor="Casos"
      >
        <div className="flex flex-col gap-4">
          <RecordDialogHeadline
            onTitleChange={(next) => update({ title: next })}
            title={draft.title}
            titleLabel="Título do caso"
            titlePlaceholder="Título do caso"
          />
          <LawsuitOffice form={form} monitor={false} />
        </div>
      </RecordDialog>
    )

  return (
    <RecordDialog
      cancelLabel="Cancelar"
      footerStart={back}
      onOpenChange={close}
      onSubmit={submitDetails}
      open={open}
      step={step}
      submitDisabled={title.trim() === ''}
      submitHint={detailsHint}
      submitLabel="Criar processo"
      submitOnModEnter
      submittingLabel="Criando…"
      title="Novo processo"
      titleAncestor="Processos"
    >
      <div className="flex flex-col gap-5">
        {form.manual ? null : (
          <RecordStatusList label="Fontes consultadas">
            {form.sourceRows.map((row) => (
              <RecordStatusItem
                announcement={row.announcement}
                detail={row.detail}
                key={row.id}
                status={row.status}
                title={row.title}
              />
            ))}
          </RecordStatusList>
        )}
        {form.sources.datajud.status === 'failed' ? (
          <Alert variant="error">
            <AlertDescription>
              DataJud não respondeu. Preencha Ação e Objeto à mão ou busque de
              novo.
            </AlertDescription>
            <AlertAction>
              <Button
                onClick={form.retry}
                size="sm"
                type="button"
                variant="outline"
              >
                Buscar de novo
              </Button>
            </AlertAction>
          </Alert>
        ) : null}
        <RecordDialogHeadline
          onTitleChange={form.setTitle}
          title={title}
          titleLabel="Título do processo"
          titlePlaceholder="Título do processo"
        />
        <LawsuitFields form={form} />
      </div>
    </RecordDialog>
  )
}
