import { Checkbox } from '@tc96/ui/checkbox'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsNotificationChannel1Labels } from './labels'
import { SettingsNotificationChannel1Skeleton } from './settings-notification-channel-1-skeleton'
import type { SettingsNotificationChannel1Props } from './types'

export function SettingsNotificationChannel1({
  error,
  onRetry,
  pending,
  categories,
  channels,
  className,
  labels: labelsProp,
  matrix,
  onChange,
}: Readonly<SettingsNotificationChannel1Props>) {
  const labels = { ...defaultSettingsNotificationChannel1Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsNotificationChannel1Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-3xl', className)}
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ??
        (categories.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          <Tabs defaultValue={categories[0]?.id}>
            <TabsList aria-label={labels.categories} variant="underline">
              {categories.map((category) => (
                <TabsTab key={category.id} value={category.id}>
                  {category.name}
                </TabsTab>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsPanel key={category.id} value={category.id}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{labels.event}</TableHead>
                      {channels.map((channel) => (
                        <TableHead className="text-center" key={channel.id}>
                          {channel.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Text
                            render={<p>{event.name}</p>}
                            size="sm"
                            weight="semibold"
                          />
                          {event.description ? (
                            <Text
                              foreground="muted"
                              render={<p>{event.description}</p>}
                              size="sm"
                            />
                          ) : null}
                        </TableCell>
                        {channels.map((channel) => (
                          <TableCell className="text-center" key={channel.id}>
                            <Checkbox
                              aria-label={labels.cell(event.name, channel.name)}
                              checked={matrix[event.id]?.[channel.id] ?? false}
                              disabled={!onChange}
                              onCheckedChange={(checked) =>
                                onChange?.(event.id, channel.id, checked)
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsPanel>
            ))}
          </Tabs>
        ))}
    </SettingsSection>
  )
}
