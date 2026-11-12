import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import { CircleAlertIcon } from 'lucide-react'
import {
  type ImportSource,
  importSourceGroups,
  importSourceLabels,
} from './process-record'

const listFormat = new Intl.ListFormat('pt-BR', { type: 'conjunction' })

export function importErrorMessage(failed: readonly ImportSource[]) {
  const single = failed.length === 1
  const sources = listFormat.format(
    failed.map((source) => importSourceLabels[source]),
  )
  const groups = listFormat.format(
    failed.map((source) => importSourceGroups[source]),
  )
  return {
    description: `${groups} ${single ? 'ficou' : 'ficaram'} sem dados importados. Preencha à mão ou tente de novo.`,
    title: `${sources} não ${single ? 'respondeu' : 'responderam'}`,
  }
}

export function ProcessImportError({
  failed,
  onRetry,
}: Readonly<{ failed: readonly ImportSource[]; onRetry: () => void }>) {
  if (failed.length === 0) return null
  const message = importErrorMessage(failed)

  return (
    <Alert variant="error">
      <CircleAlertIcon aria-hidden />
      <AlertTitle>{message.title}</AlertTitle>
      <AlertDescription>{message.description}</AlertDescription>
      <AlertAction>
        <Button onClick={onRetry} size="xs" variant="outline">
          Tentar novamente
        </Button>
      </AlertAction>
    </Alert>
  )
}
