import { Button } from '@tc96/ui/button'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import type { ReactElement } from 'react'
import type { AiChat1Labels, AiChat1Starter } from './types'

export interface AiChat1StarterViewProps {
  disabled: boolean
  labels: AiChat1Labels
  onPrompt: (prompt: string) => void
  starters: readonly AiChat1Starter[]
}

export function AiChat1StarterView({
  disabled,
  labels,
  onPrompt,
  starters,
}: Readonly<AiChat1StarterViewProps>): ReactElement {
  const first = starters[0]
  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-8"
      data-slot="ai-chat-starter"
    >
      <div className="flex flex-col gap-1 text-center">
        <p className="font-semibold text-2xl">{labels.starterTitle}</p>
        <p className="text-muted-foreground text-sm">
          {labels.starterDescription}
        </p>
      </div>
      {first ? (
        <Tabs className="items-center gap-4" defaultValue={first.id}>
          <TabsList aria-label={labels.starterCategories}>
            {starters.map((starter) => (
              <TabsTab key={starter.id} value={starter.id}>
                {starter.icon}
                {starter.label}
              </TabsTab>
            ))}
          </TabsList>
          {starters.map((starter) => (
            <TabsPanel className="w-full" key={starter.id} value={starter.id}>
              <ul className="flex flex-col divide-y">
                {starter.prompts.map((prompt) => (
                  <li key={prompt}>
                    <Button
                      className="h-auto w-full justify-start whitespace-normal py-2 text-start"
                      disabled={disabled}
                      onClick={() => onPrompt(prompt)}
                      size="sm"
                      variant="ghost"
                    >
                      {prompt}
                    </Button>
                  </li>
                ))}
              </ul>
            </TabsPanel>
          ))}
        </Tabs>
      ) : null}
    </div>
  )
}
