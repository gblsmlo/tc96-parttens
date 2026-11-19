import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { ReactNode } from 'react'

export function MenuFrame({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Menu defaultOpen modal={false}>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuPopup align="start">{children}</MenuPopup>
    </Menu>
  )
}

export function OpenMenuCanvas(Story: () => ReactNode) {
  return (
    <div className="flex min-h-64 items-start justify-center pt-4">
      <Story />
    </div>
  )
}
