import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  type AccordionPrimitive,
  AccordionTrigger,
} from '@tc96/ui/accordion'
import { Button } from '@tc96/ui/button'
import type { AccordionControls } from './accordion-controls.ts'
import {
  type AccordionItemValue,
  accordionItems,
  disabledItemValue,
} from './accordion-variants.ts'

interface ComposedAccordionProps extends AccordionControls {
  hiddenUntilFound?: boolean
  itemCount?: number
  keepMounted?: boolean
  multiple?: boolean
  onItemOpenChange?: AccordionPrimitive.Item.Props['onOpenChange']
  onValueChange?: AccordionPrimitive.Root.Props['onValueChange']
  orientation?: AccordionPrimitive.Root.Props['orientation']
  panelClassName?: string
  richPanels?: boolean
  value?: AccordionItemValue[]
}

export const ComposedAccordion = ({
  defaultValue,
  disabled,
  disabledItem,
  firstTrigger,
  hiddenUntilFound,
  icons,
  itemCount = accordionItems.length,
  keepMounted,
  multiple,
  onItemOpenChange,
  onValueChange,
  orientation,
  panelClassName,
  richPanels,
  secondTrigger,
  thirdTrigger,
  value,
}: Readonly<ComposedAccordionProps>) => {
  const labels = [firstTrigger, secondTrigger, thirdTrigger]

  return (
    <Accordion
      defaultValue={
        value !== undefined || defaultValue === 'none'
          ? undefined
          : [defaultValue]
      }
      disabled={disabled}
      hiddenUntilFound={hiddenUntilFound}
      keepMounted={keepMounted}
      key={defaultValue}
      multiple={multiple}
      onValueChange={onValueChange}
      orientation={orientation}
      value={value}
    >
      {accordionItems
        .slice(0, itemCount)
        .map(({ content, icon: Icon, value: item }, index) => (
          <AccordionItem
            disabled={disabledItem && item === disabledItemValue}
            key={item}
            onOpenChange={onItemOpenChange}
            value={item}
          >
            <AccordionTrigger>
              {icons ? (
                <span className="flex items-center gap-2">
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {labels[index]}
                </span>
              ) : (
                labels[index]
              )}
            </AccordionTrigger>
            {richPanels ? (
              <AccordionPanel className="flex flex-col items-start gap-3">
                <p>{content}</p>
                <p>Add a second paragraph when one is not enough.</p>
                <Button size="sm" variant="outline">
                  Panel action
                </Button>
              </AccordionPanel>
            ) : (
              <AccordionPanel className={panelClassName}>
                {content}
              </AccordionPanel>
            )}
          </AccordionItem>
        ))}
    </Accordion>
  )
}
