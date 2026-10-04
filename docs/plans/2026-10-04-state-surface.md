# State Surface: portar `StateSurface` e `StateGuard` do Lemind

Status: pesquisa, planejamento, implementação e validação concluídos em 2026-10-04.

Referência canônica: [arquitetura e decisões](../architecture/tc96-parttens.md).

## Problema

O pedido citava `SurfaceError`, que não existe no Lemind. O estado de erro do Lemind é `StateSurface` com `kind: 'error'`, um de sete kinds, acompanhado de `StateGuard`. O parttens não tem camada de state-surface (`docs/architecture/tc96-parttens.md:74`). Resolvido significa saber o que portar, onde mora e qual é o contrato público.

Escopo: produto (novo export público, reverte a decisão registrada em `tc96-parttens.md:74`), depois arquitetura (lugar, nomes, fronteiras).

## Fatos

Prefixo `L` = `/Users/gabs/Workspaces/c/studio-risine/lemind`.

- F1. `StateSurface` em `L/packages/patterns/src/state-surface.tsx:57-91`; props `kind`, `title`, `description?`, `actions?` (`{label, onPress}[]`), `className?` (`:33-39`).
- F2. Kinds: `empty | no-result | integration-disconnected | sync-pending | error | permission | not-found` (`L/packages/patterns/src/state-kinds.ts:6-13`).
- F3. Compõe COSS `Empty`, ícone lucide e `Button` forçado em `variant='secondary' size='sm'` (`state-surface.tsx:83`); `data-kind` na raiz (`:70`).
- F4. `role="alert"` para error, permission e integration-disconnected; `role="status"` para os demais (`:48-54`); `aria-live` explícito (`:68`); ícone `aria-hidden` (`:75`).
- F5. Tons crus `text-amber-500` e `text-destructive` (`:49-53`).
- F6. `StateGuard` monta os filhos só em `data` e renderiza um bloco de loading sem `Empty` (`:99-123`).
- F7. Fora do genérico: `errorCodeToSurfaceKind` decide quais códigos de backend significam `permission` (`state-kinds.ts:25-39`); `RecordStateSurface` carrega cópia pt-BR e a regra `SGL-003` (`record-state.tsx:23-60`).
- F8. Uso por kind em JSX: `empty` 22, `error` 20, `permission` 18, `no-result` 8, `not-found` 0 direto (só via `record-state.tsx:56`), `sync-pending` 3, `integration-disconnected` 0 (um produtor em `apps/web/src/features/states/index.ts:37`).
- F9. Os 3 usos de `sync-pending` são loading disfarçado; `task-detail-state.tsx:41-44` já o converte em `loading`.
- F10. O parttens exporta `SurfaceStates` (diálogos de confirmar e excluir) em `packages/parttens/src/record-dialog/composition/surface-states/surface-states.tsx:9`.
- F11. O CLI gera um item por entrada de `patternNames` (`packages/registry/src/build-registry.ts:44`); código em `shared/` ou `elements` só é distribuído quando um pattern o importa (`build-registry.ts:50-56`).
- F12. `registryDependencies` contém apenas componentes COSS (`packages/registry/src/manifest.ts:52-53`).
- F13. O `Spinner` do COSS fixa `role="status"` e `aria-label="Loading"` (`packages/ui/src/spinner.tsx:11-13`); `surface-states.tsx:51` o usa com `aria-hidden`.
- F14. Precedente de slot: `actions?: ReactNode` no `RecordDialog` (`packages/parttens/src/record-dialog/AGENTS.md`).

## Decisões

