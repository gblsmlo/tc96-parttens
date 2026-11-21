import type { TabsPrimitive } from '@tc96/ui/tabs'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import type { TabsControls } from './tabs-controls.ts'
import {
  disabledTabValue,
  type TabValue,
  tabItems,
  tabPanelCopy,
} from './tabs-variants.ts'

interface ComposedTabsProps extends TabsControls {
  activateOnFocus?: boolean
  iconOnly?: boolean
  keepMounted?: boolean
  listClassName?: string
  loopFocus?: boolean
  onValueChange?: TabsPrimitive.Root.Props['onValueChange']
  value?: TabValue
}

export const ComposedTabs = ({
  activateOnFocus,
  defaultValue,
  disabledTab,
  firstTab,
  iconOnly,
  icons,
  keepMounted,
  listClassName,
  loopFocus,
  onValueChange,
  orientation,
  secondTab,
  size,
  thirdTab,
  value,
  variant,
}: Readonly<ComposedTabsProps>) => {
  const labels = [firstTab, secondTab, thirdTab]

  return (
    <Tabs
      defaultValue={value === undefined ? defaultValue : undefined}
      key={defaultValue}
      onValueChange={onValueChange}
      orientation={orientation}
      value={value}
    >
      <TabsList
        activateOnFocus={activateOnFocus}
        className={listClassName}
        loopFocus={loopFocus}
        size={size}
        variant={variant}
      >
        {tabItems.map(({ icon: Icon, value: item }, index) => (
          <TabsTab
            aria-label={iconOnly ? labels[index] : undefined}
            disabled={disabledTab && item === disabledTabValue}
            key={item}
            value={item}
          >
            {icons || iconOnly ? <Icon aria-hidden="true" /> : null}
            {iconOnly ? null : labels[index]}
          </TabsTab>
        ))}
      </TabsList>
      {tabItems.map(({ value: item }) => (
        <TabsPanel keepMounted={keepMounted} key={item} value={item}>
          <p className="text-muted-foreground text-sm">{tabPanelCopy[item]}</p>
        </TabsPanel>
      ))}
    </Tabs>
  )
}
