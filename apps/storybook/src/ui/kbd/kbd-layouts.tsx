import { ArrowElbowDownLeftIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Kbd, KbdGroup } from '@tc96/ui/kbd'
import type { KbdControls } from './kbd-controls.ts'

export const ComposedKbd = ({ icon, keys }: Readonly<KbdControls>) => {
  const names = [...new Set(keys.split(' ').filter(Boolean))]
  const items = names.map((name) => <Kbd key={name}>{name}</Kbd>)
  if (icon)
    items.push(
      <Kbd key="enter-icon">
        <ArrowElbowDownLeftIcon aria-label="Enter" role="img" />
      </Kbd>,
    )
  if (items.length > 1) return <KbdGroup>{items}</KbdGroup>
  return items[0] ?? null
}

export const SaveButton = () => (
  <Button aria-keyshortcuts="Meta+Enter Control+Enter" type="button">
    Save
    <Kbd
      aria-hidden="true"
      className="bg-primary-foreground/16 text-primary-foreground"
    >
      ⌘ ↵
    </Kbd>
  </Button>
)
