import {
  Settings3,
  type Settings3Props,
} from '@tc96/blocks/application/settings/settings-3'
import { settings3Data } from '../fixtures/settings-3.ts'
import type { Settings3Controls } from './settings-3-controls.ts'

interface ComposedSettings3Props extends Settings3Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onValueChange?: Settings3Props['onValueChange']
}

const ignore = () => undefined

export const ComposedSettings3 = ({
  error,
  onRetry,
  pending,
  emailNotifications,
  emailNotificationsLabel,
  fontSize,
  fontSizeLabel,
  language,
  languageLabel,
  onValueChange = ignore,
  title,
  withValueChange,
}: Readonly<ComposedSettings3Props>) => (
  <Settings3
    error={error}
    onRetry={onRetry}
    pending={pending}
    labels={{
      emailNotifications: emailNotificationsLabel,
      fontSize: fontSizeLabel,
      language: languageLabel,
      title,
    }}
    onValueChange={withValueChange ? onValueChange : undefined}
    options={settings3Data.options}
    values={{ emailNotifications, fontSize, language }}
  />
)
