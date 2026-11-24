import { Card5, type Card5Props } from '@tc96/blocks/application/card/card-5'
import { shortcuts } from '../fixtures/card-5.ts'
import type { Card5Controls } from './card-5-controls.ts'

interface ComposedCard5Props extends Card5Controls {
  onSelect?: Card5Props['onSelect']
}

const ignore = () => undefined

export const ComposedCard5 = ({
  empty,
  onSelect = ignore,
  title,
  withLinks,
}: Readonly<ComposedCard5Props>) => (
  <Card5
    labels={{ title }}
    onSelect={onSelect}
    shortcuts={
      empty
        ? []
        : shortcuts.map((shortcut) =>
            withLinks ? shortcut : { ...shortcut, href: undefined },
          )
    }
  />
)
