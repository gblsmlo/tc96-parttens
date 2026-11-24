import type { Meta, StoryObj } from '@storybook/react-vite'
import { NextSteps1 } from '@tc96/blocks/records/next-steps-1'
import type { RecordStatus } from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, fn, within } from 'storybook/test'
import { NextSteps1Canvas } from './next-steps-1-canvas.tsx'

const meta = {
  decorators: [NextSteps1Canvas],
  tags: ['!autodocs'],
  title: 'Blocks/Records/NextSteps1/Usages',
} satisfies Meta

export default meta

interface NewLawsuitArgs {
  onApply: (source: string) => void
  onDismiss: () => void
  onTask: (id: string) => void
}

export const NewLawsuit: StoryObj<NewLawsuitArgs> = {
  args: { onApply: fn(), onDismiss: fn(), onTask: fn() },
  parameters: {
    docs: {
      description: {
        story:
          'The page of a lawsuit right after it was created, on the [Default](?path=/story/blocks-records-nextsteps1-layouts--default) layout: DataJud answered after the dialog closed, so its values wait to be applied, the court monitoring failed with a way to try again, and the first tasks of the lawyer follow.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Ação: Procedimento Comum Cível · Objeto: Contratos bancários',
      ),
    ).toBeVisible()
  },
  render: function NewLawsuit({ onApply, onDismiss, onTask }) {
    const [applied, setApplied] = useState(false)
    const [monitor, setMonitor] = useState<RecordStatus>('failed')

    return (
      <NextSteps1
        onDismiss={onDismiss}
        onTask={onTask}
        rows={[
          {
            detail: '3 publicações e 2 partes aplicadas',
            id: 'djen',
            status: 'done',
            title: 'DJEN',
          },
          {
            action: applied ? undefined : (
              <Button
                onClick={() => {
                  onApply('datajud')
                  setApplied(true)
                }}
                size="sm"
                variant="outline"
              >
                Aplicar DataJud
              </Button>
            ),
            announcement: 'DataJud aplicado',
            detail:
              'Ação: Procedimento Comum Cível · Objeto: Contratos bancários',
            id: 'datajud',
            status: applied ? 'done' : 'pending',
            title: 'DataJud',
          },
          {
            action:
              monitor === 'failed' ? (
                <Button
                  onClick={() => {
                    setMonitor('running')
                    setTimeout(() => setMonitor('done'), 1200)
                  }}
                  size="sm"
                  variant="outline"
                >
                  Tentar de novo
                </Button>
              ) : undefined,
            announcement:
              monitor === 'done'
                ? 'Monitoramento ligado'
                : 'Ligando o monitoramento',
            detail: {
              done: 'ligado no TJSP',
              failed: 'não foi ligado',
              pending: '',
              running: 'ligando',
              skipped: '',
            }[monitor],
            id: 'monitor',
            status: monitor,
            title: 'Monitoramento',
          },
        ]}
        tasks={[
          { actionLabel: 'Abrir', id: 'read', title: 'Ler as 3 publicações' },
          {
            actionLabel: 'Novo prazo',
            id: 'deadline',
            title: 'Criar o primeiro prazo',
          },
        ]}
      />
    )
  },
}
