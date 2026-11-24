'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { Skeleton } from '@tc96/ui/skeleton'
import type { ReactElement } from 'react'
import { skeletonKeys } from '../lib/skeleton-keys'

/**
 * `MenuRadioGroup` não representa ausência de escolha: `value=''` deixa o grupo
 * sem item marcado, e a opção "todos" fica indistinguível de nenhuma opção. O
 * sentinela ocupa esse lugar na UI e é traduzido de volta para `''` na borda.
 */
const CLEAR_VALUE = '__all__'

export interface FilterRadioSubmenuProps {
  clearLabel?: string
  icon: PhosphorIcon
  label: string
  loading?: boolean
  loadingOptionCount?: number
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
  loading = false,
  loadingOptionCount = 3,
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
      <MenuSubPopup aria-busy={loading || undefined}>
        <MenuRadioGroup
          onValueChange={(next) =>
            onValueChange(next === CLEAR_VALUE ? '' : next)
          }
          value={value || CLEAR_VALUE}
        >
          <MenuRadioItem value={CLEAR_VALUE}>{clearLabel}</MenuRadioItem>
          {loading
            ? skeletonKeys('loading', loadingOptionCount).map((key) => (
                <div
                  aria-hidden="true"
                  className="flex min-h-8 items-center ps-2 pe-2.5 sm:min-h-7"
                  key={key}
                >
                  <Skeleton className="h-3.5 w-full" />
                </div>
              ))
            : options.map(([optionValue, optionLabel]) => (
                <MenuRadioItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </MenuRadioItem>
              ))}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}
