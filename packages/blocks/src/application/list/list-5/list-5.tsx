import { PlusIcon } from '@phosphor-icons/react'
import { List } from '@tc96/parttens/list/composition/list/list'
import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import { defaultList5Labels } from './labels'
import type { List5Props } from './types'

export function List5({
  className,
  labels: labelsProp,
  modules,
  onAdd,
  onBrowseMore,
}: Readonly<List5Props>) {
  const labels = { ...defaultList5Labels, ...labelsProp }

  return (
    <div className={cn('grid gap-3', className)}>
      <ul aria-label={labels.title} className="grid gap-2">
        {modules.map((module) => {
          const ModuleIcon = module.icon

          return (
            <List
              actions={
                onAdd ? (
                  <Button
                    aria-label={labels.add(module.name)}
                    onClick={() => onAdd(module.id)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <PlusIcon aria-hidden="true" />
                  </Button>
                ) : null
              }
              description={module.description}
              icon={<ModuleIcon aria-hidden="true" />}
              key={module.id}
              render={<li data-module={module.id} />}
              title={module.name}
            />
          )
        })}
      </ul>
      {onBrowseMore ? (
        <Button onClick={onBrowseMore} size="sm" variant="outline">
          {labels.browseMore}
        </Button>
      ) : null}
    </div>
  )
}
