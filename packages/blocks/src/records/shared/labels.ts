export function resolveRecordsLabels<TLabels>(
  defaults: TLabels,
  labels?: Partial<TLabels>,
): TLabels {
  return { ...defaults, ...labels }
}
