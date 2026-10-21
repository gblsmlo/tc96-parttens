# 0005. Templates instaláveis pelo registry, em `packages/templates`

- **Status:** Accepted (dono, na conversa de 2026-10-21)
- **Date:** 2026-10-21
- **Origin:** pedido do dono em 2026-10-21: "use o registro para o usuário instalar o template que ele deseja", começando por Application / Shell, com stories em `Templates/.../AppShell{n}` e os comandos documentados em `Templates/Doc`
- **Amends:** [ADR 0004](0004-templates-only-in-storybook.md), nos aspectos D1, D3, D4 e D5, só para templates instaláveis. Os templates que já existem (`Templates/Contacts`, `Companies`, `ContactDetail`, `DealBoard`, `WorkspaceSettings`) continuam só no Storybook, como o ADR 0004 decidiu

## Context

| Força | Fonte |
| --- | --- |
| O dono quer que o consumidor instale pelo CLI o template que escolher, a começar pelos App Shells | pedido de 2026-10-21 |
| O ADR 0004 tira templates do registry e do CLI, e o consumidor copia com `story:source` | `.specs/adr/0004-templates-only-in-storybook.md` (D4, D5) |
| O build do registry só segue imports para dentro de `packages/` e reprova o que resolve fora | `packages/registry/src/build-registry.ts:96-105` |
| O CLI deriva `elements`, `helpers` e `patterns` do alias `ui` e exige o `paths` de cada um no tsconfig, mesmo sem uso | `packages/registry/src/config.ts:21-44`, `config.ts:85-110` |
| O instalador de COSS aceita só itens de um arquivo em `registry/default/ui/<item>.tsx`; o `sidebar` do COSS depende de `@coss/use-media-query`, que é um hook em `registry/default/hooks/` | `packages/registry/src/coss.ts:55-66`, `https://coss.com/ui/r/sidebar.json` |
| `installed()` procura `<ui>/<item>.tsx`, então um hook nunca conta como instalado | `packages/registry/src/cli.ts:75-76` |
| Um shell é layout da aplicação: barra lateral, cabeçalho e área de conteúdo, sem regra de negócio | `docs/architecture/tc96-parttens.md:281` (`apps/web/` guarda templates e páginas) |
| Os blocos App Shell do ReUI são Pro, com licença; servem só de referência de anatomia, sem copiar código nem buscar o JSON do registry deles | `https://reui.io/blocks/application/app-shell`, `https://reui.io/docs/registry` |

## Decision

Um template instalável é um componente de página ou de layout que compõe COSS, `elements` e patterns, vive em `packages/templates` (`@tc96/templates`) e tem um item no registry com o mesmo nome do CLI: `npx @tc96/parttens add app-shell-1`.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| D1. Lugar | `packages/templates/src/<categoria>/<grupo>/<template>/`, por exemplo `application/shell/app-shell-1/`. A pasta tem `index.ts`, o componente e os tipos. As peças que mais de um template do mesmo grupo usa ficam em `<categoria>/<grupo>/shared/`, interno, e seguem com cada item que as importa |
| D2. Camada | `templates` → `parttens` → `elements` → `ui` → `utils` (`helpers` sem React). Nada importa `templates`. `bun run boundaries:check` passa a cobrir o pacote |
| D3. Composição | O template importa um módulo de pattern pelo arquivo (`@tc96/parttens/widgets/shared/progress-ring`), não pelo barrel, para o item levar só esse arquivo (ajuste da implementação em 2026-10-21: pelo barrel, o build seguiria o agregado e levaria todos os patterns); componentes por `@tc96/ui/<component>` e `@tc96/elements/<element>`. Dados vêm por props tipadas; navegação passa por `renderLink`, para o roteador do consumidor; o template não busca, não persiste e não lê cookie. Não traz tema, `next-themes` nem token. Um bloco útil fora do grupo (por exemplo `page-header`) vira pattern, como no ADR 0004 |
| D4. Story | `apps/storybook/src/<categoria>/<grupo>/`, título `<Categoria>/<Grupo>/<Nome>` na raiz da sidebar, por exemplo `Application/Shell/AppShell1`; `Templates/Doc` documenta os comandos. Emenda do dono em 2026-10-21: a categoria fica fora de `Templates/`, que guarda só a página de comandos e os templates só do Storybook (ADR 0004). Os dados de exemplo ficam em `fixtures/` da story e não vão para o registry |
| D5. Registry | `templateNames` e `templateSources` em `packages/registry/src/manifest.ts`, ao lado dos patterns. O build segue os imports do template e leva os arquivos de patterns, `elements` e `helpers` que ele usa, e os COSS viram `registryDependencies` |
| D6. Destino no consumidor | Alias `templates` no `components.json`, derivado do `ui` como os outros (`@acme/ui` dá `@acme/templates`), com o caminho que o `paths` do tsconfig resolve. O alias e o `paths` só são lidos quando a seleção tem um template, para não quebrar quem só instala patterns. O consumidor importa pela pasta: `@acme/templates/application/shell/app-shell-1` |
| D7. COSS com hook | O instalador aceita item COSS de um arquivo em `registry/default/hooks/<item>.ts`, grava em `<ui>/hooks/<item>.ts` e conta como instalado quando esse arquivo existe. Item com mais arquivos continua recusado |
| D8. API pública | O `index.ts` de cada template entra em `docs/architecture/public-api-exports.json` como `template:<nome>`; o barrel de `parttens` não muda |
| D9. Referência externa | O ReUI orienta só a anatomia (o que cada shell mostra). Nenhum arquivo, classe ou dado do ReUI entra no repositório |

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| Manter o ADR 0004 e distribuir só por `story:source` | o dono pediu instalação pelo registry; `story:source` não instala dependência COSS nem confere tipos no consumidor |
| Família `templates/` dentro de `packages/parttens` | entraria no barrel e no baseline dos patterns, e um shell não é pattern reutilizável sem dono de página; o ADR 0004 já recusou pelo mesmo motivo |
| Template em `apps/storybook/src/templates` lido pelo build | o build só segue imports dentro de `packages/` e o `boundaries:check` não cobre `apps/`; mudar isso abre o build para qualquer arquivo de story |
| Destino no alias `components` do app, como os blocos do shadcn | o `components` do exemplo aponta para `@acme/ui`, então o template cairia entre os componentes COSS; o alias próprio deixa o consumidor apontar para o app (`@/components/templates`) se quiser |
| Cada template autossuficiente, com cópia das peças compartilhadas | quatro shells repetiriam seletor de workspace, menu do usuário, navegação e cabeçalho; o `shared/` do grupo segue com o item e o consumidor recebe uma pasta só por grupo |
| Buscar o JSON do registry Pro do ReUI | pede licença e copiaria código de terceiro |

