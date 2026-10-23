import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { Sheet, SheetPopup } from '@tc96/ui/sheet'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { cn } from '@tc96/utils'
import { TriangleAlertIcon } from 'lucide-react'
import { type CSSProperties, type ReactNode, useMemo } from 'react'
import { InspectorHeader } from '../../components/inspector-header'
import { type FlowInspectorTab, flowInspectorTabs } from '../../core'
import { useInspectorDock } from '../../hooks/use-inspector-dock'
import { defaultFlowInspectorLabels } from '../../lib/labels'
import { FlowInspectorContext } from '../../store/flow-inspector-context'
import type { FlowInspectorLabels } from '../../types'

export interface FlowInspectorProps {
  badge?: ReactNode
  build?: ReactNode
  children?: ReactNode
  className?: string
  disabledTabs?: readonly FlowInspectorTab[]
  headerActions?: ReactNode
  icon?: ReactNode
  labels?: Partial<FlowInspectorLabels>
  logs?: ReactNode
  onClose: () => void
  onTabChange: (tab: FlowInspectorTab) => void
  open: boolean
  status?: ReactNode
  tab: FlowInspectorTab
  title: ReactNode
  unconnected?: boolean
  width?: string
}

function isTab(value: unknown): value is FlowInspectorTab {
  return flowInspectorTabs.some((tab) => tab === value)
}

export function FlowInspector({
  badge,
  build,
  children,
  className,
  disabledTabs = [],
  headerActions,
  icon,
  labels: labelOverrides,
  logs,
  onClose,
  onTabChange,
  open,
  status,
  tab,
  title,
  unconnected = false,
  width = '24rem',
}: FlowInspectorProps) {
  const docked = useInspectorDock()
  const labels = useMemo(
    () => ({ ...defaultFlowInspectorLabels, ...labelOverrides }),
    [labelOverrides],
  )
  const context = useMemo(() => ({ labels, onClose }), [labels, onClose])
  const panels: Record<FlowInspectorTab, ReactNode> = { build, logs, status }

  const body = (
    <div
      className="flex h-full min-h-0 w-full flex-col"
      data-slot="flow-inspector-body"
    >
      <InspectorHeader
        actions={headerActions}
        badge={badge}
        icon={icon}
        title={title}
      />
      <Tabs
        className="min-h-0 flex-1 gap-0"
        onValueChange={(value) => {
          if (isTab(value)) onTabChange(value)
        }}
        value={tab}
      >
        <div className="border-b px-4">
          <TabsList
            aria-label={labels.tabsLabel}
            className="w-full justify-start py-0"
            variant="underline"
          >
            {flowInspectorTabs.map((item) => (
              <TabsTab
                className="grow-0"
                disabled={disabledTabs.includes(item)}
                key={item}
                value={item}
              >
                {labels.tabs[item]}
              </TabsTab>
            ))}
          </TabsList>
        </div>
        <ScrollArea className="flex-1" scrollFade>
          {flowInspectorTabs.map((item) => (
            <TabsPanel
              className="flex flex-col gap-4 p-4"
              key={item}
              value={item}
            >
              {item === 'build' && unconnected ? (
                <Alert
                  className="[&>svg]:text-warning-foreground"
                  variant="warning"
                >
                  <TriangleAlertIcon aria-hidden="true" />
                  <AlertTitle>{labels.unconnectedTitle}</AlertTitle>
                  <AlertDescription>
                    {labels.unconnectedDescription}
                  </AlertDescription>
                </Alert>
              ) : null}
              {panels[item]}
            </TabsPanel>
          ))}
        </ScrollArea>
      </Tabs>
      {children ? (
        <footer
          className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t p-4"
          data-slot="flow-inspector-footer"
        >
          {children}
        </footer>
      ) : null}
    </div>
  )

  if (!docked) {
    return (
      <FlowInspectorContext.Provider value={context}>
        <Sheet
          onOpenChange={(next) => {
            if (!next) onClose()
          }}
          open={open}
        >
          <SheetPopup
            aria-label={labels.title}
            className="p-0"
            data-slot="flow-inspector"
            showCloseButton={false}
          >
            {body}
          </SheetPopup>
        </Sheet>
      </FlowInspectorContext.Provider>
    )
  }

  return (
    <FlowInspectorContext.Provider value={context}>
      <aside
        aria-label={labels.title}
        className={cn(
          'relative h-full shrink-0 overflow-hidden border-s bg-background transition-[width] duration-200 ease-in-out motion-reduce:transition-none',
          open ? 'w-(--flow-inspector-width)' : 'w-0 border-s-0',
          className,
        )}
        data-docked={open ? 'true' : 'false'}
        data-slot="flow-inspector"
        inert={!open}
        style={{ '--flow-inspector-width': width } as CSSProperties}
      >
        <div className="h-full w-(--flow-inspector-width)">{body}</div>
      </aside>
    </FlowInspectorContext.Provider>
  )
}