- D1 (dono). Portar `StateSurface` e `StateGuard`, sem regra de negócio.
- D2 (arquitetura, eixo distribuição). Pattern próprio em `packages/parttens/src/state-surface/`, entrada `state-surface` em `patternNames`, com `index.ts`, `core.ts`, `AGENTS.md`, `test/dom.ts` e entrada em `scripts/test-patterns.ts`. `shared/` ou `elements` não seriam instaláveis sem consumidor (F11).
- D3 (arquitetura, eixo contrato). Exports: `StateSurface`, `StateGuard`, `StateSurfaceKind`, `StateGuardState`, `StateSurfaceProps`, `StateGuardProps`. Nenhum export novo com prefixo `Surface*` (F10). Contrato `data-kind` na raiz.
- D4 (design). Cinco kinds: `empty | no-result | error | permission | not-found`. `sync-pending` sai, porque é loading (F9); `integration-disconnected` sai, porque o consumidor o expressa como `error` com ícone próprio (F8).
- D5 (design). Papel fixo por kind: `error` e `permission` com `role="alert"`; `empty`, `no-result` e `not-found` com `role="status"`. Sem `aria-live` explícito, porque o papel já o implica. Sem prop de override.
- D6 (arquitetura, eixo fronteira). `core.ts` sem React: tipos, a tupla `STATE_SURFACE_KINDS` e o mapeamento kind → role. Ícones, classes, `Empty`, `Spinner` e os ramos do guard ficam em `composition/state-surface/` e `composition/state-guard/`.
- D7 (design). Ícone padrão por kind (Inbox, SearchX, AlertTriangle, Lock, FileQuestion); `icon?: ReactNode` substitui e `null` oculta; wrapper `aria-hidden`. Tons só `text-muted-foreground` e `text-destructive` (sem `text-amber-500`, F5). `title` e `description` obrigatórios, sem texto padrão.
- D8 (design). `actions?: ReactNode` dentro de `EmptyContent`, no lugar de `{label, onPress}[]`; o consumidor escolhe a variante do `Button` (F3, F14).
- D9 (design). `StateGuard` aceita `data | loading | StateSurfaceKind`; filhos montam só em `data`; loading é um bloco leve com `role="status"`, `Spinner` com `aria-hidden`, título e descrição opcional (F6, F13); `surface` obrigatório fora de `data`.
- D10 (arquitetura, eixo fronteira). `errorCodeToSurfaceKind` e `RecordStateSurface` ficam fora, nem em `helpers`: nomear erros de API é do consumidor (F7).
- D11 (arquitetura, eixo custo). Adoção em `collection-views` e `record-dialog` é unidade posterior, com aceite próprio.
- D12 (arquitetura). Em `tc96-parttens.md:74`, remover a frase sobre o `StateGuard` não portado, acrescentar o parágrafo de `state-surface/` e esclarecer que "superfícies de estado" do tamanho `small` se refere ao `SurfaceStates`.
- D13 (design). Stories: `Patterns/StateSurface` (Empty, NoResult, Error, Permission, NotFound, CustomIcon) e `Patterns/StateGuard` (Loading, Data, Blocked, provando filhos ausentes do DOM); tema claro e escuro pelo global da toolbar; axe em `error`; play tests para role por kind e clique na ação.

## Lacunas

- G1. Fechada no planejamento: ver D14.
- G2. Contraste não medido para `text-muted-foreground` (4.5:1) e `text-destructive` (3:1 em ícone) no tema de exemplo, claro e escuro. Medido na implementação; vira critério de aceite do Plano.
- G3. Fechada no planejamento: ver D15.
- G4. Fechada no planejamento: ver critério 9 do Plano.
- G5. Hipóteses sem evidência de usuário: `permission` como alert, `not-found` distinto de `no-result` (o Lemind os confunde em `task-detail-state.tsx:12`), nunca duas ações, e loading imediato sem atraso causando flash.
- G6. Inferência: um pattern que importe `state-surface` por caminho recebe os arquivos sem o barrel (`build-registry.ts:40-43`). Risco da adoção posterior (D11), não desta unidade.

## Plano

Gates: produto (D1 e D12 aprovam o novo export e a reversão de `tc96-parttens.md:74`), decomposição (uma Story, uma Task), fronteira (`frontend-developer`), apetite e aceite abaixo. Nenhuma decisão da pesquisa foi reaberta.

### Decisões de planejamento

