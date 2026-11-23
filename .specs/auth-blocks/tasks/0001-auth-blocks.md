---
capability: auth-blocks
plan: 0001
owner: dono
status: Draft (o texto espera a revisão do dono)
date: 2026-11-22
issue: none
branch: um PR por entrega (dono, 2026-11-22): `feat/auth-blocks-foundation` para a fase 1, depois um PR por block (fases 2 a 6, na ordem decidida); o polimento (fase 7) vai no PR do último block (proposed)
inputs: requirements.md (Draft, 2026-11-22); design.md (Draft, 2026-11-22); AGENTS.md (raiz); packages/blocks/AGENTS.md; .specs/flow-editors/tasks/0001-flow-editors.md (só formato de referência)
---

### Inputs

| Arquivo | Situação |
| --- | --- |
| `.specs/auth-blocks/requirements.md` | Draft; fonte dos CAP-1 a CAP-7 e dos AC-1.1 a AC-11.4 |
| `.specs/auth-blocks/design.md` | Draft; contrato, peças compartilhadas, invariantes e testes |
| `AGENTS.md` (raiz) | regras de código, Storybook, `bun test`, registry e API pública |
| `packages/blocks/AGENTS.md` | como blocks são registrados, testados e documentados |
| `.specs/flow-editors/tasks/0001-flow-editors.md` | não é fonte; só formato de referência |

O plano sai em sete fases de bloco e uma de decisões. As decisões de produto de T0 a T3 e de T5 a T8 estão fechadas (dono, 2026-11-22); T4 (link mágico fora) e T11 (métricas confirmadas) também foram fechadas; T9 (validação do `Form`) e T10 (leitura dos componentes) ficaram com o implementador da fundação, por delegação do dono, e estão gravadas em `design.md` (2026-11-22). As tarefas que não esperam decisão começam já: `renderAnchor` em `ui` e a troca dos dois `render-link.tsx`, e as peças compartilhadas do grupo `auth` que não dependem de decisão pendente.

### Sessões de execução

Pedido do dono: a execução roda em sessões com modelos mais baratos. Cada sessão nasce `fresh`, lê os arquivos da coluna "Lê" antes de tocar em código e não muda arquivo de outra fase; se precisar, registra em **Registro da execução** e devolve.

Agentes que escrevem código não rodam `tsc`, `vitest`, Storybook nem `bun test`. Cada tarefa diz quem roda cada comando: a sessão principal (revisor) roda `typecheck`, `bun test` e as checagens de script; o CI roda os plays do Storybook.

| Fase | Modelo | Lê | Entrega |
| --- | --- | --- | --- |
| 0 · Decisões pendentes | dono; T10 em Sonnet 5.5 (leitura dos componentes) | `requirements.md`, `design.md`, `AGENTS.md` (raiz) | todas fechadas; T9 e T10 gravadas em `design.md` §5.2 e §3 (2026-11-22) |
| 1 · Setup e fundação | Sonnet 5.5 | `AGENTS.md` (raiz), `packages/blocks/AGENTS.md`, `design.md` §3 e §4.1, os dois `render-link.tsx` | `renderAnchor` em `ui`, troca nos dois grupos, `shared/` do `auth` |
| 2 · login-1 | Sonnet 5.5 | os mesmos, `design.md` §4.2, §5, §9; `requirements.md` US-2, US-3, US-7, US-9, US-10, US-11 | `login-1` com stories, registro e baseline |
| 3 · otp-1 | Sonnet 5.5 | os mesmos, `design.md` §4.6; `requirements.md` US-6 | `otp-1` com stories, registro e baseline |
| 4 · signup-1 | Sonnet 5.5 | os mesmos, `design.md` §4.3, §4.1; `requirements.md` US-4, US-9 | `signup-1` com stories, registro e baseline |
| 5 · reset-password-1 | Sonnet 5.5 | os mesmos, `design.md` §4.5; `requirements.md` US-5, US-9 | `reset-password-1` com stories, registro e baseline |
| 6 · forgot-password-1 | Sonnet 5.5 | os mesmos, `design.md` §4.4; `requirements.md` US-5 | `forgot-password-1` com a confirmação `sent`, stories, registro e baseline |
| 7 · Polish | Sonnet 5.5 | `packages/blocks/AGENTS.md`, `design.md` §9 a §11 | AGENTS do grupo, páginas `Doc`, catálogo, README, gate |

---

### Fase 0 · Decisões pendentes

Tarefas de decisão: não têm modelo de código. Cada uma fecha uma lacuna do PRD e do design; a tarefa termina quando a decisão está escrita no lugar do marcador `[GAP: ...]`, nos dois documentos. Quem decide está entre parênteses. As tarefas marcadas `[x]` foram decididas pelo dono em 2026-11-22 e gravadas nos dois documentos; a linha "Decisão" de cada uma é o registro.

- [x] T0 [AC-4.3, AC-4.5] Decidir se o aceite dos termos e da privacidade é caixa de seleção obrigatória ou só links (dono) — `requirements.md` §9; `design.md` §4.3 e §12
  - Depende de: none
  - Afeta: T26
  - Decisão (2026-11-22): só links, no texto "Ao criar a conta você concorda com…" com os links que o consumidor passa; sem caixa de aceite e sem valor extra em `onSubmit`. Gravada em `requirements.md` §1 e AC-4.3/AC-4.5 e em `design.md` §4.3.
- [x] T1 [AC-7.2, AC-10.3] Decidir se o login identifica só por e-mail ou também por nome de usuário (dono) — `requirements.md` §4 e §9; `design.md` §4.2
  - Depende de: none
  - Afeta: T20
  - Decisão (2026-11-22): só por e-mail (proposta mantida pelo dono em 2026-11-22). Gravada em `requirements.md` AC-10.3 e em `design.md` §4.2; o `autoComplete="username"` do campo segue proposto.
- [x] T2 [AC-4.2, AC-9.4, AC-9.6] Decidir o valor padrão de `passwordMinLength` (proposta 8) (dono) — `design.md` §4.3 e §12
  - Depende de: none
  - Afeta: T26, T29
  - Decisão (2026-11-22): o padrão é 8 (proposta mantida pelo dono em 2026-11-22), o mesmo número do retorno "n de N caracteres". Gravada em `requirements.md` AC-4.2/AC-9.4 e em `design.md` §4.1, §4.3 e §4.5.
