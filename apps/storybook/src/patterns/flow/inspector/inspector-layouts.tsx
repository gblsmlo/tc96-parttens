import { EnvelopeSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import {
  FlowInspector,
  FlowInspectorDetails,
  FlowInspectorLogs,
  type FlowInspectorProps,
  FlowInspectorStatus,
  type FlowInspectorTab,
  type FlowLogEntry,
  type FlowLogFilter,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import type { InspectorControls } from './inspector-controls.ts'
import {
  lastRun,
  logEntries,
  stepDetails,
  testRunStats,
} from './inspector-data.ts'

type ConsumerHandledProps = 'onClose' | 'onTabChange' | 'open' | 'tab'

interface StatefulInspectorProps
  extends Omit<FlowInspectorProps, ConsumerHandledProps> {
  initialOpen?: boolean
  initialTab?: FlowInspectorTab
  onClose?: () => void
  onTabChange?: (tab: FlowInspectorTab) => void
}

export const StatefulInspector = ({
  initialOpen = true,
  initialTab = 'build',
  onClose,
  onTabChange,
  ...props
}: Readonly<StatefulInspectorProps>) => {
  const [open, setOpen] = useState(initialOpen)
  const [tab, setTab] = useState(initialTab)
  return (
    <>
      {open ? null : (
        <div className="flex flex-1 items-center justify-center">
          <Button onClick={() => setOpen(true)} variant="outline">
            Ver passo
          </Button>
        </div>
      )}
      <FlowInspector
        {...props}
        onClose={() => {
          onClose?.()
          setOpen(false)
        }}
        onTabChange={(next) => {
          onTabChange?.(next)
          setTab(next)
        }}
        open={open}
        tab={tab}
      />
    </>
  )
}

interface LogsPanelProps {
  entries: readonly FlowLogEntry[]
  onEmptyAction?: () => void
  onFilterChange?: (filter: FlowLogFilter) => void
  stepId: string
}

export const LogsPanel = ({
  entries,
  onEmptyAction = () => {},
  onFilterChange,
  stepId,
}: Readonly<LogsPanelProps>) => {
  const [filter, setFilter] = useState<FlowLogFilter>('all')
  return (
    <FlowInspectorLogs
      emptyActionLabel="Executar uma vez"
      entries={
        filter === 'all'
          ? entries
          : entries.filter((entry) => entry.stepId === stepId)
      }
      filter={filter}
      onEmptyAction={onEmptyAction}
      onFilterChange={(next) => {
        onFilterChange?.(next)
        setFilter(next)
      }}
    />
  )
}

export const DeleteStepButton = () => (
  <Button aria-label="Excluir passo" size="icon-sm" variant="ghost">
    <TrashIcon aria-hidden="true" />
  </Button>
)

export const ComposedInspector = ({
  badge,
  disabledTabs,
  footer,
  headerActions,
  icon,
  logs,
  open,
  runStatus,
  tab,
  title,
  unconnected,
  width,
}: Readonly<InspectorControls>) => (
  <StatefulInspector
    badge={badge || undefined}
    build={<FlowInspectorDetails items={stepDetails} />}
    disabledTabs={disabledTabs ? ['status', 'logs'] : undefined}
    headerActions={headerActions ? <DeleteStepButton /> : undefined}
    icon={icon ? <EnvelopeSimpleIcon aria-hidden="true" /> : undefined}
    initialOpen={open}
    initialTab={tab}
    key={[open, tab].join()}
    logs={
      <LogsPanel
        entries={logs === 'empty' ? [] : logEntries}
        stepId="send-email"
      />
    }
    status={
      <FlowInspectorStatus
        {...lastRun}
        stats={testRunStats}
        status={runStatus}
      />
    }
    title={title}
    unconnected={unconnected}
    width={width || undefined}
  >
    {footer ? (
      <>
        <Button variant="outline">Editar passo</Button>
        <Button>Próximo passo</Button>
      </>
    ) : null}
  </StatefulInspector>
)