- D14 (fecha G1). O ramo de loading do `StateGuard` não leva `data-kind`. Motivo: `data-kind` é o contrato dos valores de `StateSurfaceKind` (D3), e loading não é um kind (D4 tirou `sync-pending` justamente por isso). Um `data-kind="loading"` abriria o contrato para um sexto valor sem entrada em `STATE_SURFACE_KINDS`. O bloco leva `data-slot="state-guard-loading"`, que é o gancho de estilo e de teste, e `role="status"` (D9).
- D15 (fecha G3). As classes do Lemind sobre `Empty` e `EmptyTitle` são descartadas na portagem: o pattern usa o `Empty` do COSS como está e só aplica `cn` com `className` do consumidor na raiz. Se a medição de G2 ou a revisão visual obrigar um `className` que sobrescreva borda, raio ou tipografia do COSS, a entrada vai para `scripts/override-exceptions.json` com motivo em português, no mesmo commit. `bun run overrides:check` verde nos dois casos.
- Apetite: lote pequeno, até 2 dias de trabalho. É um teto. Se o contraste (G2) exigir token novo no tema de exemplo ou o `Empty` do COSS não comportar `actions` sem alterar `packages/ui`, o corte dispara: parar e voltar à tabela de decisão (cortar escopo, replanejar ou descartar), sem estender o prazo em silêncio.
- Decomposição: uma Story e uma Task. `StateGuard` depende de `StateSurface` (ramos de `StateSurfaceKind`), a Story só se prova com os dois, e a Task entrega o pattern completo (código, registro, stories, docs) em um merge. Separar stories ou documentação do código daria unidades sem evidência própria. A adoção em `collection-views` e `record-dialog` (D11) fica fora; ver Acompanhamento.

### STORY-STATE-001: mostrar o estado de uma região sem montar o conteúdo bloqueado

Como consumidor do `@tc96/parttens`, quero um `StateSurface` e um `StateGuard` instaláveis, para que eu mostre vazio, sem resultado, erro, permissão e não encontrado com papel de acessibilidade correto e sem montar os filhos enquanto o estado não é `data`.

**Origem:** esta pesquisa (D1 a D13) e as decisões D14 e D15.

**Cenários de aceite**

1. Dado um `StateSurface` com cada um dos cinco kinds, quando ele renderiza, então a raiz tem `data-kind` igual ao kind, `role="alert"` em `error` e `permission`, `role="status"` nos outros três, e nenhum `aria-live` explícito (D3, D5).
2. Dado `kind="error"` sem `icon`, quando renderiza, então o ícone padrão do kind aparece dentro de um wrapper `aria-hidden`; com `icon={<X />}` o ícone do consumidor substitui o padrão; com `icon={null}` nenhum ícone renderiza (D7).
3. Dado `actions={<Button>Tentar de novo</Button>}`, quando o usuário clica no botão, então o `onClick` do consumidor dispara e a variante do botão é a que o consumidor passou, não uma forçada (D8).
4. Dado `StateGuard state="loading"`, quando renderiza, então aparece um bloco `[data-slot="state-guard-loading"]` com `role="status"`, `Spinner` com `aria-hidden`, o título e a descrição opcional, sem `data-kind`, e os filhos não existem no DOM (D9, D14).
5. Dado `StateGuard state="error"` (ou outro kind) com `surface`, quando renderiza, então o `StateSurface` correspondente aparece e os filhos não existem no DOM; com `state="data"` os filhos montam e nenhum estado aparece (D9).
6. Dado o tipo de `StateGuardProps`, quando `state` é diferente de `data`, então omitir `surface` é erro de `tsc` (D9).
7. Dado o tema de exemplo em claro e em escuro, quando o título, a descrição e o ícone de cada kind são medidos, então o texto tem contraste de pelo menos 4.5:1 e o ícone de pelo menos 3:1, com as razões numéricas registradas (G2).
8. Dado `npx @tc96/parttens add state-surface`, quando o registry é gerado, então existe o item `state-surface` com os arquivos do pattern e só dependências COSS em `registryDependencies` (F11, F12).

**Pronto quando**

- A Task abaixo está completa.
- Os cenários 1 a 6 e 8 estão cobertos por teste executável verde; o 7 tem medição numérica registrada na Task, não conferência visual.
- `bun run check` passa, ou cada gate parcial listado na Evidência passa e a diferença está declarada.

#### TASK-STATE-001: criar o pattern `state-surface` com registro, stories e documentação

**Perfil:** `frontend-developer`. **Disciplina:** design system.

**Escopo:** cria o pattern em `packages/parttens/src/state-surface/` no layout de `record-dialog` e `checklist`, sem comentários no código (AGENTS.md raiz). O `StateSurface` e o `StateGuard` seguem D3 a D9; `core.ts` não importa React (D6); `errorCodeToSurfaceKind` e `RecordStateSurface` não entram (D10). Os testes do Lemind são adaptados: a consulta `[data-slot="spinner"]` deixa de existir e passa a `[data-slot="state-guard-loading"]`, mais uma asserção de que o `Spinner` está sob `aria-hidden` (G4).

