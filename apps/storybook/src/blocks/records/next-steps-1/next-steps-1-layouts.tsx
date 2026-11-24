import {
  NextSteps1,
  type RecordsStatusRow,
} from '@tc96/blocks/records/next-steps-1'
import { Button } from '@tc96/ui/button'
import type { NextSteps1Controls } from './next-steps-1-controls.ts'

export interface ComposedNextSteps1Props extends NextSteps1Controls {
  onAction?: (id: string) => void
  onDismiss?: () => void
  onTask?: (id: string) => void
}

export function ComposedNextSteps1({
  dismiss,
  onAction,
  onDismiss = () => undefined,
  onTask,
  tasks,
  title,
}: Readonly<ComposedNextSteps1Props>) {
  const rows: RecordsStatusRow[] = [
    {
      detail: 'contatos e endereço aplicados',
      id: 'crm',
      status: 'done',
      title: 'CRM',
    },
    {
      action: (
        <Button
          onClick={() => onAction?.('billing')}
          size="sm"
          variant="outline"
        >
          Tentar de novo
        </Button>
      ),
      detail: 'não respondeu',
      id: 'billing',
      status: 'failed',
      title: 'Faturamento',
    },
  ]

  return (
    <NextSteps1
      labels={{ title }}
      onDismiss={dismiss ? onDismiss : undefined}
      onTask={onTask}
      rows={rows}
      tasks={
        tasks
          ? [
              {
                actionLabel: 'Agendar',
                id: 'meeting',
                title: 'Marcar a reunião de início',
              },
              {
                actionLabel: 'Convidar',
                id: 'invite',
                title: 'Convidar a equipe do cliente',
              },
            ]
          : undefined
      }
    />
  )
}
