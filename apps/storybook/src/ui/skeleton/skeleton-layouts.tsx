import { Skeleton } from '@tc96/ui/skeleton'
import type { SkeletonControls } from './skeleton-controls.ts'
import { skeletonShapeClasses } from './skeleton-variants.ts'

export const ComposedSkeleton = ({ shape }: Readonly<SkeletonControls>) => (
  <Skeleton className={skeletonShapeClasses[shape]} />
)

export const TextLinesSkeleton = () => (
  <div className="flex w-64 flex-col gap-2">
    <Skeleton className={skeletonShapeClasses.line} />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
)

export const ProfileRowSkeleton = () => (
  <div className="flex w-80 max-w-full items-center gap-4">
    <ComposedSkeleton shape="circle" />
    <div className="flex flex-1 flex-col gap-1">
      <Skeleton className="my-0.5 h-4 max-w-40" />
      <Skeleton className="my-0.5 h-4 w-1/2" />
    </div>
    <Skeleton className="h-6 w-17" />
  </div>
)

export const MediaCardSkeleton = () => (
  <div className="flex w-48 flex-col gap-3">
    <ComposedSkeleton shape="block" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
)
