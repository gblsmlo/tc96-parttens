import { ActionBar, TextProperty } from '@acme/patterns'
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
