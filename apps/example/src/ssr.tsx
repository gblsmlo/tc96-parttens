import { ActionBar } from '@acme/patterns/collection-views'
import { TextProperty } from '@acme/patterns/properties'
import { renderToString } from 'react-dom/server'

export function Page() {
  return (
    <main>
      <ActionBar
        actions={[{ items: [{ label: 'Arquivar' }] }]}
        selectedCount={1}
      />
      <TextProperty value="Rendered on server" />
    </main>
  )
}

console.log(renderToString(<Page />))
