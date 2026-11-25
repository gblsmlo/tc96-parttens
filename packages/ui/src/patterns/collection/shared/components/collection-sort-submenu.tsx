'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type { ReactElement } from 'react'

export interface SortRadioSubmenuProps<TValue extends string = string> {
  icon: PhosphorIcon
  label: string
  onValueChange: (value: TValue) => void
  options: readonly (readonly [TValue, string])[]
  value: TValue
}

/**
 * Submenu de escolha única sempre preenchida, como uma ordenação: ao contrário
 * do `FilterRadioSubmenu`, não há "todos" nem sentinela, porque sempre há uma
 * opção marcada.
 */
export function SortRadioSubmenu<TValue extends string = string>({
  icon: Icon,
  label,
  onValueChange,
  options,
  value,
}: Readonly<SortRadioSubmenuProps<TValue>>): ReactElement {
  return (
    <MenuSub>
      <MenuSubTrigger>
        <Icon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuRadioGroup
          onValueChange={(next) => {
            const option = options.find(([optionValue]) => optionValue === next)
            if (option) onValueChange(option[0])
          }}
          value={value}
        >
          {options.map(([optionValue, optionLabel]) => (
            <MenuRadioItem key={optionValue} value={optionValue}>
              {optionLabel}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}
