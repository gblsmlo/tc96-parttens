'use client'

import { SelectGroup, SelectGroupLabel, SelectItem } from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import {
  type PropertyIcon,
  type PropertyTone,
  propertyToneClassName,
} from '../../shared/property-catalog'
import {
  type PropertySelectDropdownPlacement,
  PropertySelectShell,
  propertySelectItemClassName,
} from '../../shared/property-select-shell'
import type { PropertyVariant } from '../../shared/property-surface'

export interface SelectPropertyOption {
  label: string
  value: string
  icon?: PropertyIcon
  tone?: PropertyTone
}

export interface SelectPropertyGroup {
  label: string
  options: readonly SelectPropertyOption[]
}

export type SelectPropertyDropdownPlacement = PropertySelectDropdownPlacement

export interface SelectPropertyActionContext {
  previousValue: string | null
}

interface SelectPropertyBaseProps {
  /**
   * Nome acessível. Obrigatório: diferente de Status ou Prioridade, esta
   * propriedade não tem domínio próprio de onde derivar um rótulo.
   */
  ariaLabel: string
  /** `null` é ausência de escolha, e a superfície mostra o `placeholder`. */
  value: string | null
  action?: (value: string | null, context: SelectPropertyActionContext) => void
  className?: string
  disabled?: boolean
  dropdownPlacement?: SelectPropertyDropdownPlacement
  /**
   * Rótulo do valor ausente. Nomeia a propriedade — é o que deixa evidente o que
   * a pílula representa quando ninguém escolheu nada ainda.
   */
  placeholder?: string
  /** Rótulo quando o valor atual não está no catálogo recebido. */
  fallback?: string
  /** Oferece a opção de voltar a "sem valor" dentro do dropdown. */
  emptyOptionLabel?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: string | null) => void
}

/**
 * O catálogo chega plano ou repartido em seções nomeadas — nunca das duas
 * formas. `groups` existe para a lista que precisa dizer de onde as opções vêm
 * ("Campanhas", "Modelos"); a opção de valor ausente fica fora das seções,
 * porque não pertence a nenhuma.
 */
export type SelectPropertyItems =
  | { groups?: undefined; options: readonly SelectPropertyOption[] }
  | { groups: readonly SelectPropertyGroup[]; options?: undefined }

export type SelectPropertyProps = SelectPropertyBaseProps & SelectPropertyItems

/**
 * A propriedade de catálogo fechado que o consumer define. `StatusProperty` e
 * `PriorityProperty` trazem o próprio catálogo porque o vocabulário é delas;
 * aqui as opções vêm de fora, para o pattern servir qualquer enumeração de
 * domínio sem carregar o vocabulário dela (Decisão 030).
 */
export function SelectProperty({
  action,
  ariaLabel,
  className,
  disabled = false,
  dropdownPlacement,
  emptyOptionLabel,
  fallback = '—',
  groups,
  onValueChange,
  options,
  placeholder,
  readOnly = false,
  value,
  variant = 'badge',
}: Readonly<SelectPropertyProps>) {
  const catalog = groups ? groups.flatMap((group) => group.options) : options
  const selectedOption =
    value === null ? undefined : catalog.find((o) => o.value === value)
  const canUpdate = Boolean(action ?? onValueChange)
  // Sem valor o rótulo nomeia a propriedade; com valor fora do catálogo, o
  // fallback avisa que há algo que esta lista não sabe representar.
  const currentLabel =
    selectedOption?.label ??
    (value === null ? (placeholder ?? fallback) : fallback)
  // Sem valor, o nome acessível é a própria propriedade: "Tipo: Tipo" não diz
  // nada a quem ouve.
  const accessibleLabel =
    value === null ? ariaLabel : `${ariaLabel}: ${currentLabel}`
  const emptyOption: SelectPropertyOption | null = emptyOptionLabel
    ? { label: emptyOptionLabel, value: '' }
    : null
  const items = emptyOption ? [emptyOption, ...catalog] : catalog

  return (
    <PropertySelectShell
      ariaLabel={accessibleLabel}
      className={className}
      disabled={disabled}
      dropdownPlacement={dropdownPlacement}
      items={items}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      muted={value === null}
      onValueChange={(option) => {
        if (!option) return
        const next = option.value === '' ? null : option.value
        if (next === value) return
        if (action) {
          action(next, { previousValue: value })
          return
        }
        onValueChange?.(next)
      }}
      readOnly={readOnly || !canUpdate}
      variant={variant}
      renderValue={() => (
        <SelectPropertyContent label={currentLabel} option={selectedOption} />
      )}
      value={selectedOption ?? emptyOption}
    >
      {emptyOption ? (
        <SelectItem className={propertySelectItemClassName} value={emptyOption}>
          <SelectPropertyContent label={emptyOption.label} option={undefined} />
        </SelectItem>
      ) : null}
      {groups
        ? groups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              {group.options.map((option) => (
                <SelectItem
                  key={option.value}
                  className={propertySelectItemClassName}
                  value={option}
                >
                  <SelectPropertyContent label={option.label} option={option} />
                </SelectItem>
              ))}
            </SelectGroup>
          ))
        : catalog.map((option) => (
            <SelectItem
              key={option.value}
              className={propertySelectItemClassName}
              value={option}
            >
              <SelectPropertyContent label={option.label} option={option} />
            </SelectItem>
          ))}
    </PropertySelectShell>
  )
}

function SelectPropertyContent({
  label,
  option,
}: Readonly<{ label: string; option?: SelectPropertyOption }>) {
  const Icon = option?.icon

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {Icon ? (
        <Icon
          aria-hidden
          className={cn(
            'size-3',
            option?.tone ? propertyToneClassName[option.tone] : undefined,
          )}
        />
      ) : null}
      <span className="truncate">{label}</span>
    </span>
  )
}
