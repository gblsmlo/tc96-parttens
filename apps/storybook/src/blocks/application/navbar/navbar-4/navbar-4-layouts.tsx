import { Navbar4 } from '@tc96/blocks/application/navbar/navbar-4'
import { useState } from 'react'
import { fn } from 'storybook/test'
import type { Navbar4Controls } from './navbar-4-controls.ts'

export const navbar4Handlers = {
  onClose: fn(),
  onHistory: fn(),
  onSubmit: fn(),
  onTest: fn(),
}

export const ComposedNavbar4 = ({
  active: initialActive,
  pending,
  savedText,
  showActive,
  showClose,
  showHistory,
  showSubmit,
  showTest,
  submit,
  title,
}: Readonly<Navbar4Controls>) => {
  const [active, setActive] = useState(initialActive)

  return (
    <Navbar4
      active={active}
      labels={{ submit }}
      onActiveChange={showActive ? setActive : undefined}
      onClose={showClose ? navbar4Handlers.onClose : undefined}
      onHistory={showHistory ? navbar4Handlers.onHistory : undefined}
      onSubmit={showSubmit ? navbar4Handlers.onSubmit : undefined}
      onTest={showTest ? navbar4Handlers.onTest : undefined}
      pending={pending}
      savedText={savedText || undefined}
      title={title}
    />
  )
}
