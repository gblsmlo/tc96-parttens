const slotClassName =
  'flex h-6 min-w-12 items-center justify-center rounded-sm border border-dashed px-2 text-muted-foreground text-xs'

export const Slot = ({ name }: Readonly<{ name: string }>) => (
  <span className={slotClassName}>{name}</span>
)

export const IconSlot = () => (
  <span
    aria-hidden="true"
    className="block size-4 rounded-sm border border-dashed"
    data-anatomy="leading"
  />
)
