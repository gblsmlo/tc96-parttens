export interface OptionLike {
  label: string
  value: string
}

export type ResolvedOption<TOption extends OptionLike> =
  | TOption
  | { label: TOption['value']; value: TOption['value'] }

export function resolveOption<TOption extends OptionLike>(
  options: readonly TOption[],
  value: TOption['value'],
): ResolvedOption<TOption> {
  return (
    options.find((option) => option.value === value) ?? {
      label: value,
      value,
    }
  )
}

export function resolveOptions<TOption extends OptionLike>(
  options: readonly TOption[],
  values: readonly TOption['value'][],
): ResolvedOption<TOption>[] {
  return values.map((value) => resolveOption(options, value))
}

export function diffValues<TValue>(
  previous: readonly TValue[],
  next: readonly TValue[],
): { added: TValue | null; removed: TValue | null } {
  const previousValues = new Set(previous)
  const nextValues = new Set(next)

  return {
    added: next.find((value) => !previousValues.has(value)) ?? null,
    removed: previous.find((value) => !nextValues.has(value)) ?? null,
  }
}

export function diffOptions<TOption extends OptionLike>(
  options: readonly TOption[],
  previous: readonly TOption['value'][],
  next: readonly TOption['value'][],
): {
  added: ResolvedOption<TOption> | null
  removed: ResolvedOption<TOption> | null
} {
  const { added, removed } = diffValues(previous, next)

  return {
    added: added === null ? null : resolveOption(options, added),
    removed: removed === null ? null : resolveOption(options, removed),
  }
}
