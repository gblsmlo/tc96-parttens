import { createRoot } from 'react-dom/client'

function App() {
  return (
    <main>
      <h1>TC96</h1>
      <p>A documentação é escrita em Fumadocs MDX em <code>content/docs</code>.</p>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