## Consequences

- **Gains:**
  - o consumidor instala um shell com um comando, com COSS faltante, dependências npm, verificação de tipos e `--dry-run`/`--diff`, como um pattern;
  - o template fica sob `typecheck`, `boundaries:check`, `overrides:check` e `verify:public-api`, que hoje não alcançam `apps/storybook`;
  - o instalador passa a aceitar hooks do COSS, o que destrava o `sidebar` para qualquer pattern futuro.
- **Costs:**
  - um pacote novo no workspace, um alias novo no consumidor e uma entrada a mais no `paths` do tsconfig dele;
  - o CLI ganha um segundo tipo de item; `selectPatterns` passa a separar patterns e templates;
  - um template que importa um pattern leva o pattern junto, e o `index.ts` de patterns do consumidor é regravado com ele.
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| `templates` só importa `parttens`, `elements`, `ui`, `utils` e `helpers`, e ninguém importa `templates` | static | `bun run boundaries:check` |
| Todo template tem item no registry e story sob `Templates/` | unit | `manifest.test.ts` compara `templateSources` com as pastas; `grep -rn "title:" apps/storybook/src/templates` |
| Nenhum template traz tema, `:root`, `.dark`, `@theme` ou `next-themes` | unit | `assertDistributable` e `bun run build:registry` |
| Instalar um template num consumidor sem `sidebar` grava o hook `use-media-query` em `<ui>/hooks/` | integration | `bun run test:consumer:registry` com `app-shell-1` |
| Quem só instala patterns não precisa do alias `templates` | unit | `config.test.ts` sem `@acme/templates/*` no tsconfig |
| Templates passam no axe e no typecheck | component | `bun run storybook:test` e `bun run storybook:typecheck` |

## Not verified

Os dois pontos abertos no rascunho foram medidos em 2026-10-21:

- o `SidebarProvider` em modo móvel roda no `storybook:test` com o viewport `mobile2` (414px), e a story `AppShell1/Mobile` confere a navegação dentro do `Sheet`;
- os tokens `--sidebar-*` do tema de exemplo passam no axe no claro e no escuro, depois de a regra `a { color: inherit }` do tema ir para `@layer base` e de o `AvatarFallback` do menu da conta receber `text-foreground` (razões em `docs/architecture/tc96-parttens.md`, Templates: App Shells).

A instalação dos templates junto com todos os patterns num consumidor passa no `test:consumer:registry` desde 2026-10-21, depois da correção do tipo do `renderPlaceholder` do `rich-text-editor` (TS2322 com os tipos mais novos do Slate que o npm resolve no consumidor), que reprovava a etapa dos patterns já em `HEAD`.
