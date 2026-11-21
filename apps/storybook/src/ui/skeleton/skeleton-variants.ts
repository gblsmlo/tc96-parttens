export const skeletonShapeNames = ['line', 'circle', 'block'] as const

export type SkeletonShapeName = (typeof skeletonShapeNames)[number]

export const skeletonShapeClasses: Record<SkeletonShapeName, string> = {
  block: 'h-24 w-48',
  circle: 'size-10 rounded-full',
  line: 'h-4 w-48',
}
