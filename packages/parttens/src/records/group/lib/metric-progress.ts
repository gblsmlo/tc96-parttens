export const clampMetricProgress = (progress: number) =>
  Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0
