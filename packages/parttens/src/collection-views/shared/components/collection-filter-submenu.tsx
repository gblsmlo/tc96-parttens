'use client'

import {
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

/**
 * `MenuRadioGroup` não representa ausência de escolha: `value=''` deixa o grupo
 * sem item marcado, e a opção "todos" fica indistinguível de nenhuma opção. O
 * sentinela ocupa esse lugar na UI e é traduzido de volta para `''` na borda.
 */
const CLEAR_VALUE = '__all__'

export interface FilterRadioSubmenuProps {
  clearLabel?: string
  icon: LucideIcon
  label: string
  /** Recebe `''` quando a opção "todos" é escolhida. */
  onValueChange: (value: string) => void
  options: readonly (readonly [string, string])[]
  value?: string
}

/**
 * Submenu de filtro por valor único — a forma que Tasks e Contatos repetem
 * dentro do `ViewSettingsMenu`. O pacote fornece a moldura e a semântica do
 * "todos"; quais opções existem e o que cada uma significa é da vitrine.
 */
export function FilterRadioSubmenu({
  clearLabel = 'Todos',
  icon: Icon,
  label,
  onValueChange,
  options,
  value,
}: Readonly<FilterRadioSubmenuProps>): ReactElement {
  return (
    <MenuSub>
      <MenuSubTrigger>
        <Icon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        <MenuRadioGroup
          onValueChange={(next) =>
            onValueChange(next === CLEAR_VALUE ? '' : next)
          }
          value={value || CLEAR_VALUE}
        >
          <MenuRadioItem value={CLEAR_VALUE}>{clearLabel}</MenuRadioItem>
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
