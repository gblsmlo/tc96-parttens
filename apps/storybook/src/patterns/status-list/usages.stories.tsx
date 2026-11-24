import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupItem,
  type RecordStatus,
  RecordStatusItem,
  RecordStatusList,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { useEffect, useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/StatusList/Usages',
} satisfies Meta

export default meta

interface NextStepsArgs {
  onApply: (source: string) => void
  onOpen: (task: string) => void
  onRetry: (task: string) => void
}

const tasks = [
  { action: 'Abrir', id: 'read', title: 'Ler as 3 publicações' },
  { action: 'Novo prazo', id: 'deadline', title: 'Criar o primeiro prazo' },
] as const

export const NextSteps: StoryObj<NextStepsArgs> = {
  args: { onApply: fn(), onOpen: fn(), onRetry: fn() },
  parameters: {
    docs: {
      description: {
        story:
          'The section of a lawsuit page right after it was created: what the system is still doing, the values a late source brought, shown before they are applied, the step that failed with a way to try again, and the first tasks of the user as `RecordGroupItem`s.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list', { name: 'Andamento do cadastro' })
    await expect(
      within(list).getByText(
        'Ação: Procedimento Comum Cível · Objeto: Contratos bancários',
      ),
    ).toBeVisible()
    await userEvent.click(
      within(list).getByRole('button', { name: 'Aplicar DataJud' }),
    )
    await expect(args.onApply).toHaveBeenCalledWith('datajud')
    await waitFor(() =>
      expect(
        canvasElement.querySelector(
          '[data-slot="record-status-list-announcer"]',
        ),
      ).toHaveTextContent('DataJud aplicado'),
    )
  },
  render: function NextSteps({ onApply, onOpen, onRetry }) {
    const [applied, setApplied] = useState(false)
    const [monitor, setMonitor] = useState<RecordStatus>('failed')

    return (
      <div className="flex w-[34rem] max-w-full flex-col gap-4">
        <RecordGroup collapsible={false} title="Próximos passos" variant="card">
          <div className="flex flex-col gap-3">
            <RecordStatusList label="Andamento do cadastro">
              <RecordStatusItem
                detail="3 publicações e 2 partes aplicadas"
                status="done"
                title="DJEN"
              />
              <RecordStatusItem
                action={
                  applied ? undefined : (
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
                  )
                }
                announcement="DataJud aplicado"
                detail="Ação: Procedimento Comum Cível · Objeto: Contratos bancários"
                status={applied ? 'done' : 'pending'}
                title="DataJud"
              />
              <RecordStatusItem
                action={
                  monitor === 'failed' ? (
                    <Button
                      onClick={() => {
                        onRetry('monitor')
                        setMonitor('running')
                        setTimeout(() => setMonitor('done'), 1200)
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Tentar de novo
                    </Button>
                  ) : undefined
                }
                announcement={
                  monitor === 'done'
                    ? 'Monitoramento ligado'
                    : 'Ligando o monitoramento'
                }
                detail={
                  monitor === 'failed'
                    ? 'não foi ligado'
                    : monitor === 'running'
                      ? 'ligando'
                      : 'ligado no TJSP'
                }
                status={monitor}
                title="Monitoramento"
              />
            </RecordStatusList>
            <div>
              {tasks.map((task) => (
                <RecordGroupItem key={task.id} title={task.title}>
                  <Button
                    onClick={() => onOpen(task.id)}
                    size="sm"
                    variant="outline"
                  >
                    {task.action}
                  </Button>
                </RecordGroupItem>
              ))}
            </div>
          </div>
        </RecordGroup>
      </div>
    )
  },
}

const importRows = [
  { id: '9990011-96.2025.8.26.9999', result: 'done' },
  { id: '9990012-81.2025.8.26.9999', result: 'done' },
  { id: '9990013-66.2025.8.26.9999', result: 'failed' },
] as const

interface ImportArgs {
  onOpen: (number: string) => void
  onRetry: (number: string) => void
}

export const ImportProgress: StoryObj<ImportArgs> = {
  args: { onOpen: fn(), onRetry: fn() },
  parameters: {
    docs: {
      description: {
        story:
          'The progress of a batch of lawsuits imported from an OAB search: one item per number, imported one after the other. A failed row does not stop the next ones and keeps its own retry; an imported row links to the new record.',
      },
    },
  },
  play: async ({ args, canvasElement }) => {
    const list = within(canvasElement).getByRole('list', {
      name: 'Importação dos processos',
    })
    const failed = await within(list).findByRole('button', {
      name: 'Tentar de novo',
    })
    await expect(list.querySelectorAll('[data-status="done"]')).toHaveLength(2)
    await userEvent.click(failed)
    await expect(args.onRetry).toHaveBeenCalledWith(importRows[2].id)
  },
  render: function ImportProgress({ onOpen, onRetry }) {
    const [settled, setSettled] = useState(0)
    const [retried, setRetried] = useState(false)

    useEffect(() => {
      if (settled >= importRows.length) return
      const timer = setTimeout(() => setSettled((count) => count + 1), 300)
      return () => clearTimeout(timer)
    }, [settled])

    const statusOf = (index: number): RecordStatus => {
      if (index > settled) return 'pending'
      if (index === settled) return 'running'
      const result = importRows[index]?.result ?? 'done'
      return result === 'failed' && retried ? 'running' : result
    }

    return (
      <div className="w-[34rem] max-w-full">
        <RecordStatusList label="Importação dos processos">
          {importRows.map((row, index) => {
            const status = statusOf(index)
            return (
              <RecordStatusItem
                action={
                  status === 'done' ? (
                    <Button
                      onClick={() => onOpen(row.id)}
                      size="sm"
                      variant="outline"
                    >
                      Abrir
                    </Button>
                  ) : status === 'failed' ? (
                    <Button
                      onClick={() => {
                        onRetry(row.id)
                        setRetried(true)
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Tentar de novo
                    </Button>
                  ) : undefined
                }
                announcement={
                  status === 'failed'
                    ? `${row.id}: DJEN não respondeu`
                    : `${row.id} importado`
                }
                detail={
                  {
                    done: 'importado',
                    failed: 'DJEN não respondeu',
                    pending: 'na fila',
                    running: 'importando',
                    skipped: 'já no escritório',
                  }[status]
                }
                key={row.id}
                status={status}
                title={<span className="tabular-nums">{row.id}</span>}
              />
            )
          })}
        </RecordStatusList>
      </div>
    )
  },
}
