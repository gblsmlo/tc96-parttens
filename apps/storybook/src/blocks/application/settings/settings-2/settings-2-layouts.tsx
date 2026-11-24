import {
  Settings2,
  type Settings2Props,
} from '@tc96/blocks/application/settings/settings-2'
import { settings2Options, settings2Values } from '../fixtures/settings-2.ts'
import type { Settings2Controls } from './settings-2-controls.ts'

interface ComposedSettings2Props extends Settings2Controls {
  onValueChange?: Settings2Props['onValueChange']
}

export const ComposedSettings2 = ({
  interfaceTitle,
  onValueChange,
  themeDescription,
  themeValue,
  underlineLinks,
}: Readonly<ComposedSettings2Props>) => (
  <Settings2
    labels={{ interfaceTitle, themeDescription }}
    onValueChange={onValueChange}
    options={settings2Options}
    values={{ ...settings2Values, theme: themeValue, underlineLinks }}
  />
)
