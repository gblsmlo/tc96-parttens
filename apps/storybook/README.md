# TC96 Storybook

Catálogo visual interno para desenvolver e testar a API publicada do pacote.
Stories desta pasta devem representar componentes renderizáveis e importar
somente `tc96/ui`, `tc96/components` ou `tc96/blocks`. Utilitários sem interface,
MDX e documentação conceitual pertencem ao app Fumadocs em `apps/docs`; imports
diretos de `packages/tc96/src` também não são permitidos.

Cada grupo de stories gera automaticamente uma entrada `Doc` por meio do
Storybook Autodocs. Props, Controls e descrições são derivados do componente e
dos metadados CSF; não devem existir stories manuais chamadas `Docs`.

Na raiz do workspace:

```sh
bun run storybook
bun run storybook:build
bun run storybook:test
```

`storybook:test` transforma as stories em testes Vitest e executa as interações
em Chromium pelo Playwright.

A suíte de arquitetura falha quando uma story é criada fora de `ui`,
`components` ou `blocks`, importa `tc96/utils`, adiciona MDX ou cria uma story
manual chamada `Docs`.

O catálogo segue a mesma responsabilidade dos subpaths públicos:

```text
UI
Components/Properties
Blocks/Views
```

Dentro de `Blocks/Views`, Kanban e List compartilham a infraestrutura de
Collection; DataGrid permanece uma view independente. Gallery, Timeline e
Calendar aparecem como planned para reservar sua posição sem antecipar APIs.
