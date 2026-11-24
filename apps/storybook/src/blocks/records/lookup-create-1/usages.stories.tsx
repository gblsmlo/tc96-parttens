import type { Meta, StoryObj } from '@storybook/react-vite'
import { LookupCreate1 } from '@tc96/blocks/records/lookup-create-1'
import { useState } from 'react'
import { expect, fn, screen, within } from 'storybook/test'
import {
  LawsuitFields,
  useLawsuitForm,
} from '../../../patterns/records/dialog/lawsuit-form'
import {
  existingLawsuit,
  type LawsuitLookup,
  type LawsuitValues,
} from '../../../patterns/records/dialog/lawsuit-record'
import { sleep } from '../../../test-utils/sleep'

const meta = {
  tags: ['!autodocs'],
  title: 'Blocks/Records/LookupCreate1/Usages',
} satisfies Meta

export default meta

interface LawsuitsArgs {
  lookup: LawsuitLookup
  onAlternative: (id: string) => void
  onCreate: (values: LawsuitValues) => void
}

const lawsuitAlternatives = [
  {
    description: 'Importa vários processos de uma vez.',
    id: 'oab',
    title: 'Buscar pela OAB',
  },
  {
    description: 'Cria um caso, sem número.',
    id: 'case',
    title: 'Ainda não foi distribuído',
  },
  {
    description: 'Sem buscar no tribunal.',
    id: 'manual',
    title: 'Preencher à mão',
  },
]

export const Lawsuits: StoryObj<LawsuitsArgs> = {
  args: { lookup: 'slow', onAlternative: fn(), onCreate: fn() },
  argTypes: {
    lookup: {
      control: 'inline-radio',
      description:
        'How the simulated sources answer: all in time, DataJud still searching, DataJud failing, or a number already registered.',
      options: ['fast', 'slow', 'failing', 'duplicate'],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A lawsuit created from its number, on the [Default](?path=/story/blocks-records-lookupcreate1-layouts--default) layout: the origin asks for the 20 digits, and the details list DJEN, DataJud and the court while the Processo, Partes and Escritório groups stay editable. A value a source brings fills only a field the user did not touch.',
      },
    },
  },
  play: async () => {
    const dialog = within(
      await screen.findByRole('dialog', { name: 'Novo processo' }),
    )
    await expect(
      dialog.getByRole('textbox', { name: 'Número do processo' }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Continuar' }),
    ).toBeDisabled()
  },
  render: function Lawsuits({ lookup, onAlternative, onCreate }) {
    const [open, setOpen] = useState(true)
    const [step, setStep] = useState<'origin' | 'details'>('origin')
    const form = useLawsuitForm(lookup)
    const identifierState =
      form.numberState === 'free' ? 'available' : form.numberState

    return (
      <LookupCreate1
        alternatives={lawsuitAlternatives}
        existing={{
          description: `Este número já está no escritório: ${existingLawsuit.title}, com ${existingLawsuit.owner}.`,
          href: '#/processos/9990010-14',
        }}
        identifier={form.draft.number}
        identifierState={identifierState}
        labels={{
          ancestor: 'Processos',
          createWhileSearching:
            'Pode criar agora. O que ainda estiver em busca aparece na página do processo.',
          identifier: 'Número do processo',
          identifierDescription:
            'Buscamos os dados no DJEN, no DataJud e no tribunal.',
          identifierPlaceholder: '0000000-00.0000.0.00.0000',
          incomplete: 'Digite os 20 dígitos.',
          openExisting: 'Abrir processo',
          sourcesFailed:
            'DataJud não respondeu. Preencha Ação e Objeto à mão ou busque de novo.',
          submit: 'Criar processo',
          title: 'Novo processo',
          titleField: 'Título do processo',
        }}
        onAlternative={(id) => {
          onAlternative(id)
          if (id !== 'manual') return
          form.begin(false)
          setStep('details')
        }}
        onIdentifierChange={(number) => form.update({ number })}
        onOpenChange={(next) => {
          setOpen(next)
          if (next) return
          setStep('origin')
          form.reset()
        }}
        onRetry={form.retry}
        onStepChange={(next) => {
          if (next === 'details') form.begin(true)
          setStep(next)
        }}
        onSubmit={async () => {
          const values = form.resolved()
          form.setCreating(true)
          await sleep(600)
          form.setCreating(false)
          onCreate(values)
          return true
        }}
        onTitleChange={form.setTitle}
        open={open}
        pending={form.creating}
        recordTitle={form.title}
        sources={form.manual ? [] : form.sourceRows}
        step={step}
      >
        <LawsuitFields form={form} />
      </LookupCreate1>
    )
  },
}