**Habilita cenários:** 1 a 8 de STORY-STATE-001.

**Superfície**

Criar:
- `packages/parttens/src/state-surface/index.ts` (barrel: `composition/index` e tipos de `core`)
- `packages/parttens/src/state-surface/core.ts` (tipos, `STATE_SURFACE_KINDS`, kind → role)
- `packages/parttens/src/state-surface/composition/index.ts`
- `packages/parttens/src/state-surface/composition/state-surface/{index.ts,state-surface.tsx,state-surface.test.tsx}`
- `packages/parttens/src/state-surface/composition/state-guard/{index.ts,state-guard.tsx,state-guard.test.tsx}`
- `packages/parttens/src/state-surface/test/dom.ts` (cópia do setup JSDOM de `record-dialog/test/dom.ts`)
- `packages/parttens/src/state-surface/AGENTS.md` (seções Map, Dependents, Invariants, Styling, Verify, Pointers, na ordem; referência `properties/AGENTS.md`; só o que `ls`, `grep` e `tsc` não revelam: direção de imports, o contrato `data-kind` e `data-slot`, o motivo de loading não ter `data-kind`, os comandos)
- `apps/storybook/src/patterns/state-surface/state-surface.stories.tsx` (`Patterns/StateSurface`: Empty, NoResult, Error, Permission, NotFound, CustomIcon, com um gêmeo `!dev` `<Story>Interaction` para o play test, como em `record-dialog`)
- `apps/storybook/src/patterns/state-surface/state-guard.stories.tsx` (`Patterns/StateGuard`: Loading, Data, Blocked; o play de Blocked prova filhos ausentes do DOM)

Alterar:
- `packages/registry/src/manifest.ts` (acrescentar `'state-surface'` a `patternNames`)
- `packages/registry/src/manifest.test.ts` (teste de seleção do pattern, no molde de `accepts the migrated checklist pattern`)
- `scripts/test-patterns.ts` (acrescentar `'state-surface'` à lista, em ordem alfabética)
- `packages/parttens/src/index.ts` (`export * from './state-surface/index'`)
- `docs/architecture/public-api-exports.json` (regerar com `bun scripts/verify-public-api.ts --record`; o diff deve conter só os seis exports de D3, e qualquer outro export pendente é citado no resumo)
- `scripts/override-exceptions.json` (somente se D15 exigir)
- `docs/architecture/tc96-parttens.md` (D12: linha 74 e parágrafo do pattern; o doc é em português)
- `README.md` (nova linha na tabela de patterns, em inglês, perto da linha 92)
- `apps/docs/content/docs/installation.mdx` (só se a lista de patterns instaláveis estiver enumerada; a linha 50 hoje cita apenas o checklist como exemplo, então a expectativa é não alterar)

Não tocar: `packages/ui/**`, `collection-views`, `record-dialog`, `packages/helpers`.

**Evidência** (comandos exatos, a partir da raiz)

```bash
bunx biome check packages/parttens/src/state-surface packages/registry/src/manifest.ts packages/registry/src/manifest.test.ts scripts/test-patterns.ts packages/parttens/src/index.ts
bun run typecheck
bun test --isolate packages/parttens/src/state-surface
bun run check:coss && bun run boundaries:check && bun run overrides:check
bun scripts/verify-public-api.ts --record && bun run verify:public-api
bun run test:registry
bun run build:registry
bun run storybook:typecheck && bun run storybook:lint
bun run storybook:test
```

