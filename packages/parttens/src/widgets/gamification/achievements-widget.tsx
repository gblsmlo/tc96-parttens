import { IconFrame } from '@tc96/elements/icon-frame'
import { CardPanel } from '@tc96/ui/card'
import { LockKeyholeIcon } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'
import {
  ExpandableList,
  type WidgetExpandProps,
} from '../shared/expandable-list'
import { WidgetHeader } from '../shared/widget-header'
import type { Achievement } from './types'

export interface AchievementsWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  achievements: readonly Achievement[]
  action?: ReactNode
  color?: string
  countLabel?: (unlocked: number, total: number) => ReactNode
  expand?: WidgetExpandProps
  lockedLabel?: string
  title: ReactNode
  unlockedLabel?: string
}

export function AchievementsWidget({
  achievements,
  action,
  className,
  color = 'var(--warning-foreground)',
  countLabel = (unlocked, total) => `${unlocked} de ${total}`,
  expand,
  lockedLabel = 'bloqueada',
  title,
  unlockedLabel = 'conquistada',
  ...props
}: Readonly<AchievementsWidgetProps>): ReactElement {
  const titleId = useId()
  const unlocked = achievements.filter((item) => item.unlocked).length
  const headerAction = action ?? (
    <span className="text-muted-foreground text-sm tabular-nums">
      {countLabel(unlocked, achievements.length)}
    </span>
  )

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-widget="achievements"
      {...props}
    >
      <WidgetHeader action={headerAction} title={title} titleId={titleId} />
      <CardPanel className="grid gap-5 px-5 pb-5">
        <ExpandableList items={achievements} visibleCount={6} {...expand}>
          {(shown) => (
            <ul
              className="grid grid-cols-2 gap-4 sm:grid-cols-3"
              data-slot="achievement-list"
            >
              {shown.map((achievement) => (
                <li
                  className="flex flex-col items-center gap-2 text-center"
                  data-slot="achievement"
                  data-unlocked={achievement.unlocked ? 'true' : undefined}
                  key={achievement.id}
                >
                  {achievement.unlocked ? (
                    <IconFrame color={color} size="xl">
                      {achievement.icon}
                    </IconFrame>
                  ) : (
                    <IconFrame
                      className="border border-input border-dashed text-muted-foreground"
                      size="xl"
                      variant="plain"
                    >
                      <LockKeyholeIcon />
                    </IconFrame>
                  )}
                  <span className="font-medium text-sm">
                    {achievement.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {achievement.detail}
                    {!achievement.unlocked && achievement.progress ? (
                      <span className="block tabular-nums">
                        {achievement.progress.current}/
                        {achievement.progress.target}
                      </span>
                    ) : null}
                  </span>
                  <span className="sr-only">
                    {achievement.unlocked ? unlockedLabel : lockedLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ExpandableList>
      </CardPanel>
    </CardWidgetShell>
  )
}
