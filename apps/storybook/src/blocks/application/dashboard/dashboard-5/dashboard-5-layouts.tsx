import { Dashboard5 } from '@tc96/ui/blocks/application/dashboard/dashboard-5'
import { renderAnchor } from '@tc96/ui/render-anchor'
import {
  appointments,
  dashboard5TimeZone,
  deadlines,
  dueDays,
  links,
  metrics,
  publications,
  queues,
} from '../fixtures/dashboard-5.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'
import type { Dashboard5Controls } from './dashboard-5-controls.ts'

interface ComposedDashboard5Props extends Dashboard5Controls {
  onRetry?: () => void
}

export const ComposedDashboard5 = ({
  empty,
  error,
  onRetry,
  ownerView,
  panelLinks,
  pending,
  title,
}: Readonly<ComposedDashboard5Props>) => (
  <Dashboard5
    appointments={empty ? [] : appointments}
    breadcrumbs={breadcrumbsFor(title)}
    deadlines={empty ? [] : deadlines}
    dueDays={empty ? [] : dueDays}
    error={error}
    labels={{ title }}
    links={panelLinks ? links : undefined}
    metrics={
      empty
        ? {}
        : ownerView
          ? metrics
          : { dueSoon: metrics.dueSoon, overdue: metrics.overdue }
    }
    onRetry={onRetry}
    pending={pending}
    publications={empty ? [] : ownerView ? publications : undefined}
    queues={empty ? [] : queues}
    renderLink={renderAnchor}
    timeZone={dashboard5TimeZone}
  />
)
