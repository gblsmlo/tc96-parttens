# TC96 Storybook

Catálogo visual interno para desenvolver e testar os patterns sobre os pacotes do
workspace. As stories importam os patterns de `@tc96/parttens` e os componentes de
UI por subpath, como `@tc96/ui/button`. `packages/ui` é o COSS sem alterações,
travado em `packages/ui/coss.lock.json`. Utilitários sem interface, MDX e documentação conceitual pertencem ao
app Fumadocs em `apps/docs`.

O framework é `@storybook/react-vite`. Nenhum pattern nem story importa
`@tanstack/react-router`, então não há motivo para `@storybook/tanstack-react`;
se uma story passar a depender do router, essa escolha precisa ser revista.

Cada grupo de stories gera automaticamente uma entrada `Doc` por meio do
Storybook Autodocs. Props, Controls e descrições são derivados do componente e
dos metadados CSF; não devem existir stories manuais chamadas `Docs`.

Na raiz do workspace:

```sh
bun run storybook
bun run storybook:build
bun run storybook:test
bun run storybook:typecheck
bun run storybook:lint
```

`storybook:test` transforma as stories em testes Vitest e executa as interações
em Chromium pelo Playwright. O axe roda em cada story, e uma violação reprova o
teste; exceção só na própria story, com o motivo. O `bun run check` da raiz roda
todos, menos o servidor `storybook`. Node 22.12 ou mais novo, como pede o Vite; o
`.nvmrc` fixa o 24, usado na verificação.

O catálogo é organizado em dois grupos:

```text
UI
Patterns
```

`Patterns` reúne Collection Views, Properties, Toolbar, Pagination e Action Bar.
