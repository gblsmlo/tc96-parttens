import {
  GearIcon,
  HexagonIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { Navbar8 } from '@tc96/ui/blocks/application/navbar/navbar-8'
import { IconFrame } from '@tc96/ui/icon-frame'
import { MenuItem } from '@tc96/ui/menu'
import { useEffect, useState } from 'react'
import { fn } from 'storybook/test'
import { categories, notifications, user } from '../fixtures/navbar-8.ts'
import type { Navbar8Controls } from './navbar-8-controls.ts'

export const navbar8Handlers = {
  onCategoryChange: fn(),
  onDeploy: fn(),
  onMenuItem: fn(),
  onNotificationSelect: fn(),
}

export const BrandMark = () => (
  <IconFrame shape="rounded" size="sm" variant="color">
    <HexagonIcon weight="fill" />
  </IconFrame>
)

export const UserMenuItems = ({
  onSelect = navbar8Handlers.onMenuItem,
}: Readonly<{ onSelect?: (id: string) => void }>) => (
  <>
    <MenuItem onClick={() => onSelect('profile')}>
      <UserIcon />
      Meu perfil
    </MenuItem>
    <MenuItem onClick={() => onSelect('settings')}>
      <GearIcon />
      Configurações
    </MenuItem>
    <MenuItem onClick={() => onSelect('sign-out')} variant="destructive">
      <SignOutIcon />
      Sair
    </MenuItem>
  </>
)

export const ComposedNavbar8 = ({
  category,
  pending,
  showCategories,
  showDeploy,
  showHomeLink,
  showMenu,
  showNotifications,
  showUser,
  unreadCount,
}: Readonly<Navbar8Controls>) => {
  const [selected, setSelected] = useState(category)

  useEffect(() => {
    setSelected(category)
  }, [category])

  return (
    <Navbar8
      categories={showCategories ? categories : undefined}
      category={selected}
      homeHref={showHomeLink ? '/agentes' : undefined}
      logo={<BrandMark />}
      menu={showMenu ? <UserMenuItems /> : undefined}
      name="Orbit Agentes"
      notifications={
        showNotifications
          ? notifications.map((item, index) => ({
              ...item,
              read: index >= unreadCount,
            }))
          : undefined
      }
      onCategoryChange={(id) => {
        setSelected(id)
        navbar8Handlers.onCategoryChange(id)
      }}
      onDeploy={showDeploy ? navbar8Handlers.onDeploy : undefined}
      onNotificationSelect={navbar8Handlers.onNotificationSelect}
      pending={pending}
      user={showUser ? user : undefined}
    />
  )
}
