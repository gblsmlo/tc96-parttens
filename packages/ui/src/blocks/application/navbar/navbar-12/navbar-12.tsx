import { ArrowRightIcon, CaretDownIcon, ListIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { renderAnchor } from '@tc96/ui/render-anchor'
import {
  Sheet,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from '@tc96/ui/sheet'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { defaultNavbar12Labels } from './labels'
import { Navbar12Link } from './navbar-12-link'
import type {
  Navbar12Item,
  Navbar12MenuGroup,
  Navbar12MenuItem,
  Navbar12Props,
} from './types'

const isMenu = (item: Navbar12Item): item is Navbar12MenuItem =>
  'groups' in item

const linkClassName =
  'flex items-start gap-3 rounded-lg p-2 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring'

export function Navbar12({
  className,
  cta,
  homeHref = '/',
  items,
  labels: labelsProp,
  logo,
  name,
  openOnHover = false,
  renderLink = renderAnchor,
}: Readonly<Navbar12Props>) {
  const labels = { ...defaultNavbar12Labels, ...labelsProp }
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center gap-6 border-b bg-background px-4 text-foreground',
        className,
      )}
      data-slot="navbar-12"
    >
      <Navbar12Link
        className="flex shrink-0 items-center gap-2 rounded-md font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={homeHref}
        renderLink={renderLink}
      >
        {logo}
        <span>{name}</span>
      </Navbar12Link>
      <nav
        aria-label={labels.navigation}
        className="hidden min-w-0 flex-1 md:block"
      >
        <ul className="flex items-center gap-1">
          {items.map((item) => (
            <li key={item.id}>
              {isMenu(item) ? (
                <Popover
                  onOpenChange={(open) => setOpenMenu(open ? item.id : null)}
                  open={openMenu === item.id}
                >
                  <PopoverTrigger
                    className="group"
                    closeDelay={120}
                    data-menu={item.id}
                    delay={80}
                    openOnHover={openOnHover}
                    render={<Button size="sm" variant="ghost" />}
                  >
                    {item.label}
                    <CaretDownIcon
                      aria-hidden="true"
                      className="transition-transform group-data-popup-open:rotate-180 motion-reduce:transition-none"
                    />
                  </PopoverTrigger>
                  <PopoverPopup
                    align="start"
                    aria-label={item.label}
                    className="max-w-[calc(100vw-2rem)]"
                  >
                    <div
                      className={cn(
                        'grid w-[34rem] max-w-full gap-x-4 gap-y-3',
                        item.groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
                      )}
                    >
                      {item.groups.map((group) => (
                        <MenuGroup
                          group={group}
                          key={group.id}
                          onSelect={() => setOpenMenu(null)}
                          renderLink={renderLink}
                        />
                      ))}
                    </div>
                  </PopoverPopup>
                </Popover>
              ) : (
                <Button
                  render={renderLink(item.href)}
                  size="sm"
                  variant="ghost"
                >
                  {item.label}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="ms-auto flex shrink-0 items-center gap-2">
        {cta ? (
          <Button className="group" render={renderLink(cta.href)} size="sm">
            {cta.label}
            <ArrowRightIcon
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
            />
          </Button>
        ) : null}
        <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
          <SheetTrigger
            render={
              <Button
                aria-label={labels.openMenu}
                className="md:hidden"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <ListIcon aria-hidden="true" />
          </SheetTrigger>
          <SheetPopup
            closeProps={{ 'aria-label': labels.closeMenu }}
            side="right"
          >
            <SheetHeader>
              <SheetTitle>{labels.menuTitle}</SheetTitle>
            </SheetHeader>
            <SheetPanel>
              <nav aria-label={labels.navigation} className="grid gap-5">
                {items.map((item) =>
                  isMenu(item) ? (
                    <section className="grid gap-2" key={item.id}>
                      <p className="font-semibold text-sm">{item.label}</p>
                      {item.groups.map((group) => (
                        <MenuGroup
                          group={group}
                          key={group.id}
                          onSelect={closeMobile}
                          renderLink={renderLink}
                        />
                      ))}
                    </section>
                  ) : (
                    <Navbar12Link
                      className="rounded-md font-semibold text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href={item.href}
                      key={item.id}
                      onSelect={closeMobile}
                      renderLink={renderLink}
                    >
                      {item.label}
                    </Navbar12Link>
                  ),
                )}
              </nav>
            </SheetPanel>
          </SheetPopup>
        </Sheet>
      </div>
    </header>
  )
}

function MenuGroup({
  group,
  onSelect,
  renderLink,
}: Readonly<{
  group: Navbar12MenuGroup
  onSelect: () => void
  renderLink: NonNullable<Navbar12Props['renderLink']>
}>) {
  return (
    <div className="grid content-start gap-1" data-group={group.id}>
      {group.label ? (
        <p className="px-2 font-medium text-muted-foreground text-xs">
          {group.label}
        </p>
      ) : null}
      <ul className="grid gap-1">
        {group.links.map((link) => (
          <li key={link.id}>
            <Navbar12Link
              className={linkClassName}
              href={link.href}
              onSelect={onSelect}
              renderLink={renderLink}
            >
              {link.icon ? (
                <IconFrame shape="rounded" size="sm">
                  {link.icon}
                </IconFrame>
              ) : null}
              <span className="grid gap-0.5">
                <span className="font-medium text-sm">{link.label}</span>
                {link.description ? (
                  <span className="text-muted-foreground text-xs">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </Navbar12Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
