import { useState } from 'react'
import { AccountScatter, formatAccount } from './charts-layouts.tsx'
import type { Account } from './fixtures/accounts'

export interface AccountHealthProps {
  onFocusChange?: (account: Account | null) => void
}

export function AccountHealth({ onFocusChange }: AccountHealthProps) {
  const [focused, setFocused] = useState<Account | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <AccountScatter
        ariaDescription="Each point is one account, sized by seats and colored by segment."
        formatTooltip={formatAccount}
        height={420}
        onFocusChange={(account) => {
          setFocused(account)
          onFocusChange?.(account)
        }}
      />
      <p aria-live="polite" className="text-muted-foreground text-sm">
        {focused ? `Focused: ${focused.name}` : 'No account focused'}
      </p>
    </div>
  )
}
