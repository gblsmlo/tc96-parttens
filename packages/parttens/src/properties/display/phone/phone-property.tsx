'use client'

import { Button } from '@tc96/ui/button'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { cn } from '@tc96/utils'
import { PhoneIcon, PlusIcon, XIcon } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
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

const phoneSchema = phoneNumberSchema()

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
  const [open, setOpen] = useState(false)
  // O popup edita a lista inteira, não um número por vez: quem guarda principal
  // e secundário precisa ver os dois juntos para decidir qual é qual.
  const [drafts, setDrafts] = useState<readonly (string | null)[]>([])
  const [errors, setErrors] = useState<readonly (string | null)[]>([])
  const canUpdate = Boolean(action ?? onValueChange)

  useEffect(() => {
    if (!open) return
    setDrafts(value.length > 0 ? [...value] : [null])
    setErrors([])
  }, [open, value])

  const commit = (
    next: readonly string[],
    context: PhonePropertyActionContext,
  ) => {
    if (action) {
      action(next, context)
      return
    }
    onValueChange?.(next)
  }

  /**
   * Formato é do campo, não do consumidor: a mesma biblioteca que formata
   * enquanto se digita sabe dizer se o número está completo, e recusar aqui
   * evita mandar ao servidor o que já se sabe inválido.
   */
  const save = () => {
    const nextErrors: (string | null)[] = []
    const saved: string[] = []

    for (const draft of drafts) {
      const raw = draft?.trim() ?? ''
      if (!raw) {
        // Linha em branco é linha não preenchida, não erro: guardar só o que tem.
        nextErrors.push(null)
        continue
      }

      const parsed = phoneSchema.safeParse(raw)
      if (!parsed.success) {
        nextErrors.push(
          parsed.error.issues[0]?.message ?? 'Informe um telefone válido.',
        )
        continue
      }
      // Repetido não vira chip duplicado: a fileira representa números distintos.
      if (saved.includes(parsed.data)) {
        nextErrors.push('Este telefone já está na lista.')
        continue
      }

      nextErrors.push(null)
      saved.push(parsed.data)
    }

    setErrors(nextErrors)
    if (nextErrors.some(Boolean)) return

    const added = saved.find((phone) => !value.includes(phone)) ?? null
    const removed = value.find((phone) => !saved.includes(phone)) ?? null
    commit(saved, { added, previousValue: value, removed })
    setOpen(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    save()
  }

  /**
   * Acrescentar só faz sentido depois que o anterior está completo: uma linha em
   * branco sobre outra em branco não é entrada, é ruído — e o número incompleto
   * ainda vai mudar.
   */
  const canAddAnother =
    drafts.length < entryLabels.length &&
    drafts.every((draft) => phoneSchema.safeParse(draft?.trim() ?? '').success)

  if (readOnly || !canUpdate) {
    return (
      <fieldset
        aria-label={ariaLabel}
        className={cn(
          'm-0 flex min-w-0 flex-wrap gap-1 border-0 p-0',
          className,
        )}
        data-slot="phone-property"
        data-variant={variant}
      >
        {value.length > 0 ? (
          value.map((phone) => (
            <IconLabelProperty
              icon={PhoneIcon}
              key={phone}
              label={phone}
              variant={variant}
            />
          ))
        ) : (
          <PropertySurface muted variant={variant}>
            {placeholder}
          </PropertySurface>
        )}
      </fieldset>
    )
  }

  /** O mesmo formulário para os dois arranjos de gatilho. */
  const entryForm = (
    <PopoverPopup align="start" aria-label={addLabel} className="w-80">
      <form className="grid gap-3 p-1" onSubmit={submit}>
        {drafts.map((draft, index) => (
          <div
            className="group/entry grid gap-1"
            key={entryLabels[index] ?? index}
          >
            {drafts.length > 1 || entryLabels.length > 1 ? (
              <span className="font-medium text-muted-foreground text-xs">
                {entryLabels[index] ?? `${index + 1}`}
              </span>
            ) : null}
            <div className="flex items-center gap-1">
              <PhoneInput
                ariaLabel={entryLabels[index] ?? addLabel}
                defaultCountry={defaultCountry}
                invalid={Boolean(errors[index])}
                // O popup do Base UI fecha no `Enter`. Conter o evento no
                // próprio campo — antes de ele subir — é o que deixa salvar
                // pelo teclado sem o popup sumir por baixo.
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return
                  event.preventDefault()
                  event.stopPropagation()
                  save()
                }}
                onValueChange={(next) => {
                  setDrafts(
                    drafts.map((current, at) =>
                      at === index ? next : current,
                    ),
                  )
                  setErrors(
                    errors.map((current, at) =>
                      at === index ? null : current,
                    ),
                  )
                }}
                placeholder={inputPlaceholder}
                value={draft}
              />
              {drafts.length > 1 ? (
                // Só aparece no hover da linha: com os dois preenchidos a
                // fileira fica limpa, e a remoção surge onde o cursor já
                // está. `focus-within` mantém o caminho pelo teclado.
                <Button
                  aria-label={`Remover ${entryLabels[index] ?? ''} telefone`}
                  className="opacity-0 transition-opacity focus-visible:opacity-100 group-focus-within/entry:opacity-100 group-hover/entry:opacity-100"
                  onClick={() => {
                    setDrafts(drafts.filter((_, at) => at !== index))
                    setErrors(errors.filter((_, at) => at !== index))
                  }}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              ) : null}
            </div>
            {errors[index] ? (
              <p className="text-destructive-foreground text-xs" role="alert">
                {errors[index]}
              </p>
            ) : null}
          </div>
        ))}
        {errorMessage ? (
          <p className="text-destructive-foreground text-xs" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <Button
            disabled={!canAddAnother}
            onClick={() => setDrafts([...drafts, null])}
            size="sm"
            type="button"
            variant="ghost"
          >
            <PlusIcon aria-hidden="true" />
            Adicionar outro
          </Button>
          <Button size="sm" type="submit" variant="secondary">
            Salvar
          </Button>
        </div>
      </form>
    </PopoverPopup>
  )

  const summary =
    value.length > 1
      ? `${value[0]} +${value.length - 1}`
      : (value[0] ?? placeholder)

  if (display === 'trigger') {
    return (
      <Popover onOpenChange={setOpen} open={open}>
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
    <fieldset
      aria-label={ariaLabel}
      className={cn(
        'm-0 flex min-w-0 flex-wrap items-center gap-1 border-0 p-0',
        className,
      )}
      data-slot="phone-property"
      data-variant={variant}
    >
      {value.map((phone) => (
        <IconLabelProperty
          className="pe-0"
          icon={PhoneIcon}
          key={phone}
          label={phone}
          trailing={
            <button
              aria-label={`Remover telefone ${phone}`}
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
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger
            render={
              <PropertySurface
                // Vazia, a fileira lê como as outras propriedades ausentes, e o
                // que ela faz fica no nome acessível. Com números nela sobra o
                // `+`.
                aria-label={addLabel}
                className={value.length > 0 ? 'w-6 px-0' : 'gap-1'}
                muted={value.length === 0}
                render={<button disabled={disabled} type="button" />}
              />
            }
          >
            {value.length > 0 ? (
              <PlusIcon aria-hidden="true" className="size-3.5" />
            ) : (
              <>
                <PhoneIcon aria-hidden="true" className="size-3.5" />
                {placeholder}
              </>
            )}
          </PopoverTrigger>
          {entryForm}
        </Popover>
      )}
    </fieldset>
  )
}
