import { afterEach, expect, test } from 'bun:test'

await import('./test/dom')

const { cleanup, render } = await import('@testing-library/react')
const { ReactFlow, ReactFlowProvider } = await import('@xyflow/react')

afterEach(cleanup)

test('mounts an empty React Flow in JSDOM', () => {
  const { container } = render(
    <ReactFlowProvider>
      <ReactFlow edges={[]} nodes={[]} />
    </ReactFlowProvider>,
  )
  expect(container.querySelector('.react-flow')).not.toBeNull()
})
