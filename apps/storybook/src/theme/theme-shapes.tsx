import type { ReactNode } from 'react'

export function resolvedStyle(
  context: Element,
  property: string,
  value: string,
): string {
  const probe = document.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.setProperty(property, value)
  context.append(probe)
  const resolved = getComputedStyle(probe).getPropertyValue(property)
  probe.remove()
  return resolved
}

export function ShapeGrid({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="grid w-full max-w-3xl grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-6 p-6">
      {children}
    </div>
  )
}

export function Shape({
  className,
  label,
  token,
}: Readonly<{ className: string; label: string; token: string }>) {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div
        className={`flex h-24 items-center justify-center ${className}`}
        data-slot="theme-shape"
        data-token={token}
      >
        <span className="text-sm">{label}</span>
      </div>
      <figcaption className="font-mono text-muted-foreground text-xs">
        --{token}
      </figcaption>
    </figure>
  )
}

export function Swatch({ token }: Readonly<{ token: string }>) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="size-10 shrink-0 rounded-md border"
        data-slot="theme-swatch"
        data-token={token}
        style={{ background: `var(--${token})` }}
      />
      <code className="text-foreground text-sm">--{token}</code>
    </li>
  )
}