Leituras esperadas:
- `bun test`: zero falhas; um teste por cenário 1 a 6, contagem informada no resumo.
- `verify:public-api`: verde após o `--record`; `git diff docs/architecture/public-api-exports.json` mostra exatamente `StateSurface`, `StateGuard`, `StateSurfaceKind`, `StateGuardState`, `StateSurfaceProps`, `StateGuardProps`.
- `build:registry`: gera o item `state-surface` com os arquivos do pattern e `registryDependencies` só com componentes COSS (cenário 8).
- `storybook:test`: as stories novas passam com `a11y.test` em `error`, nos dois temas.
- Contraste (cenário 7): medir `text-muted-foreground` sobre o fundo da story e `text-destructive` do ícone, em claro e escuro, no tema de `apps/example/packages/ui/src/styles.css`, com as razões numéricas (texto 4.5:1, gráfico 3:1). Registrar no `tc96-parttens.md` junto à decisão de escala. Achado de token é nota para o consumidor, não correção em `packages/ui`. Incluir captura de tela clara e escura de uma story de cada componente.

**Fora desta Task:** adoção em `collection-views` e `record-dialog`; `errorCodeToSurfaceKind` e `RecordStateSurface`; qualquer mudança em `packages/ui`; `sync-pending` e `integration-disconnected` como kinds; atraso anti-flash no loading (G5).

**Pronto quando**

- Cada kind renderiza com o `data-kind` e o `role` de D5, sem `aria-live`.
- `icon` substitui o padrão e `null` o oculta; o wrapper do ícone é `aria-hidden`.
- O clique em `actions` chega ao `onClick` do consumidor, e a variante é a do consumidor.
- O loading do `StateGuard` tem `data-slot="state-guard-loading"`, `role="status"`, nenhum `data-kind`, `Spinner` `aria-hidden`, e os filhos fora do DOM; o mesmo vale para os kinds de erro.
- `surface` ausente fora de `data` não compila.
- `bun run overrides:check` verde; qualquer entrada nova tem motivo em português.
- Todos os comandos da Evidência passam, com as razões de contraste registradas.
- O `AGENTS.md` do pattern tem as seis seções na ordem e não copia props, tipos ou listas de stories.
- `tc96-parttens.md:74` reflete D12.

**Entrega isolada com segurança porque:** só acrescenta um pattern e um item de registry; nenhum arquivo de pattern existente muda, `SurfaceStates` e as telas atuais não são tocados, e os únicos arquivos compartilhados alterados recebem uma linha aditiva.

### Decisões de implementação

- D16 (dono). Ícone via `IconFrame`, `shape="rounded"`, `variant="color"`, `size="xl"`. `error` e `permission` passam `color="var(--destructive)"`, sem classe de fundo; `empty`, `no-result` e `not-found` não passam `color` e usam `bg-muted/60` com o tom padrão. O mapa é `STATE_SURFACE_ICON_COLORS` em `core.ts`.
- D17 (fecha o cenário 7 em escuro). A descrição em escuro mede 4,44:1, abaixo de 4.5:1. Ela é o `EmptyDescription` do COSS sem alteração sobre o `--muted-foreground` do tema de exemplo, então fica como nota de token para o consumidor (`tc96-parttens.md`), sem override no pattern nem mudança no tema nesta unidade.
- D18 (dono). A story `Data` do `StateGuard` foi removida: sem visual próprio, ela só repetia o filho. A montagem em `data` segue coberta pelo teste unitário do cenário 5.
- D19 (planejamento, achado da validação). O cenário 8 passa a exigir teste executável do item construído: o item `state-surface` existe, `registryDependencies` só tem componentes COSS e os arquivos incluem `elements/src/icon-frame.tsx`. A Task pedia só o teste de seleção em `manifest.test.ts`, abaixo do "Pronto quando" da Story.

### Acompanhamento (fora deste plano)

- Adoção de `StateSurface` e `StateGuard` em `collection-views` e `record-dialog` (D11), com aceite próprio. Antes dela, decidir como o item de registry trata o import por caminho sem o barrel (G6).
- Avaliar com uso real `permission` como alert, `not-found` distinto de `no-result` e o flash do loading imediato (G5).

## Envelope

```yaml
pilar: validacao
resultado: aprovado por revisão independente após uma rodada de correção (achados 1 a 4 fechados)
artefato: branch feat/state-surface
evidencia: bun run check verde (13 etapas, 296 testes de story com axe no tema claro, 0 falhas, 0 pulados), test:registry 27, bun test state-surface 21, vitest storybook state-surface 12
decisoes: [D16, D17, D18, D19]
lacunas: [G5 (#60), G6 (#59), axe só no tema claro (#58), contraste escuro da descrição (#57)]
proximo: fechado tecnicamente; push e PR com o dono
```
