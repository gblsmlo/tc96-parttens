'use client'

import { XIcon } from '@phosphor-icons/react'
import { Popover, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { useEntryListEditor } from '../../hooks/use-entry-list-editor'
import { createEntryParser } from '../../shared/lib/entry-parser'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { PropertyAddTrigger } from '../../shared/property-add-trigger'
import type { PropertyListChangeContext } from '../../shared/property-catalog'
import { propertyDisplayIcons } from '../../shared/property-display-meta'
import { PropertyEntryForm } from '../../shared/property-entry-form'
import {
  defaultPropertyAriaLabels,
  defaultPropertyLabels,
  defaultPropertyPlaceholders,
  type PhonePropertyLabels,
  resolvePropertyLabels,
} from '../../shared/property-labels'
import { PropertyRow } from '../../shared/property-row'
import {
  PropertySurface,
  type PropertyVariant,
} from '../../shared/property-surface'
import { IconLabelProperty } from '../icon-label/icon-label-property'
import {
  type PhoneCountryCode,
  PhoneInput,
  phoneNumberSchema,
} from '../phone-input/index'
import { internationalPhoneLabel } from '../phone-input/phone-number'

const PhoneIcon = propertyDisplayIcons.phone

type PhoneChangeContext = PropertyListChangeContext<string, string>

export interface PhonePropertyProps {
  value: readonly string[]
  action?: (value: readonly string[], context: PhoneChangeContext) => void
  ariaLabel?: string
  className?: string
  /** País assumido para o número digitado em formato nacional. */
  defaultCountry?: PhoneCountryCode
  /**
   * Recusa do **consumidor** — duplicata no workspace, unicidade, papel. Formato
   * não passa por aqui: o campo carrega a biblioteca que formata e sabe validar.
   */
  errorMessage?: string | null
  disabled?: boolean
  /**
   * `chips` mostra um chip por valor e colapsa o gatilho no `+`; `trigger`
   * mantém um gatilho único que segue nomeando a propriedade mesmo preenchida.
   * Lado a lado com outra fileira, dois `+` iguais não dizem a qual pertencem —
   * é o caso que `trigger` resolve, e a edição inteira vive no popup.
   */
  display?: 'chips' | 'trigger'
  /**
   * Fecha o caminho de adição sem tornar a fileira somente leitura: os números
   * já existentes continuam removíveis. Serve ao contrato que guarda um número
   * só — com um preenchido, não há segundo a adicionar.
   */
  addDisabled?: boolean
  labels?: Partial<PhonePropertyLabels>
  placeholder?: string
  readOnly?: boolean
  variant?: PropertyVariant
  onValueChange?: (value: readonly string[]) => void
}

/**
 * Telefones como fileira de chips, no mesmo gatilho de `TagsProperty`: vazia, o
 * gatilho se explica ("Adicionar telefone"); com números na fileira o contexto
 * já está dado e sobra o `+`, sem repetir a palavra ao lado de cada um.
 *
 * A diferença para Tags é a origem do valor: tag vem de catálogo fechado e o
 * popup é uma lista; telefone é digitado, e o popup é um campo. O componente não
 * valida formato — quem consome conhece o contrato do próprio domínio e devolve
 * a recusa por `errorMessage`.
 */
export function PhoneProperty({
  action,
  addDisabled = false,
  ariaLabel = defaultPropertyAriaLabels.phone,
  className,
  defaultCountry,
  disabled = false,
  display = 'chips',
  errorMessage = null,
  labels: labelOverrides,
  onValueChange,
  placeholder = defaultPropertyPlaceholders.phone,
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<PhonePropertyProps>) {
  const labels = resolvePropertyLabels(
    defaultPropertyLabels.phone,
    labelOverrides,
  )
  const parsePhone = createEntryParser(
    phoneNumberSchema({
      invalidMessage: labels.invalid,
      requiredMessage: labels.required,
    }),
    labels.invalid,
  )

  const commit = (next: readonly string[], context: PhoneChangeContext) =>
    emitChange({ action, onValueChange }, next, context)

  const editor = useEntryListEditor({
    duplicateMessage: labels.duplicate,
    limit: labels.entries.length,
    onCommit: commit,
    parse: parsePhone,
    value,
  })

  if (!isEditable({ action, onValueChange, readOnly })) {
    return (
      <PropertyRow
        ariaLabel={ariaLabel}
        className={cn('flex flex-wrap gap-3', className)}
        slot="phone-property"
        variant={variant}
      >
        {value.length > 0 ? (
          value.map((phone) => (
            <IconLabelProperty
              icon={PhoneIcon}
              key={phone}
              label={internationalPhoneLabel(phone)}
              variant={variant}
            />
          ))
        ) : (
          <PropertySurface muted variant={variant}>
            {placeholder}
          </PropertySurface>
        )}
      </PropertyRow>
    )
  }

  const entryForm = (
    <PropertyEntryForm
      canAddAnother={editor.canAddAnother}
      drafts={editor.drafts}
      errorMessage={errorMessage}
      errors={editor.errors}
      labels={labels}
      onAdd={editor.addDraft}
      onChange={editor.setDraft}
      onRemove={editor.removeDraft}
      onSave={editor.save}
      renderField={(field) => (
        <PhoneInput
          ariaLabel={field.ariaLabel}
          defaultCountry={defaultCountry}
          invalid={field.invalid}
          labels={labels}
          onKeyDown={field.onKeyDown}
          onValueChange={(next) => field.onChange(next ?? '')}
          placeholder={labels.inputPlaceholder}
          value={field.draft || null}
        />
      )}
    />
  )

  const summary =
    value.length > 1
      ? `${internationalPhoneLabel(value[0])} +${value.length - 1}`
      : value[0]
        ? internationalPhoneLabel(value[0])
        : placeholder

  if (display === 'trigger') {
    return (
      <Popover onOpenChange={editor.onOpenChange} open={editor.open}>
        <PopoverTrigger
          render={
            <PropertySurface
              aria-label={
                value.length > 0 ? `${ariaLabel}: ${summary}` : ariaLabel
              }
              className={cn('max-w-full', className)}
              muted={value.length === 0}
              render={<button disabled={disabled} type="button" />}
              variant={variant === 'plain' ? 'plain' : 'badge'}
            >
              <PhoneIcon
                aria-hidden="true"
                className="size-4"
                data-slot="property-icon"
              />
              <span className="truncate">{summary}</span>
            </PropertySurface>
          }
        />
        {entryForm}
      </Popover>
    )
  }

  return (
    <PropertyRow
      ariaLabel={ariaLabel}
      className={cn('flex flex-wrap items-center gap-1', className)}
      slot="phone-property"
      variant={variant}
    >
      {value.map((phone) => (
        <IconLabelProperty
          className="pe-0"
          icon={PhoneIcon}
          key={phone}
          label={internationalPhoneLabel(phone)}
          trailing={
            <button
              aria-label={`${labels.remove} ${internationalPhoneLabel(phone)}`}
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              disabled={disabled}
              onClick={() =>
                commit(
                  value.filter((current) => current !== phone),
                  { added: null, previousValue: value, removed: phone },
                )
              }
              type="button"
            >
              <XIcon aria-hidden="true" className="size-4" />
            </button>
          }
        />
      ))}

      {addDisabled ? null : (
        <Popover onOpenChange={editor.onOpenChange} open={editor.open}>
          <PopoverTrigger
            render={
              <PropertyAddTrigger
                addLabel={labels.add}
                disabled={disabled}
                hasValue={value.length > 0}
                icon={PhoneIcon}
                placeholder={placeholder}
              />
            }
          />
          {entryForm}
        </Popover>
      )}
    </PropertyRow>
  )
}
