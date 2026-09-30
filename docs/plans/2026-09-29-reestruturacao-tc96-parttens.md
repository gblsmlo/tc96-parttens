# TC96 Parttens Implementation Plan

> Para Codex: usar a skill `executing-plans` ao executar este plano, seguindo as etapas e os critérios de aceite. Implementação ainda não iniciada.

**Goal:** reorganizar o TC96 em pacotes internos por responsabilidade, preservando sua API e oferecendo biblioteca versionada e fontes instaláveis pelo shadcn.

**Architecture:** monorepo com `ui`, `parttens`, `utils` e `registry`, mais Storybook e docs. Uma implementação canônica gera a biblioteca e o registry; um CLI fino delega a instalação ao shadcn.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Base UI e Bun no desenvolvimento. CLI compatível com Node/npm, sem exigir Bun no consumidor.

---

Status: plano em revisão. Caminhos abaixo são relativos ao novo workspace `/Users/gabs/Workspaces/tc96-parttens`. Comandos de validação indicam contratos a criar; não são scripts já disponíveis.

Referência canônica: [arquitetura e decisões](../architecture/tc96-parttens.md).

## Task 1: inventariar a base e fixar o contrato de compatibilidade

**Files:** criar `docs/architecture/public-api-baseline.md` e `docs/architecture/migration-map.md`.

1. Ler exports, tipos, registry e testes de `/Users/gabs/Workspaces/c/gabriel-melo/tc96/tc96/packages/tc96`.
2. Mapear `src/shared/ui` para `packages/ui/src`, `src/shared/utils` para `packages/utils/src` e cada feature para `packages/parttens/src`.
3. Inventariar as cópias de primitives por feature e suas diferenças de props, estilos e comportamento. Não unificar somente por semelhança do nome.
4. Registrar imports e props a preservar, incluindo `Kanban` como alias existente e entradas legadas do registry no escopo.
5. Listar usos de APIs do navegador, operações locais de dados e conflitos entre exports dos padrões.

**Acceptance:** todo export atual tem destino ou exclusão explícita. Filter Builder é a única exclusão de catálogo autorizada. Não alterar os projetos de referência.

## Task 2: provar instalação em monorepo pelo shadcn

**Files:** criar `packages/registry/fixtures/consumer-monorepo/`, `packages/registry/fixtures/items/` e `docs/architecture/installation-contract.md`.

1. Criar um consumidor temporário com `packages/patterns`, UI em destino personalizado e aliases próprios.
2. Gerar dois itens mínimos do registry com dependência compartilhada e instalar pelo CLI oficial do shadcn.
3. Verificar destinos, imports, instalação conjunta e comportamento diante de arquivos existentes.
4. Provar como o adaptador apresenta diferenças e preserva arquivos; documentar quais partes são fornecidas pelo shadcn e quais exigem pré-verificação do produto.
5. Fixar a versão testada do instalador e registrar limites. Não depender de APIs internas sem contrato.

**Acceptance:** prova real dos destinos acordados antes de construir o CLI completo. Se o instalador não atender um requisito, revisar o desenho, sem criar silenciosamente um instalador paralelo.

