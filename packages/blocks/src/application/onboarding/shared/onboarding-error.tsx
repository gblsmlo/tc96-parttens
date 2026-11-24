import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'

interface OnboardingErrorProps {
  error?: string
  title: string
}

export function OnboardingError({
  error,
  title,
}: Readonly<OnboardingErrorProps>) {
  if (!error) return null

  return (
    <Alert variant="error">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
