import { Button } from '@tc96/ui/button'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import {
  Popover,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { KeyboardIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import { defaultFlowShortcutsLabels } from '../lib/labels'
import { flowShortcutRowClassName } from '../lib/variants'
import type { FlowShortcutsLabels } from '../types'

export interface FlowShortcutsPopoverProps {
  labels?: Partial<FlowShortcutsLabels>
}

export function FlowShortcutsPopover({
  labels: labelsProp,
}: Readonly<FlowShortcutsPopoverProps>): ReactElement {
  const labels = { ...defaultFlowShortcutsLabels, ...labelsProp }
  const shortcuts: readonly (readonly [string, readonly string[]])[] = [
    [labels.select, ['V']],
    [labels.pan, ['H']],
    [labels.zoomIn, ['+']],
    [labels.zoomOut, ['-']],
    [labels.fit, ['Shift', '1']],
    [labels.actualSize, ['Shift', '0']],
    [labels.remove, ['Backspace']],
  ]
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button aria-label={labels.trigger} size="icon" variant="outline" />
        }
      >
        <KeyboardIcon aria-hidden="true" />
      </PopoverTrigger>
      <PopoverPopup align="end">
        <PopoverTitle className="mb-3">{labels.title}</PopoverTitle>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {shortcuts.map(([name, keys]) => (
            <li className={flowShortcutRowClassName} key={name}>
              <span>{name}</span>
              <KbdGroup>
                {keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </KbdGroup>
            </li>
          ))}
        </ul>
      </PopoverPopup>
    </Popover>
  )
}
