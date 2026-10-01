# TC96 Storybook

Catálogo visual interno para desenvolver e testar os patterns sobre os pacotes do
workspace. As stories importam os patterns de `@tc96/parttens` e os componentes de
UI por subpath, como `@tc96/ui/button`; o barrel de `@tc96/ui` está sendo
removido. Utilitários sem interface, MDX e documentação conceitual pertencem ao
app Fumadocs em `apps/docs`.

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

O catálogo é organizado em dois grupos:

```text
UI
Patterns
```

`Patterns` reúne Collection Views, Properties, Toolbar, Pagination e Action Bar.
