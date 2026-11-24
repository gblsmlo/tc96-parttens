import { Button } from '@tc96/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@tc96/ui/empty'
import { IconFrame } from '@tc96/ui/icon-frame'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { cn } from '@tc96/utils'
import { defaultEmptyState6Labels } from './labels'
import type { EmptyState6Props } from './types'

export function EmptyState6({
  className,
  labels: labelsProp,
  onSetup,
  onTabChange,
  tab,
  tabs,
}: Readonly<EmptyState6Props>) {
  const labels = { ...defaultEmptyState6Labels, ...labelsProp }

  return (
    <Tabs
      className={cn('w-full', className)}
      onValueChange={(value) => onTabChange(String(value))}
      value={tab}
    >
      <TabsList aria-label={labels.tabs} variant="underline">
        {tabs.map((item) => (
          <TabsTab key={item.id} value={item.id}>
            {item.label}
          </TabsTab>
        ))}
      </TabsList>
      {tabs.map((item) => {
        const Icon = item.icon

        return (
          <TabsPanel key={item.id} value={item.id}>
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <IconFrame shape="rounded" size="xl">
                    <Icon />
                  </IconFrame>
                </EmptyMedia>
                <EmptyTitle>{item.title}</EmptyTitle>
                <EmptyDescription>{item.description}</EmptyDescription>
              </EmptyHeader>
              <Button onClick={() => onSetup(item.id)} size="sm">
                {item.actionLabel}
              </Button>
            </Empty>
          </TabsPanel>
        )
      })}
    </Tabs>
  )
}