- [x] T3 [AC-5.1, AC-5.4, AC-5.5, AC-5.6, AC-5.7] Decidir como `forgot-password-1` mostra a confirmação "e-mail enviado" (uma prop de estado do consumidor ou troca de página) (dono) — `design.md` §4.4
  - Depende de: none
  - Afeta: T31
  - Decisão (2026-11-22): prop booleana `sent`; com ela verdadeira o block troca o formulário por uma confirmação no mesmo Card, com link de volta ao login e opção de reenviar. Os nomes `onResend`, `resendIn`, `destination`, os rótulos, o foco no título e o botão de reenvio só com `onResend` são propostos. Gravada em `requirements.md` US-5 e em `design.md` §4.4.
- [x] T4 [—] Decidir se o fluxo de link mágico fica fora ou dentro desta entrega (dono) — `requirements.md` §4 e §9; `design.md` §2 e §12
  - Depende de: none
  - Afeta: escopo do plano; se entrar, o plano ganha um bloco e uma fase nova (proposed); sem decisão, o plano segue com os cinco blocks
  - Pronto quando: a decisão está em `requirements.md` §4 ("Fora do escopo" ou "Primeira entrega"). Quem roda: sessão principal, `grep -n "link mágico" .specs/auth-blocks/requirements.md` sem `[GAP`.
  - Decisão (2026-11-22): o link mágico fica fora desta entrega. Gravada em `requirements.md` §4 e em `design.md` §2.
- [x] T5 [—] Decidir quantas variações por block entram no primeiro PR (uma de cada, como proposto, ou também as `-2`) (dono) — `requirements.md` §4
  - Depende de: none
  - Afeta: T34 e o número de fases de bloco; as `-2` são candidatas fora desta entrega
  - Decisão (2026-11-22): uma variação por block; as `-2` seguem candidatas (proposta mantida pelo dono em 2026-11-22). Gravada em `requirements.md` §1 e §4.
- [x] T6 [AC-8.1] Decidir a documentação: as seis páginas (API Reference, Playground, Stories, Behavior, Usages, Layouts) ou a página `Doc` que os app shells usam (dono) — `requirements.md` §9; `design.md` §11
  - Depende de: none
  - Afeta: T20, T23, T26, T29, T31 (a estrutura das stories) e T34
  - Decisão (2026-11-22): uma página `Doc` por block, como `AppShell1` a `AppShell4` e os editores de fluxo; as seis páginas não se aplicam. Gravada em `requirements.md` AC-8.1 e em `design.md` §11.
- [x] T7 [—] Decidir a ordem de entrega dos blocks (dono) — `requirements.md` §5 e §9
  - Depende de: none
  - Afeta: a ordem das fases 2 a 6
  - Decisão (2026-11-22): `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1` (proposta mantida pelo dono em 2026-11-22). Gravada em `requirements.md` §4 e §5; a seção Ordem deste plano a repete.
- [x] T8 [AC-11.1, AC-11.2, AC-11.3, AC-11.4] Decidir se a página renderiza o landmark `main`, se centraliza na altura da janela (`min-h-svh`) ou só desenha o Card, e a posição do `logo` (acima do Card ou no cabeçalho dele) (dono) — `design.md` §9 e §10, §12
  - Depende de: none
  - Afeta: T16 (moldura `AuthCard`)
  - Decisão (2026-11-22): o block renderiza a página inteira: o `main`, a centralização vertical na janela e o `logo` acima do Card; o consumidor só monta o block na rota. A classe `min-h-svh` e o respiro nas bordas são propostos. Gravada em `requirements.md` US-11 e em `design.md` §4.1, §9 e §10.
