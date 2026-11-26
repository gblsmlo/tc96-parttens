'use client'

import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import {
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
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

function LoadingOptionRows({
  count,
}: Readonly<{ count: number }>): ReactElement[] {
  return skeletonKeys('loading', count).map((key) => (
    <div
      aria-hidden="true"
      className="flex min-h-8 items-center ps-2 pe-2.5 sm:min-h-7"
      key={key}
    >
      <Skeleton className="h-3.5 w-full" />
    </div>
  ))
}

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
 * dentro do `ViewSettings`. O pacote fornece a moldura e a semântica do
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
          {loading ? (
            <LoadingOptionRows count={loadingOptionCount} />
          ) : (
            options.map(([optionValue, optionLabel]) => (
              <MenuRadioItem key={optionValue} value={optionValue}>
                {optionLabel}
              </MenuRadioItem>
            ))
          )}
        </MenuRadioGroup>
      </MenuSubPopup>
    </MenuSub>
  )
}

export type FilterCheckboxOption<TValue extends string = string> = readonly [
  TValue,
  string,
]

export interface FilterCheckboxGroup<TValue extends string = string> {
  label: string
  options: readonly FilterCheckboxOption<TValue>[]
}

export interface FilterCheckboxSubmenuProps<TValue extends string = string> {
  /** Sem ele, o submenu não tem item que limpa a escolha. */
  clearLabel?: string
  icon: PhosphorIcon
  label: string
  loading?: boolean
  loadingOptionCount?: number
  onValueChange: (value: TValue[]) => void
  options: readonly (
    | FilterCheckboxOption<TValue>
    | FilterCheckboxGroup<TValue>
  )[]
  value?: readonly TValue[]
}

/**
 * Submenu de filtro por vários valores, irmão do `FilterRadioSubmenu`: cada
 * opção liga e desliga sem fechar o menu, e opções podem vir sob grupos
 * rotulados. Nenhum valor marcado equivale a "todos".
 */
export function FilterCheckboxSubmenu<TValue extends string = string>({
  clearLabel,
  icon: Icon,
  label,
  loading = false,
  loadingOptionCount = 3,
  onValueChange,
  options,
  value = [],
}: Readonly<FilterCheckboxSubmenuProps<TValue>>): ReactElement {
  const renderOption = ([
    optionValue,
    optionLabel,
  ]: FilterCheckboxOption<TValue>) => (
    <MenuCheckboxItem
      checked={value.includes(optionValue)}
      key={optionValue}
      onCheckedChange={(checked) =>
        onValueChange(
          checked
            ? [...value, optionValue]
            : value.filter((current) => current !== optionValue),
        )
      }
    >
      {optionLabel}
    </MenuCheckboxItem>
  )

  return (
    <MenuSub>
      <MenuSubTrigger>
        <Icon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup aria-busy={loading || undefined}>
        {clearLabel ? (
          <MenuCheckboxItem
            checked={value.length === 0}
            onCheckedChange={() => {
              if (value.length > 0) onValueChange([])
            }}
          >
            {clearLabel}
          </MenuCheckboxItem>
        ) : null}
        {loading ? (
          <LoadingOptionRows count={loadingOptionCount} />
        ) : (
          options.map((option) =>
            'label' in option ? (
              <MenuGroup key={option.label}>
                <MenuGroupLabel>{option.label}</MenuGroupLabel>
                {option.options.map(renderOption)}
              </MenuGroup>
            ) : (
              renderOption(option)
            ),
          )
        )}
      </MenuSubPopup>
    </MenuSub>
  )
}
