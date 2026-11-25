import { HexagonIcon } from '@phosphor-icons/react'
import { Navbar10 } from '@tc96/ui/blocks/application/navbar/navbar-10'
import { MenuItem } from '@tc96/ui/menu'
import { useEffect, useState } from 'react'
import { fn } from 'storybook/test'
import { menuActions, services, user } from '../fixtures/navbar-10.ts'
import type { Navbar10Controls } from './navbar-10-controls.ts'

export const navbar10Handlers = {
  onMenuAction: fn(),
  onMethodChange: fn(),
  onPathChange: fn(),
  onSend: fn(),
  onServiceChange: fn(),
}

export const Logo = () => (
  <HexagonIcon
    aria-hidden="true"
    className="size-5 text-primary"
    weight="fill"
  />
)

export const AccountMenu = ({
  onAction,
}: Readonly<{ onAction: (id: string) => void }>) => (
  <>
    {menuActions.map((action) => (
      <MenuItem
        key={action.id}
        onClick={() => onAction(action.id)}
        variant={action.destructive ? 'destructive' : undefined}
      >
        {action.label}
      </MenuItem>
    ))}
  </>
)

export const ComposedNavbar10 = ({
  method: methodArg,
  path: pathArg,
  sending,
  service: serviceArg,
  showLogo,
  showMenu,
  showRequest,
  showServices,
  showUser,
}: Readonly<Navbar10Controls>) => {
  const [method, setMethod] = useState(methodArg)
  const [path, setPath] = useState(pathArg)
  const [service, setService] = useState(serviceArg)

  useEffect(() => setMethod(methodArg), [methodArg])
  useEffect(() => setPath(pathArg), [pathArg])
  useEffect(() => setService(serviceArg), [serviceArg])

  return (
    <Navbar10
      logo={showLogo ? <Logo /> : undefined}
      menu={
        showMenu ? (
          <AccountMenu onAction={navbar10Handlers.onMenuAction} />
        ) : undefined
      }
      method={method}
      name="Portal Dev"
      onMethodChange={(next) => {
        setMethod(next)
        navbar10Handlers.onMethodChange(next)
      }}
      onPathChange={(next) => {
        setPath(next)
        navbar10Handlers.onPathChange(next)
      }}
      onSend={showRequest ? navbar10Handlers.onSend : undefined}
      onServiceChange={
        showServices
          ? (next) => {
              setService(next)
              navbar10Handlers.onServiceChange(next)
            }
          : undefined
      }
      path={path}
      sending={sending}
      service={service}
      services={showServices ? services : undefined}
      user={showUser ? user : undefined}
    />
  )
}