- [x] T9 [AC-7.3, AC-2.4] Decidir se a validação usa a do `Form` do Base UI (`errors`, modo de validação) ou `noValidate` com estado próprio para o foco no primeiro campo inválido (o implementador da fundação, por delegação do dono em 2026-11-22; volta ao dono se mudar o contrato) — `design.md` §5.2 e §12
  - Depende de: none
  - Afeta: T19 (hook de foco) e os blocks com `fieldErrors`; se a escolha for o `Form`, o hook fica só com o que o `Form` não cobre
  - Pronto quando: a escolha está em `design.md` §5.2 e o marcador some. Quem roda: sessão principal, `grep -n "validação do" .specs/auth-blocks/design.md` sem `[GAP`.
  - Decisão (2026-11-22, implementador da fundação, PR #441): o `Form` do Base UI valida; o hook cobre só o `Alert` e os erros sem envio; `errors` vai memoizado. Gravada em `design.md` §5.2. Feito no PR #441.
- [x] T10 [—] Ler os componentes do COSS em `packages/ui/src` e anotar as props do `OTPField` do Base UI (tamanho do código, valor, evento de conclusão) e os nomes de `Input`, `Button`, `Alert` e `Checkbox` (implementador, Sonnet 5.5; a decisão é do implementador ao ler) — `design.md` §3 e §12
  - Depende de: none
  - Afeta: T16, T17, T18, T20, T23, T31 e a caixa "lembrar de mim" de T20
  - Pronto quando: `design.md` §3 traz os nomes e as props lidos, com o caminho do arquivo de cada um, e o marcador some. Quem roda: sessão principal, `grep -n "OTPField" .specs/auth-blocks/design.md` sem `[GAP`; e `bun run check:coss` exit 0 (não muda `ui` nesta tarefa).
  - Decisão (2026-11-22, implementador da fundação, PR #441): nomes e props de `Input`, `Button`, `Alert`, `Checkbox` e `OTPField` lidos. Gravada em `design.md` §3. Feito no PR #441.
- [x] T11 [—] Definir métricas e metas dos objetivos OBJ-1 a OBJ-4, ou confirmar que os quatro bastam (dono) — `requirements.md` §3
  - Depende de: none
  - Afeta: T36 (medição final)
  - Pronto quando: a tabela de objetivos em `requirements.md` §3 traz a métrica e a meta confirmadas pelo dono, e o marcador some. Quem roda: sessão principal, `grep -n "métricas" .specs/auth-blocks/requirements.md` sem `[GAP`.
  - Decisão (2026-11-22): os quatro objetivos e as metas propostas bastam. Gravada em `requirements.md` §3.

---

### Fase 1 · Setup e fundação

Só o que todo bloco precisa: `renderAnchor` em `ui`, a troca nos dois grupos existentes e as peças comuns do `auth/shared/`. Nada aqui é block.

- [x] T12 [AC-3.2, AC-3.4] Criar `renderAnchor` como item próprio de `ui` (`origin: "own"`), com o tipo `RenderLink` (nome do arquivo e do export propostos) — `packages/ui/src/render-anchor.tsx` (proposed); `packages/ui/ui.manifest.json`
  - Depende de: none
  - Pronto quando: o arquivo exporta `renderAnchor` e `RenderLink` com o `biome-ignore` de `render-link.tsx` preservado; o item está em `ui.manifest.json` com `origin: "own"`. O import `@tc96/ui/render-anchor` funciona pela regra existente `"./*": "./src/*.tsx"`, sem mudar `packages/ui/package.json`. Quem roda: sessão principal, `bun run check:coss && bun run typecheck && bunx biome check packages/ui/src/render-anchor.tsx` exit 0.
  - Feito no PR #441.
- [x] T13 [P] [AC-3.4] Trocar os dois `render-link.tsx` locais pelo `renderAnchor` de `ui`; manter `ShellRenderLink` e `FlowRenderLink` como aliases do grupo — `packages/blocks/src/application/shell/shared/render-link.tsx`, `packages/blocks/src/ai-agents/flow/shared/render-link.tsx` e os tipos de cada `shared/`
  - Depende de: T12
  - Pronto quando: nenhum dos dois grupos define `renderAnchor` próprio; os blocks de `shell` e de `flow` seguem verdes. Quem roda: sessão principal, `grep -rn "function renderAnchor" packages` tem uma só linha (em `packages/ui`), `bun run boundaries:check && bun run typecheck` exit 0, `bun test --isolate packages/registry/src` exit 0. CI, `cd apps/storybook && bunx vitest run --project=storybook --maxWorkers=2 src/blocks/application/shell src/blocks/ai-agents/flow` com todos os plays e o axe sem violação.
  - Feito no PR #441.
- [x] T14 [P] [AC-3.1, AC-3.2] Criar os tipos e os rótulos comuns de `application/auth/shared/`: `AuthRenderLink`, `AuthProvider`, `AuthFieldErrors`, `AuthPasswordSuggestion`, `AuthCommonLabels`, `AuthNewPasswordLabels`, `AuthBaseProps` e `resolveAuthLabels` (labels parcial somada aos padrões pt-BR) — `packages/blocks/src/application/auth/shared/types.ts`, `packages/blocks/src/application/auth/shared/labels.ts`
  - Depende de: T12
  - Pronto quando: o `resolveAuthLabels` junta `labels` parcial aos padrões; os tipos seguem `design.md` §4.1; nenhum label específico de bloco entra aqui. Quem roda: sessão principal, `bun run typecheck` e `bunx biome check packages/blocks/src/application/auth/shared` exit 0.
  - Feito no PR #441.
- [x] T15 [P] [AC-9.5, AC-9.6] Criar `getPasswordSuggestions(password, suggestions)`, função pura que devolve quais tipos sugeridos a senha já tem (minúscula, maiúscula, número, símbolo), com teste em `bun test` — `packages/blocks/src/application/auth/shared/password-suggestions.ts`, `password-suggestions.test.ts`
  - Depende de: T14
  - Pronto quando: o teste cobre senha vazia, cada tipo isolado, lista vazia de sugestões e a senha com todos os tipos; a função não importa React. Quem roda: sessão principal, `bun test --isolate packages/blocks/src/application/auth` exit 0.
  - Feito no PR #441.
- [x] T16 [P] [AC-11.1, AC-11.2, AC-11.3, AC-11.4] Montar `AuthCard` (nome proposto; pode virar `AuthPage` se a moldura da página e o Card se separarem) como a moldura da página inteira: o landmark `main`, a centralização vertical na altura da janela (`min-h-svh`, classe proposta), o `logo` acima do Card e, dentro do Card do COSS, título em `h1` por `render`, descrição, mensagem do formulário, conteúdo e rodapé; sem override de borda, raio ou sombra — `packages/blocks/src/application/auth/shared/auth-card.tsx`
  - Depende de: T14
  - Bloqueada por: T10
  - Pronto quando: `AuthCard` monta com o `main`, a centralização e o `logo` acima do Card, fora dele (sem `logo`, nada é renderizado no lugar), e `error` aparece num `Alert` com `role="alert"` (o play de login-1, T21, prova o comportamento). Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/shared` exit 0; `bun run overrides:check` exit 0 sem entrada nova.
  - Feito no PR #441.
- [x] T17 [P] [—] Montar `AuthProviders` (botões de provedores com `icon` e `label` e o separador) e o `onProviderSelect(id)` — `packages/blocks/src/application/auth/shared/auth-providers.tsx`
  - Depende de: T14
  - Bloqueada por: T10
  - Pronto quando: sem `providers` não renderiza botão nem separador; com eles, cada botão chama `onProviderSelect(id)` (o play de login-1, T20, prova). Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/shared` exit 0.
  - Feito no PR #441.
- [x] T18 [—] Montar `AuthPasswordField` (campo com o botão de mostrar/ocultar, `type="button"`, nome acessível de `labels`) e `AuthPasswordFeedback` (retorno sobre o número de caracteres e os tipos sugeridos, `aria-describedby`, `aria-live="polite"` só na mudança de condição) — `packages/blocks/src/application/auth/shared/auth-password-field.tsx`, `packages/blocks/src/application/auth/shared/auth-password-feedback.tsx`
  - Depende de: T14, T15
  - Bloqueada por: T10
  - Pronto quando: o campo começa oculto e alterna sem mudar o valor nem enviar; o retorno usa `getPasswordSuggestions` e mostra o estado de cada sugestão em texto. Os plays que provam estão em T21 (mostrar/ocultar) e em T27 (retorno). Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/shared` exit 0.
  - Feito no PR #441.
- [x] T19 [P] [—] Criar o hook de foco no primeiro campo inválido, ou só o que a validação do `Form` do Base UI não cobrir (se T9 escolher o `Form`) — `packages/blocks/src/application/auth/shared/use-focus-first-invalid.ts` (proposed)
  - Depende de: T14
  - Bloqueada por: T9
  - Pronto quando: o hook move o foco ao primeiro campo com erro, ou ao `Alert` quando não há campo, quando `fieldErrors` ou `error` passam de vazios a preenchidos (o play de login-1, T21, prova). Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/shared` exit 0.
  - Feito no PR #441.

---

### Fase 2 · Bloco `login-1`

Primeiro bloco: fixa o contrato comum de `onSubmit`, `pending`, `error`, `fieldErrors`, `renderLink` e `labels` que os outros seguem. A pasta tocada é só `packages/blocks/src/application/auth/login-1/` (mais as stories e o registro do item).

- [x] T20 [AC-2.1, AC-2.2, AC-2.5, AC-7.2, AC-7.4, AC-10.1, AC-10.2, AC-10.3, AC-8.1, AC-8.2] Montar `login-1` com e-mail (só e-mail, sem nome de usuário), senha (com mostrar/ocultar), caixa "lembrar de mim" e envio: `onSubmit({ email, password, remember })`, `pending` desabilita o envio e marca `aria-busy` — `packages/blocks/src/application/auth/login-1/`; `apps/storybook/src/blocks/application/auth/login-1.stories.tsx` (`Blocks/Application/Auth/Login1`)
  - Depende de: T16, T17, T18
  - Bloqueada por: T10
  - Pronto quando: a story tem `play` de envio com os três valores, de `pending` e de Enter, com `remember` em `false` quando a caixa está desmarcada; o `play` tem axe. Quem roda: sessão principal, `bun run typecheck && bun run storybook:typecheck && bunx biome check packages/blocks/src/application/auth/login-1 apps/storybook/src/blocks/application/auth` exit 0. CI, `cd apps/storybook && bunx vitest run --project=storybook --maxWorkers=2 src/blocks/application/auth/login-1` com todos os plays e zero violação de axe.
  - Feito neste PR (fase 2, `feat/auth-login-1`).
- [x] T21 [AC-2.3, AC-2.4, AC-3.1, AC-3.2, AC-3.3, AC-7.1, AC-7.3, AC-7.5, AC-7.6, AC-9.1, AC-11.1, AC-11.3] Completar `login-1` com erros de campo e de formulário, links de recuperação e de cadastro só quando o `href` chega, foco no primeiro campo inválido, labels em pt-BR e a prova da moldura da página (um `main`, `logo` acima do Card e fora dele; a story usa `parameters.layout: 'fullscreen'` (proposed)) — `packages/blocks/src/application/auth/login-1/`; `apps/storybook/src/blocks/application/auth/login-1.stories.tsx`
  - Depende de: T20, T19
  - Pronto quando: os plays cobrem erro de campo ligado por `aria-invalid`, o `Alert` de `error`, o foco no primeiro campo inválido, os links que renderizam por `renderLink`, o botão de mostrar/ocultar que alterna o tipo do campo e o nome acessível sem enviar, e a moldura (um `main`, `logo` acima do Card); zero violação de axe no claro e no escuro (AC-7.5). Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/login-1` exit 0. CI, `bunx vitest run --project=storybook --project=storybook-dark --maxWorkers=2 src/blocks/application/auth/login-1`.
  - Feito neste PR (fase 2, `feat/auth-login-1`).
- [x] T22 [AC-1.1, AC-1.2, AC-1.3, AC-1.4, AC-8.3] Registrar `login-1` no registry e no baseline da API pública: entrada `login-1` em `blockNames` e `blockSources`, caso em `manifest.test.ts` que confere o item (só `application/auth`, `helpers` e as dependências de `ui`: COSS e `render-anchor`), e a entrada `block:login-1` em `docs/architecture/public-api-exports.json` — `packages/registry/src/manifest.ts`, `packages/registry/src/manifest.test.ts`, `docs/architecture/public-api-exports.json`
  - Depende de: T21
  - Depende de (externo): PR #438 (`blockNames`, `blockSources`, `isBlock` e o alias `blocks`), que entra em separado deste plano
  - Pronto quando: o item leva os arquivos do grupo `auth` e de `ui` de que depende, sem arquivo fora deles; `block:login-1` está no baseline. Quem roda: sessão principal, `bun test --isolate packages/registry/src` exit 0; `bun scripts/verify-public-api.ts --record` e depois `bun run verify:public-api` exit 0; `bun run boundaries:check` exit 0 (nenhum block importa outro).
  - Feito neste PR (fase 2, `feat/auth-login-1`): `manifest.ts` e `manifest.test.ts`; o baseline `block:login-1` é gravado pela sessão principal na revisão (`bun scripts/verify-public-api.ts --record`).

---

### Fase 3 · Bloco `otp-1`

Não tem campo de senha. A pasta tocada é só `packages/blocks/src/application/auth/otp-1/`.

- [x] T23 [AC-6.1, AC-6.4, AC-6.5, AC-7.2, AC-8.1, AC-8.2] Montar `otp-1` com `OTPField` de `length` dígitos (padrão 6), botão "Verificar" sempre visível e `onSubmit({ code })` só por ele ou por Enter; `onComplete(code)` notifica quando o código fica completo, sem enviar — `packages/blocks/src/application/auth/otp-1/`; `apps/storybook/src/blocks/application/auth/otp-1.stories.tsx` (`Blocks/Application/Auth/Otp1`)
  - Depende de: T16
  - Bloqueada por: T10 (props do `OTPField`)
  - Pronto quando: os plays provam que completar o código não chama `onSubmit`, que `onSubmit` não roda com o código incompleto e que o envio só sai pelo "Verificar" ou por Enter; cada dígito tem o rótulo `digit(position, total)`; axe sem violação. Quem roda: sessão principal, `bun run typecheck && bun run storybook:typecheck && bunx biome check packages/blocks/src/application/auth/otp-1 apps/storybook/src/blocks/application/auth` exit 0. CI, `bunx vitest run --project=storybook --maxWorkers=2 src/blocks/application/auth/otp-1`.
  - Feito neste PR (fase 3, `feat/auth-otp-1`).
- [x] T24 [AC-6.2, AC-6.3, AC-2.3, AC-2.4, AC-7.3] Completar `otp-1` com o reenvio (`onResend`), a contagem que o consumidor controla (`resendIn`, sem timer no block), `error` e `fieldErrors` com foco no primeiro campo inválido — `packages/blocks/src/application/auth/otp-1/`; `apps/storybook/src/blocks/application/auth/otp-1.stories.tsx`
  - Depende de: T23, T19
  - Pronto quando: o play prova que o reenvio fica desabilitado com `resendIn` maior que zero e que `onResend` é chamado quando ele é zero ou ausente; a contagem aparece como texto fora de região `aria-live`; o `Alert` de `error` tem `role="alert"`. Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/otp-1` exit 0. CI, `bunx vitest run --project=storybook --maxWorkers=2 src/blocks/application/auth/otp-1`.
  - Feito neste PR (fase 3, `feat/auth-otp-1`).
- [x] T25 [AC-1.3, AC-8.3] Registrar `otp-1` no registry e no baseline: entrada em `blockNames` e `blockSources`, caso em `manifest.test.ts`, e `block:otp-1` em `docs/architecture/public-api-exports.json` — `packages/registry/src/manifest.ts`, `packages/registry/src/manifest.test.ts`, `docs/architecture/public-api-exports.json`
  - Depende de: T24
  - Depende de (externo): PR #438
  - Pronto quando: o item do `otp-1` não leva arquivo fora de `application/auth`, `helpers` e das dependências de `ui`; `block:otp-1` está no baseline. Quem roda: sessão principal, `bun test --isolate packages/registry/src` exit 0; `bun scripts/verify-public-api.ts --record` e `bun run verify:public-api` exit 0.
  - Feito neste PR (fase 3, `feat/auth-otp-1`): `manifest.ts` e `manifest.test.ts`; o baseline `block:otp-1` é gravado pela sessão principal na revisão (`bun scripts/verify-public-api.ts --record`).

---

### Fase 4 · Bloco `signup-1`

Traz nome, e-mail e senha, a confirmação de senha conferida pelo próprio block e o retorno sobre a senha. A pasta tocada é só `packages/blocks/src/application/auth/signup-1/`.

- [x] T26 [AC-4.1, AC-4.2, AC-4.3, AC-4.4, AC-4.5, AC-7.2, AC-8.1, AC-8.2] Montar `signup-1` com nome, e-mail e senha: `onSubmit({ name, email, password })`, `minLength={passwordMinLength}` (padrão 8) como restrição nativa, link de entrar e o aviso "Ao criar a conta você concorda com…" com os links de termos e privacidade que o consumidor passa (sem caixa de aceite e sem valor extra em `onSubmit`), e os labels de cadastro em pt-BR — `packages/blocks/src/application/auth/signup-1/`; `apps/storybook/src/blocks/application/auth/signup-1.stories.tsx` (`Blocks/Application/Auth/Signup1`)
  - Depende de: T16, T17, T18
  - Pronto quando: o play de envio chama `onSubmit` com `name`, `email` e `password`; a senha curta não envia (restrição nativa); o link de entrar renderiza por `renderLink`; o aviso renderiza só os links cujo `href` foi passado e não há caixa de aceite; axe sem violação. Quem roda: sessão principal, `bun run typecheck && bun run storybook:typecheck && bunx biome check packages/blocks/src/application/auth/signup-1 apps/storybook/src/blocks/application/auth` exit 0. CI, `bunx vitest run --project=storybook --maxWorkers=2 src/blocks/application/auth/signup-1`.
  - Feito neste PR (fase 4, `feat/auth-signup-1`).
- [x] T27 [AC-9.1, AC-9.2, AC-9.3, AC-9.4, AC-9.5, AC-9.6, AC-7.6, AC-7.7] Completar `signup-1` com o campo de confirmação, a conferência de que os dois valores batem (erro de campo, foco no campo de confirmação, sem `onSubmit`), o mostrar/ocultar em senha e confirmação, e o retorno sobre a senha enquanto se digita (proposed: a conferência fica dentro do block, sem importar outro block) — `packages/blocks/src/application/auth/signup-1/`; `apps/storybook/src/blocks/application/auth/signup-1.stories.tsx`
  - Depende de: T26, T15, T18
  - Pronto quando: os plays provam a confirmação que não bate (erro, foco, sem envio), o retorno que muda ao digitar sem bloquear o envio, e o alternar de visibilidade sem enviar; `onSubmit` recebe só `password`, sem a confirmação. Quem roda: sessão principal, `bun run typecheck && bunx biome check packages/blocks/src/application/auth/signup-1` exit 0. CI, `bunx vitest run --project=storybook --project=storybook-dark --maxWorkers=2 src/blocks/application/auth/signup-1`.
  - Feito neste PR (fase 4, `feat/auth-signup-1`).
- [x] T28 [AC-1.3, AC-8.3] Registrar `signup-1` no registry e no baseline: entrada em `blockNames` e `blockSources`, caso em `manifest.test.ts` e `block:signup-1` em `docs/architecture/public-api-exports.json` — `packages/registry/src/manifest.ts`, `packages/registry/src/manifest.test.ts`, `docs/architecture/public-api-exports.json`
  - Depende de: T27
  - Depende de (externo): PR #438
  - Pronto quando: o item do `signup-1` leva só os arquivos esperados. Quem roda: sessão principal, `bun test --isolate packages/registry/src` exit 0; `bun scripts/verify-public-api.ts --record` e `bun run verify:public-api` exit 0.
  - Feito neste PR (fase 4, `feat/auth-signup-1`): `manifest.ts` e `manifest.test.ts`; o baseline `block:signup-1` é gravado pela sessão principal na revisão (`bun scripts/verify-public-api.ts --record`).

---

### Fase 5 · Bloco `reset-password-1`

Senha nova e confirmação, com os mesmos controles de `signup-1`. A conferência da confirmação é copiada, não importada: um block não importa outro (proposed). A pasta tocada é só `packages/blocks/src/application/auth/reset-password-1/`.

- [ ] T29 [AC-5.2, AC-5.3, AC-9.1, AC-9.2, AC-9.3, AC-9.4, AC-9.5, AC-9.6, AC-7.6, AC-7.7, AC-8.1, AC-8.2] Montar `reset-password-1` com senha nova e confirmação, mostrar/ocultar, retorno sobre a senha (`passwordMinLength` padrão 8), conferência da confirmação, `onSubmit({ password })` e link de volta ao login; o token de redefinição não passa pelo block — `packages/blocks/src/application/auth/reset-password-1/`; `apps/storybook/src/blocks/application/auth/reset-password-1.stories.tsx` (`Blocks/Application/Auth/ResetPassword1`)
  - Depende de: T16, T18, T19, T15
  - Pronto quando: os plays provam a confirmação que não bate, o retorno, o mostrar/ocultar e o envio só com `password`; o block não lê nem guarda o token (conferido na revisão do código: nenhuma prop nem campo de token). Quem roda: sessão principal, `bun run typecheck && bun run storybook:typecheck && bunx biome check packages/blocks/src/application/auth/reset-password-1 apps/storybook/src/blocks/application/auth` exit 0. CI, `bunx vitest run --project=storybook --project=storybook-dark --maxWorkers=2 src/blocks/application/auth/reset-password-1`.
- [ ] T30 [AC-1.3, AC-8.3] Registrar `reset-password-1` no registry e no baseline: entrada em `blockNames` e `blockSources`, caso em `manifest.test.ts` e `block:reset-password-1` em `docs/architecture/public-api-exports.json` — `packages/registry/src/manifest.ts`, `packages/registry/src/manifest.test.ts`, `docs/architecture/public-api-exports.json`
  - Depende de: T29
  - Depende de (externo): PR #438
  - Pronto quando: o item leva só os arquivos esperados. Quem roda: sessão principal, `bun test --isolate packages/registry/src` exit 0; `bun scripts/verify-public-api.ts --record` e `bun run verify:public-api` exit 0.

---

### Fase 6 · Bloco `forgot-password-1`

E-mail, envio, link de volta ao login e a confirmação "e-mail enviado" pela prop `sent`. A pasta tocada é só `packages/blocks/src/application/auth/forgot-password-1/`.

- [ ] T31 [AC-5.1, AC-5.4, AC-5.5, AC-5.6, AC-5.7, AC-2.2, AC-2.4, AC-3.3, AC-7.1, AC-7.2, AC-7.4, AC-8.1, AC-8.2] Montar `forgot-password-1` com e-mail, `onSubmit({ email })`, `fieldErrors` no campo e link de volta ao login; com a prop `sent` verdadeira, trocar o formulário por uma confirmação no mesmo Card, com link de volta ao login e a opção de reenviar (`onResend`, `resendIn` do consumidor, sem timer; `destination` opcional; foco no título da confirmação quando `sent` passa a verdadeiro; os nomes e os textos são propostos em `design.md` §4.4) — `packages/blocks/src/application/auth/forgot-password-1/`; `apps/storybook/src/blocks/application/auth/forgot-password-1.stories.tsx` (`Blocks/Application/Auth/ForgotPassword1`)
  - Depende de: T16
  - Bloqueada por: T10
  - Pronto quando: o play prova o envio com `{ email }`, `pending` desabilita o envio, o erro de campo aparece ligado ao campo e o link de volta renderiza por `renderLink` só com `href`; com `sent` verdadeiro, o formulário some e a confirmação aparece no mesmo Card, com o link de volta, o botão de reenvio desabilitado com `resendIn` maior que zero e `onResend` chamado quando ele é zero ou ausente, o endereço só com `destination` e o foco no título; axe sem violação. Quem roda: sessão principal, `bun run typecheck && bun run storybook:typecheck && bunx biome check packages/blocks/src/application/auth/forgot-password-1 apps/storybook/src/blocks/application/auth` exit 0. CI, `bunx vitest run --project=storybook --maxWorkers=2 src/blocks/application/auth/forgot-password-1`.
- [ ] T32 [AC-1.3, AC-8.3] Registrar `forgot-password-1` no registry e no baseline: entrada em `blockNames` e `blockSources`, caso em `manifest.test.ts` e `block:forgot-password-1` em `docs/architecture/public-api-exports.json` — `packages/registry/src/manifest.ts`, `packages/registry/src/manifest.test.ts`, `docs/architecture/public-api-exports.json`
  - Depende de: T31
  - Depende de (externo): PR #438
  - Pronto quando: o item leva só os arquivos esperados. Quem roda: sessão principal, `bun test --isolate packages/registry/src` exit 0; `bun scripts/verify-public-api.ts --record` e `bun run verify:public-api` exit 0.

---

### Fase 7 · Polish

Documentação do grupo, catálogo e gate. Nada aqui muda comportamento de bloco.

- [ ] T33 [P] [—] Escrever `packages/blocks/AGENTS.md` para o grupo `auth`: Map (pastas de cada bloco e de `application/auth/shared/`), Dependents (registro, baseline, alias, stories), Invariants (contrato comum e as invariantes de `design.md` §5) — `packages/blocks/AGENTS.md`
  - Depende de: T22, T25, T28, T30, T32
  - Pronto quando: as seções seguem a ordem de `packages/blocks/AGENTS.md` e não copiam props nem listas de arquivos além do que `ls` não revela. Quem roda: sessão principal, `bunx biome check packages/blocks/AGENTS.md` não se aplica (Markdown); conferir a ordem das seções com a leitura; `bun run overrides:check` exit 0.
- [ ] T34 [P] [AC-8.1] Publicar uma página `Doc` por block (como `AppShell1` a `AppShell4` e os editores de fluxo, sem a estrutura de seis páginas), o catálogo `Blocks/Doc` com os cinco blocks e o trecho do README (seção pública) do grupo `auth`; uma variação por block — `apps/storybook/src/blocks/doc.mdx`, `README.md`, stories dos blocks (a forma da `Doc` segue a do `AppShell1`, que o implementador lê (proposed))
  - Depende de: T22, T25, T28, T30, T32
  - Pronto quando: cada um dos cinco blocks tem uma só página `Doc`, `Blocks/Application/Auth/<Nome>` aparece nas cinco entradas do catálogo, e o README cita o grupo. Quem roda: sessão principal, `bunx biome check apps/storybook/src/blocks`; CI, `bun run storybook:test` no grupo `src/blocks/application/auth` (plays e axe).
- [ ] T35 [AC-1.1, AC-1.2, AC-1.4, AC-3.4, AC-7.5] Conferir o gate e a instalação no consumidor: `bun run check`, a checagem de registry no consumidor, a ausência de cópia de `renderAnchor` fora de `ui`, e o caminho de import `@<escopo>/blocks/application/auth/login-1` — sem tarefa de código
  - Depende de: T33, T34
  - Pronto quando: o gate passa, o consumidor recebe os itens com `render-anchor` e os componentes COSS de que dependem, e o import pela pasta funciona. Quem roda: sessão principal, `bun run check` exit 0; `bun run test:consumer:registry` exit 0; `bun run check:coss && bun run boundaries:check && bun run overrides:check && bun run verify:public-api` exit 0. CI, `storybook:test` completo.
- [ ] T36 [—] Medir os objetivos OBJ-1 a OBJ-4 com as metas de T11 e registrar a medição no PRD — `requirements.md` §3
  - Depende de: T35
  - Bloqueada por: T11
  - Pronto quando: a tabela de objetivos traz o valor medido de cada um. Quem roda: sessão principal, contagem dos blocks do grupo `auth` (5), `grep -rn "from '@tc96/" packages/blocks/src/application/auth` para o item fora do grupo, e o resultado do CI do axe.

---

### Ordem

- Ordem de entrega decidida pelo dono em 2026-11-22 (proposta mantida): `login-1` (fase 2), `otp-1` (fase 3), `signup-1` (fase 4), `reset-password-1` (fase 5), `forgot-password-1` (fase 6). Está em `requirements.md` §4 e §5.
- Fase 0 corre ao lado da fase 1; T9 e T10 foram fechadas pelo implementador da fundação ao ler os componentes (2026-11-22). T12 começa já; T13 e T14 esperam T12 e rodam juntas (`[P]`); T15, T16, T17 e T19 esperam T14 e rodam juntas (`[P]`); T18 espera T15.
- Fase 2 (login-1) espera T16, T17, T18 e T10. Fase 3 (otp-1) espera T16 e T10 (props do `OTPField`). T16, T17 e T18 esperam T10; T19 espera T9.
- Dentro de cada fase de bloco, as tarefas são sequenciais (`T20`, `T21`, `T22`; `T23`, `T24`, `T25`; e assim por diante).
- Cada tarefa de bloco toca só a própria pasta `application/auth/<bloco>/` e as stories e o registro desse bloco. Nenhum block importa outro: a checagem é `bun run boundaries:check` (sessão principal) em T22, T25, T28, T30, T32 e T35.
- A regra de `[P]` segue a referência: marca tarefas que rodam juntas assim que as dependências delas estão prontas, e que tocam superfícies diferentes.

### Coverage

Regra de leitura: confirmação de senha, retorno sobre a senha e mostrar/ocultar são AC-9.x. Os controles do OTP (código, "Verificar", reenvio e `resendIn`) são AC-6.x. A confirmação `sent` do `forgot-password-1` é AC-5.4 a AC-5.7. A moldura da página é AC-11.x.

| Critério | Tarefas |
| --- | --- |
| AC-1.1 | T22, T35 |
| AC-1.2 | T22, T35 |
| AC-1.3 | T22, T25, T28, T30, T32 |
| AC-1.4 | T35 |
| AC-2.1 | T20 |
| AC-2.2 | T20, T31 |
| AC-2.3 | T21, T24 |
| AC-2.4 | T21, T24, T31 |
| AC-2.5 | T20 |
| AC-3.1 | T14, T21 |
| AC-3.2 | T12, T13, T14, T21 |
| AC-3.3 | T21, T31 |
| AC-3.4 | T12, T13, T35 |
| AC-4.1 | T26 |
| AC-4.2 | T26 |
| AC-4.3 | T26 |
| AC-4.4 | T26 |
| AC-4.5 | T26 |
| AC-5.1 | T31 |
| AC-5.2 | T29 |
| AC-5.3 | T29 |
| AC-5.4 | T31 |
| AC-5.5 | T31 |
| AC-5.6 | T31 |
| AC-5.7 | T31 |
| AC-6.1 | T23 |
| AC-6.2 | T24 |
| AC-6.3 | T24 |
| AC-6.4 | T23 |
| AC-6.5 | T23 |
| AC-7.1 | T21, T31 |
| AC-7.2 | T20, T23, T26, T31 |
| AC-7.3 | T19, T21, T24 |
| AC-7.4 | T20, T31 |
| AC-7.5 | T21, T35 |
| AC-7.6 | T21, T27, T29 |
| AC-7.7 | T27, T29 |
| AC-8.1 | T20, T23, T26, T29, T31, T34 |
| AC-8.2 | T20, T21, T23, T24, T27, T29, T31 |
| AC-8.3 | T22, T25, T28, T30, T32 |
| AC-9.1 | T21, T27, T29 |
| AC-9.2 | T27, T29 |
| AC-9.3 | T27, T29 |
| AC-9.4 | T15, T27, T29 |
| AC-9.5 | T15, T27, T29 |
| AC-9.6 | T15, T27, T29 |
| AC-10.1 | T20 |
| AC-10.2 | T20 |
| AC-10.3 | T20 |
| AC-11.1 | T16, T21 |
| AC-11.2 | T16 |
| AC-11.3 | T16, T21 |
| AC-11.4 | T16 |

| Capacidade | Tarefas |
| --- | --- |
| CAP-1 `login-1` | T14, T18, T20, T21, T22 |
| CAP-2 `signup-1` | T18, T26, T27, T28 |
| CAP-3 `forgot-password-1` | T31, T32 |
| CAP-4 `reset-password-1` | T18, T29, T30 |
| CAP-5 `otp-1` | T23, T24, T25 |
| CAP-6 contrato comum | T12, T13, T14, T16, T17, T19 |
| CAP-7 instalação, docs e registro | T22, T25, T28, T30, T32, T33, T34, T35 |

### Fora deste plano

- Integração com provedor de autenticação (Better Auth, Clerk, NextAuth, Supabase), roteamento e redirecionamento, sessão e cookie: ficam no consumidor.
- Cadastro de MFA, captcha, limite de tentativas (rate limiting), i18n além de `labels`.
- Pontuação de força de senha: fica fora a menos que o dono peça.
- Caixa de aceite dos termos e da privacidade: o dono decidiu só links (T0).
- Login por nome de usuário: fora (T1, proposta mantida pelo dono em 2026-11-22).
- Variações `-2` (página dividida com painel de marca ou mídia): candidatas, fora desta entrega (T5, proposta mantida pelo dono em 2026-11-22).
- Link mágico: fora desta entrega (T4, dono, 2026-11-22).
- Renomear o alias do CLI de `templates` para `blocks` e o PR #438: entram em separado, e este plano só os usa.

### Open questions

- [GAP: tipo de teste de cada invariante (`design.md` §12, proposed) — decides: dono]

### Registro da execução

Cada sessão acrescenta aqui a data, a tarefa e cada desvio do plano, com o lugar onde ficou registrado.

- 2026-11-22 · decisões do dono, segunda rodada, gravadas em `requirements.md`, `design.md` e neste plano: T0 (termos e privacidade só links), T1 (login só por e-mail, proposta mantida), T2 (`passwordMinLength` padrão 8, proposta mantida), T3 (`forgot-password-1` com a prop `sent`), T5 (uma variação por block, proposta mantida), T6 (uma página `Doc` por block), T7 (ordem `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1`, proposta mantida) e T8 (o block renderiza `main`, centralização e `logo` acima do Card). Seguem abertas T4, T9, T10, T11, a branch e a divisão em PRs, e o tipo de teste de cada invariante.
- 2026-11-22 · terceira rodada, gravada em `requirements.md`, `design.md` e neste plano: T4 (link mágico fora), T11 (as quatro métricas e metas bastam), divisão em PRs (fundação, depois um PR por block, polimento no último) e T9 e T10 delegadas ao implementador da fundação, que volta ao dono se mudar o contrato.
- 2026-11-22 · fase 1 (T12 a T19) feita no PR #441; T9 e T10 fechadas pelo implementador da fundação e gravadas em `design.md` §5.2 (o `Form` do Base UI valida, o hook cobre o `Alert` e os erros sem envio) e §3 (nomes e props de `Input`, `Button`, `Alert`, `Checkbox` e `OTPField`); as mensagens das restrições nativas ficam as do navegador, por ora (dono). Fase 2 (T20 a T22, `login-1`) feita neste PR na branch `feat/auth-login-1`: `Login1` com `labels.ts` e `types.ts` próprios, a caixa "lembrar de mim" em `Field` + `FieldLabel`, o rodapé de cadastro só com `signupHref`, stories `Blocks/Application/Auth/Login1` com um `play` por garantia e o item `login-1` no registry. Desvio: o baseline `block:login-1` não foi gravado pelo implementador (fica com a sessão principal).
- 2026-11-22 · fase 3 (T23 a T25, `otp-1`) feita neste PR na branch `feat/auth-otp-1`, empilhada sobre `feat/auth-login-1`: `Otp1` com `labels.ts` e `types.ts` próprios, o `OTPField` sem `autoSubmit` e sem valor guardado no block, o botão "Verificar" como único caminho até `onSubmit` (a guarda `code.length < length` vem além da restrição nativa), o reenvio no rodapé do Card só com `onResend`, desabilitado com `resendIn` maior que zero e enquanto `pending`, stories `Blocks/Application/Auth/Otp1` com um `play` por garantia e o item `otp-1` no registry. Escolhas e desvios: (1) o `OTPField` do Base UI nomeia o primeiro dígito pelo `FieldLabel` e ignora `aria-label` nele; para o primeiro dígito também ter `digit(1, total)`, o block aponta o `aria-labelledby` dele para um `span hidden` com esse texto, e o `FieldLabel` nomeia o grupo; (2) o foco em `fieldErrors.code` usa o `useFocusFirstInvalid` sem mudança: o input de validação do `OTPField` leva o `name` do `Field` (`type="text"`, não é pulado) e focá-lo repassa o foco ao primeiro dígito; (3) sem link de volta, porque o design não define `loginHref` para o `otp-1`; (4) `pending` desabilita o reenvio além do envio (`onResend` não roda com `pending`, como no `forgot-password-1`). (5) código vazio ou incompleto: opção A, sem `validate` nem rótulo `codeIncomplete`. As restrições nativas do input de validação do `OTPField` (`required` e o `pattern` de `length` dígitos) barram o envio, o `Form` foca o primeiro dígito e o `FieldError` mostra a mensagem do navegador; um `validate` do `Field` não roda enquanto uma restrição nativa falha, e o Base UI marca `aria-invalid` nos dígitos só por `errors` do `Form` ou `invalid` do `Field`, não pela validade nativa. O `play` `IncompleteCodeDoesNotSubmit` afirma o foco no primeiro dígito, o `FieldError` visível e não vazio e `onSubmit` e `onComplete` sem chamada, sem `aria-invalid` nos dígitos. Marcar os dígitos nesses casos exigiria que o dono aceitasse tirar as restrições nativas do `OtpField` (ligado à decisão pendente sobre as mensagens nativas, também do `login-1`); detalhe em `design.md` §4.6. O baseline `block:otp-1` não foi gravado pelo implementador (fica com a sessão principal).
- 2026-11-22 · fase 4 (T26 a T28, `signup-1`) feita neste PR na branch `feat/auth-signup-1`, empilhada sobre `feat/auth-otp-1`: `Signup1` com `labels.ts` e `types.ts` próprios, nome, e-mail, senha com mostrar/ocultar e o retorno sobre a senha (`AuthPasswordFeedback`), confirmação com o próprio botão, aviso de termos e privacidade só com links, link de entrar só com `loginHref`, stories `Blocks/Application/Auth/Signup1` com um `play` por garantia e o item `signup-1` no registry. Escolhas e desvios: (1) a conferência usa só o `Form`: `onFormSubmit` compara `password` e `confirmPassword`, em divergência guarda `mismatch` no estado e não chama `onSubmit`, e o `useMemo` dos `errors` junta `{ confirmPassword: labels.passwordMismatch }`; lido no código do Base UI, o `Form` refocaliza o primeiro campo inválido quando seus `errors` mudam depois de um envio válido (`submittedRef`), então o foco na confirmação não é manual; `onValueChange` de senha e confirmação limpa `mismatch`; (2) o aviso com só `privacyHref` usa `termsLead` ("... com os") antes de "Política de Privacidade", que em pt-BR pede o artigo "a": o consumidor ajusta `labels.termsLead` nesse caso; (3) o play de senha curta foi removido: o Chromium não aplica `minLength`/`tooShort` a valores gravados por script nos testes (o `userEvent` do Testing Library grava assim), então a restrição `minlength` é afirmada no `Default`; (4) no play de restrições nativas, o `FieldError` visível afirma-se só no primeiro campo inválido (nome, `Input` simples), com o mesmo mecanismo que o play do `otp-1` prova; `aria-invalid` só nos `Input` simples, como no `login-1`. O baseline `block:signup-1` não foi gravado pelo implementador (fica com a sessão principal).
