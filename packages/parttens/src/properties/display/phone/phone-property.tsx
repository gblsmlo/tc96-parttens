'use client'

import { Popover, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { PhoneIcon, XIcon } from 'lucide-react'
import { useEntryListEditor } from '../../hooks/use-entry-list-editor'
import { createEntryParser } from '../../shared/lib/entry-parser'
import { emitChange, isEditable } from '../../shared/lib/property-change'
import { PropertyAddTrigger } from '../../shared/property-add-trigger'
import { PropertyEntryForm } from '../../shared/property-entry-form'
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
import { nationalPhoneLabel } from '../phone-input/phone-number'

const invalidPhoneMessage = 'Informe um telefone válido.'
const duplicatePhoneMessage = 'Este telefone já está na lista.'
const parsePhone = createEntryParser(phoneNumberSchema(), invalidPhoneMessage)

export interface PhonePropertyActionContext {
  added: string | null
  previousValue: readonly string[]
  removed: string | null
}

export interface PhonePropertyProps {
  value: readonly string[]
  action?: (
    value: readonly string[],
    context: PhonePropertyActionContext,
  ) => void
  addLabel?: string
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
  /**
   * Rótulos das entradas do popup, na ordem de precedência — o cadastro que
   * guarda um número principal e um secundário declara os dois aqui. O tamanho
   * da lista é o teto: com todas preenchidas, não há outra a acrescentar.
   */
  entryLabels?: readonly string[]
  inputPlaceholder?: string
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
  addLabel = 'Adicionar telefone',
  ariaLabel = 'Telefones',
  className,
  defaultCountry,
  disabled = false,
  display = 'chips',
  entryLabels = ['Principal', 'Secundário'],
  errorMessage = null,
  inputPlaceholder,
  onValueChange,
  placeholder = 'Sem telefone',
  readOnly = false,
  value,
  variant = 'plain',
}: Readonly<PhonePropertyProps>) {
  const commit = (
    next: readonly string[],
    context: PhonePropertyActionContext,
  ) => emitChange({ action, onValueChange }, next, context)

  const editor = useEntryListEditor({
    duplicateMessage: duplicatePhoneMessage,
    limit: entryLabels.length,
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
              label={nationalPhoneLabel(phone)}
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
      addLabel={addLabel}
      canAddAnother={editor.canAddAnother}
      drafts={editor.drafts}
      entryLabels={entryLabels}
      errorMessage={errorMessage}
      errors={editor.errors}
      onAdd={editor.addDraft}
      onChange={editor.setDraft}
      onRemove={editor.removeDraft}
      onSave={editor.save}
      removeLabel={(entryLabel) => `Remover ${entryLabel} telefone`}
      renderField={(field) => (
        <PhoneInput
          ariaLabel={field.ariaLabel}
          defaultCountry={defaultCountry}
          invalid={field.invalid}
          onKeyDown={field.onKeyDown}
          onValueChange={(next) => field.onChange(next ?? '')}
          placeholder={inputPlaceholder}
          value={field.draft || null}
        />
      )}
    />
  )

  const summary =
    value.length > 1
      ? `${nationalPhoneLabel(value[0])} +${value.length - 1}`
      : value[0]
        ? nationalPhoneLabel(value[0])
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
              <PhoneIcon aria-hidden="true" className="size-3" />
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
          label={nationalPhoneLabel(phone)}
          trailing={
            <button
              aria-label={`Remover telefone ${nationalPhoneLabel(phone)}`}
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
              <XIcon aria-hidden="true" className="size-3" />
            </button>
          }
        />
      ))}

      {addDisabled ? null : (
        <Popover onOpenChange={editor.onOpenChange} open={editor.open}>
          <PopoverTrigger
            render={
              <PropertyAddTrigger
                addLabel={addLabel}
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