Referências oficiais: [registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json), [monorepo](https://ui.shadcn.com/docs/monorepo) e [CLI](https://ui.shadcn.com/docs/cli).

## Task 3: criar workspaces e fronteiras

**Files:** criar `package.json`, `biome.json`, `tsconfig.base.json`, `packages/{ui,parttens,utils,registry}/package.json`, os respectivos `tsconfig.json` e `scripts/check-boundaries.ts`.

1. Criar workspaces e escolher nomes internos `@tc96/*`, privados.
2. Centralizar configurações comuns, mantendo responsabilidades claras por pacote.
3. Declarar dependências nas unidades que as usam; manter React e Base UI coerentes para evitar múltiplas instâncias.
4. Configurar checagem das direções de imports e ciclos.

**Validation:** `bun install`, `bun run boundaries:check` e `bun run typecheck`.

**Acceptance:** workspaces resolvem imports internos sem depender do futuro pacote público; nenhuma dependência de UI ou padrões aponta para registry.

## Task 4: migrar utils e unificar UI

**Files:** criar `packages/utils/src/index.ts`, `packages/ui/src/index.ts` e mover módulos identificados pelo mapa da Task 1.

1. Migrar utilitários puros preservando resultados e assinaturas.
2. Comparar primitives compartilhadas com as cópias locais, usando a matriz de diferenças.
3. Consolidar componentes compatíveis; manter adaptações específicas explicitamente nomeadas quando necessárias para preservar contratos.
4. Configurar estilos/tokens e instruções de inclusão do CSS/Tailwind para consumidores npm e fontes locais.
5. Adaptar testes existentes; acrescentar cobertura apenas para diferenças comportamentais relevantes.

**Validation:** `bun run typecheck`, `bun run test:ui` e, após migrar o app, `bun run storybook:test`.

**Acceptance:** os padrões usam a UI canônica; nenhum comportamento público é removido para eliminar duplicação.

## Task 5: migrar padrões sem alterar comportamento

**Files:** criar `packages/parttens/src/{collection-views,properties,detail-sheet,editable}/` e `packages/parttens/src/index.ts`.

1. Migrar primeiro properties e collection views, depois detail sheet e editable.
2. Substituir aliases locais da base por imports dos workspaces.
3. Preservar componentes, hooks e tipos; resolver conflitos de nomes no barrel por reexports explícitos.
4. Portar testes existentes e exemplos que exercitam contratos reais.
5. Remover referências a Filter Builder dos artefatos do novo produto.

**Validation:** `bun run typecheck`, `bun run test:patterns` e `bun run boundaries:check`.

**Acceptance:** API inventariada continua válida, exceto Filter Builder. A migração estrutural não inclui melhorias do Lemind ainda não avaliadas.

## Task 6: acrescentar grupos preparados pelo consumidor

**Files:** modificar `packages/parttens/src/collection-views/types/collection.ts`, os pontos de projeção identificados e seus testes próximos.

1. Especificar a entrada opcional e sua precedência, reutilizando tipos existentes quando adequados.
2. Escrever testes que demonstrem o contrato antigo e o novo, incluindo grupos vazios, contagens e IDs estáveis.
3. Implementar a entrada preparada sem executar `projectCollection` nesse caminho.
4. Usar a mesma renderização para ambos os caminhos; manter a projeção antiga como compatibilidade.
5. Documentar que permissões, persistência, filtro, ordenação e paginação pertencem à aplicação.

**Validation:** `bun run test:patterns`, `bun run typecheck` e histórias dos dois contratos.

**Acceptance:** agrupamento legado continua funcionando; o novo contrato não infere grupos nem modifica os dados fornecidos.

## Task 7: gerar a biblioteca pública

**Files:** criar `scripts/build-library.ts`, `scripts/verify-public-api.ts`, `tests/consumer-library/` e saídas geradas em `dist/library/`.

1. Gerar manifest e ESM/tipos a partir dos workspaces privados, sem acrescentar um quinto pacote de fontes.
2. Expor `./parttens`, `./ui`, `./utils`, `./components` e `./blocks`; incluir entradas legadas de registry ainda válidas.
3. Evitar dependências publicadas em pacotes privados `@tc96/*` e cópias múltiplas dos contextos React.
4. Verificar tree shaking e preservar diretivas de componentes cliente quando necessárias.
5. Empacotar localmente e instalar em consumidor temporário, validando imports e tipos pelo artefato real.

**Validation:** `bun run build:library`, `bun run verify:public-api` e `bun run test:consumer:npm`.

**Acceptance:** os imports públicos resolvem sem conhecimento da estrutura do workspace. Nome npm definitivo precisa ser resolvido antes de publicação; não publicar durante a migração.

## Task 8: gerar registry e CLI fino

**Files:** criar `packages/registry/src/{manifest,build-registry,cli,check-compatibility}.ts`, testes próximos e saídas em `dist/registry/` e `dist/cli/`.

1. Gerar itens para collection views, properties, detail sheet e editable usando o contrato comprovado na Task 2.
2. Resolver dependências transitivas e compartilhadas a partir dos fontes canônicos.
3. Implementar `add <patterns...>` com configuração de destinos e aliases, delegando instalação ao shadcn.
4. Validar nomes de padrões, destinos e configuração antes de invocar o instalador. Preservar prompts e saída de falhas.
5. Apresentar conflitos, preservar por padrão e solicitar confirmação antes de sobrescrever.
6. Verificar exports e tipos exigidos pela UI, distinguindo incompatibilidade de verificação inconclusiva; não prometer equivalência visual.
7. Gerar o artefato npm executável proposto `tc96-parttens`, sem exigir Bun no consumidor. Registrar a relação de versões entre CLI e biblioteca.

**Validation:** `bun run build:registry`, `bun run test:registry` e `bun run test:consumer:registry`.

**Acceptance:** instalação individual/conjunta funciona com aliases personalizados; falhas não são apresentadas como sucesso; correções locais continuam manuais.

## Task 9: migrar apps e validar SSR/desempenho

**Files:** criar `apps/storybook/`, `apps/docs/`, `tests/consumer-ssr/` e `docs/architecture/performance-scenarios.md`.

1. Migrar as apps do TC96 anexado, consumindo exclusivamente entradas públicas da biblioteca.
2. Acrescentar histórias relevantes para grupos preparados, foco, teclado, edição e arraste.
3. Usar TanStack Start como consumidor SSR inicial, por proximidade com o Lemind; validar separadamente Next.js se for declarado como ambiente testado.
4. Exercitar renderização e hidratação; identificar código browser-only e fronteiras cliente.
5. Medir cenários reproduzíveis com milhares de itens por view. Definir metas com base nas medições antes de otimizar.
6. Verificar virtualização, seleção, scroll e arraste; corrigir limitações sem ampliar o escopo para responsividade.

**Validation:** `bun run storybook:test`, `bun run docs:build`, `bun run test:consumer:ssr` e `bun run bench:views`.

**Acceptance:** documentar ambientes testados e resultados mensuráveis; não inferir compatibilidade com todos os frameworks de um único consumidor.

## Task 10: concluir documentação e verificar distribuição

**Files:** criar `README.md`, `docs/plans/migration-checklist.md` e adaptar `apps/docs/content/docs/installation.mdx`.

1. Documentar biblioteca versus fontes locais, destinos, aliases, exemplos, SSR e incorporação manual de correções.
2. Explicitar a exclusão do Filter Builder e os limites da verificação de compatibilidade.
3. Executar `bun run check` e `bun run release:check`, criados para reunir os gates anteriores e inspecionar os tarballs.
4. Registrar resultados, limitações e nomes npm definitivos antes de qualquer publicação externa.

**Acceptance:** tarballs e registry usam a mesma versão de fontes; documentação representa comandos demonstrados em consumidores reais.

## Fora deste plano

Responsividade, Filter Builder, landing page, atualizações automáticas dos fontes, migração do Lemind, publicação npm e deploy externo. Nenhuma dessas ações é necessária para validar a arquitetura localmente.
