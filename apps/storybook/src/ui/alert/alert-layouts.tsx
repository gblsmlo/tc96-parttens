import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@tc96/ui/alert'
import { Button } from '@tc96/ui/button'
import type { AlertControls } from './alert-controls.ts'
import { type AlertVariantName, alertStatusIcons } from './alert-variants.ts'

interface StatusIconProps {
  variant?: AlertVariantName | null
}

interface ActionLayoutProps {
  onConfirm?: () => void
  onDismiss?: () => void
}

export const StatusIcon = ({ variant }: Readonly<StatusIconProps>) => {
  const { icon: Icon, label } = alertStatusIcons[variant ?? 'default']
  return <Icon aria-label={label} role="img" />
}

export const ComposedAlert = ({
  action,
  description,
  icon,
  title,
  variant,
}: Readonly<AlertControls>) => (
  <Alert variant={variant}>
    {icon ? <StatusIcon variant={variant} /> : null}
    {title ? <AlertTitle>{title}</AlertTitle> : null}
    {description ? <AlertDescription>{description}</AlertDescription> : null}
    {action ? (
      <AlertAction>
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm">Ok</Button>
      </AlertAction>
    ) : null}
  </Alert>
)

export const TitleOnlyAlert = () => (
  <Alert>
    <StatusIcon />
    <AlertTitle>Heads up!</AlertTitle>
  </Alert>
)

export const WithoutIconAlert = () => (
  <Alert>
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      Describe what can be done about it here.
    </AlertDescription>
  </Alert>
)

export const ActionAlert = ({
  onConfirm,
  onDismiss,
}: Readonly<ActionLayoutProps>) => (
  <Alert>
    <StatusIcon />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      Describe what can be done about it here.
    </AlertDescription>
    <AlertAction>
      <Button onClick={onDismiss} size="sm" variant="ghost">
        Dismiss
      </Button>
      <Button onClick={onConfirm} size="sm">
        Ok
      </Button>
    </AlertAction>
  </Alert>
)

export const ParagraphsAlert = () => (
  <Alert>
    <StatusIcon />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      <p>Describe what happened here.</p>
      <p>Describe what can be done about it here.</p>
    </AlertDescription>
  </Alert>
)
