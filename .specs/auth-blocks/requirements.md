# PRD: Blocks de autenticação (`application/auth`)

- **Status:** Draft (o texto espera a revisão do dono)
- **Date:** 2026-11-22
- **Origin:** pedido do dono em 2026-11-22: ele começa um projeto novo e precisa das páginas do fluxo de autenticação (login e o resto do fluxo); ele as vê como blocks, não como patterns ([ADR 0009](../adr/0009-blocks-layer.md))
- **Design:** [`design.md`](design.md)
- **Convenção:** o que o dono decidiu está escrito sem marca. O que o texto propõe leva `(proposed)` e espera a confirmação dele. O que ninguém decidiu é uma lacuna `[GAP: ... — decides: ...]`.

## 1. Problema e âncora

O dono começa um projeto novo e precisa das páginas do fluxo de autenticação. O repositório tem a camada `blocks` ([ADR 0009](../adr/0009-blocks-layer.md)) e um primeiro grupo (`application/shell`), mas nenhuma página de acesso. Sem elas, cada projeto refaz login, cadastro e recuperação de senha, e cada refação decide de novo onde fica o provider de autenticação.

Quem tem o problema: o dono, como desenvolvedor que instala os blocks num projeto novo e os edita depois (o "consumidor" neste documento).

Decidido pelo dono:

- as páginas de auth são blocks da categoria Application, grupo `auth`: `packages/blocks/src/application/auth/<block>/`, com as peças compartilhadas em `application/auth/shared/`; as stories se chamam `Blocks/Application/Auth/<Nome>`;
- block é uma variação numerada que o consumidor instala com `npx @tc96/parttens add <nome>` e depois edita;
- o block consome patterns e `ui`; nunca importa outro block; um pattern nunca importa block (`boundaries:check` aplica);
- o block segue o contrato dos patterns: controlado, sem fetch, sessão, cookie, provider de autenticação, tema nem CSS; todo texto visível está em `labels` com padrão pt-BR; os links passam por `renderLink(href)`;
- o alias do CLI para blocks é `blocks` (o rename de `templates` acontece em outro PR, em paralelo).

## 2. Usuários

| Grupo | Quem é | Origem |
| --- | --- | --- |
| Consumidor | o desenvolvedor que instala o block, liga os eventos ao próprio provider e edita o código | decidido (o dono) |
| Usuário final do produto do consumidor | quem preenche as páginas para entrar, criar conta ou recuperar a senha; só aparece nos critérios de acessibilidade e de uso | (proposed) |

## 3. Objetivos

Nenhuma métrica foi definida pelo dono. Os objetivos abaixo são verificáveis e todos são (proposed).

| ID | Objetivo | Métrica | Meta |
| --- | --- | --- | --- |
| OBJ-1 | O consumidor tem as páginas do fluxo de acesso sem escrever o layout | blocks instaláveis do grupo `auth` | 5: `login-1`, `signup-1`, `forgot-password-1`, `reset-password-1`, `otp-1` (proposed) |
| OBJ-2 | O consumidor liga o block ao provider dele sem editar o block | props necessárias para uma página funcionar | `onSubmit` mais os links; o resto é opcional (proposed) |
| OBJ-3 | Os blocks são acessíveis desde a instalação | violações de axe nas stories de `Blocks/Application/Auth` | 0 (proposed) |
| OBJ-4 | O item instalado traz só o necessário | arquivos do item fora de `application/auth`, `helpers` e das dependências COSS | 0 (proposed) |

[GAP: o dono quer métricas e metas próprias para estes objetivos, ou os quatro acima bastam — decides: o dono]

## 4. Escopo

### Primeira entrega (proposed)

Uma variação de cada, nomeada como `app-shell-1`, sem zero à esquerda:

| Block | Página |
| --- | --- |
| `login-1` | entrar com e-mail e senha |
| `signup-1` | criar conta |
| `forgot-password-1` | pedir o link de redefinição de senha |
| `reset-password-1` | definir a nova senha |
| `otp-1` | informar o código de verificação |

O layout das variações `-1` é um Card centralizado do COSS com título, descrição, formulário e links de rodapé (proposed). Como referência de anatomia, não de código, o mercado tem os blocks `login-01..05`, `signup-01..05` e `otp-01..05` do shadcn/ui (<https://ui.shadcn.com/blocks/login>); o [ADR 0005](../adr/0005-installable-templates.md) (D9) vale aqui: nenhum arquivo, classe ou dado de produto externo entra no repositório.

### Candidatos fora desta entrega (proposed)

- `login-2` e as demais `-2`: página dividida, com um painel de marca ou mídia ao lado do formulário.

### Fora do escopo

- integração com provider de autenticação (Better Auth, Clerk, NextAuth, Supabase);
- roteamento e redirecionamentos;
- sessão e cookie;
- cadastro de MFA;
- captcha;
- limite de tentativas (rate limiting);
- i18n além de `labels`.

### Lacunas de escopo

- [GAP: medidor de força de senha — fica fora ou entra — decides: o dono]
- [GAP: fluxo de link mágico (magic link) — fica fora ou entra — decides: o dono]
- [GAP: quantas variações por block entram no primeiro PR (uma de cada, como proposto, ou também as `-2`) — decides: o dono]

## 5. Capacidades

| ID | Capacidade | Prioridade |
| --- | --- | --- |
| CAP-1 | `login-1`: entrar com e-mail e senha, com links para recuperar a senha e criar conta e botões de provedores opcionais | alta (proposed) |
| CAP-2 | `signup-1`: criar conta, com link para entrar e links opcionais de termos e privacidade | alta (proposed) |
| CAP-3 | `forgot-password-1`: pedir o link de redefinição, com link de volta ao login | média (proposed) |
| CAP-4 | `reset-password-1`: definir a nova senha, com link de volta ao login | média (proposed) |
| CAP-5 | `otp-1`: informar o código de verificação, com reenvio e contagem regressiva controlada pelo consumidor | média (proposed) |
| CAP-6 | Contrato comum do grupo: controlado, `labels` em pt-BR, `renderLink`, `pending`, `error`, `fieldErrors`, provedores opcionais, `logo` opcional | alta (proposed) |
| CAP-7 | Instalação e documentação: item no registry, stories com testes, página de docs | alta (proposed) |

A ordem de prioridade é derivada: CAP-6 e CAP-1 destravam os demais. [GAP: a ordem de entrega dos blocks — decides: o dono]

## 6. Histórias e critérios

### US-1. Instalar um block de acesso (CAP-1 a CAP-5, CAP-7)

Como consumidor, quero instalar a página que preciso com um comando para editá-la no meu projeto.

- **AC-1.1** `npx @tc96/parttens add login-1` grava a pasta `application/auth/login-1` e a pasta `application/auth/shared` que ele importa, sob o alias `blocks` do consumidor.
- **AC-1.2** A instalação inclui os componentes COSS que faltam no consumidor.
- **AC-1.3** O item do registry não leva arquivo fora de `application/auth`, `helpers` e das dependências COSS (proposed).
- **AC-1.4** O consumidor importa o block pela pasta: `@<escopo>/blocks/application/auth/login-1`.

### US-2. Ligar o block ao meu provider (CAP-6, CAP-1 a CAP-5)

Como consumidor, quero que o block não conheça o provider de autenticação para usar o que o projeto já tem.

- **AC-2.1** Enviar o formulário com os campos válidos chama `onSubmit(values)` com os valores tipados do block.
- **AC-2.2** Enquanto `pending` é verdadeiro, o botão de envio fica desabilitado, o formulário marca `aria-busy` e `onSubmit` não é chamado de novo (proposed).
- **AC-2.3** `error` aparece como mensagem do formulário num Alert do COSS (proposed).
- **AC-2.4** `fieldErrors` aparece junto de cada campo, com `aria-invalid` e a mensagem ligada ao campo (proposed).
- **AC-2.5** O block não faz fetch, não guarda sessão, não lê cookie e não importa provider.

### US-3. Trocar textos e links (CAP-6)

Como consumidor, quero trocar os textos e usar o roteador do meu projeto.

- **AC-3.1** Todo texto visível ou acessível vem de `labels`, com padrão em pt-BR; `labels` é parcial e se junta aos padrões.
- **AC-3.2** Todo link renderiza por `renderLink(href)`; sem `renderLink`, o padrão é uma âncora (proposed).
- **AC-3.3** Um link só aparece quando o consumidor passa o `href` dele (proposed).

### US-4. Criar conta (CAP-2)

Como consumidor, quero uma página de cadastro para o fluxo de entrada de novos usuários.

- **AC-4.1** A página tem e-mail e senha e chama `onSubmit({ email, password })` (proposed; ver lacunas).
- **AC-4.2** A senha exige o tamanho mínimo definido por restrição nativa (`minLength`), sem biblioteca de esquema (proposed).
- **AC-4.3** Há link para entrar e, quando o consumidor passa os `href`, links de termos e privacidade (proposed).

### US-5. Recuperar a senha (CAP-3, CAP-4)

Como consumidor, quero as duas páginas da recuperação de senha.

- **AC-5.1** `forgot-password-1` chama `onSubmit({ email })` e tem link de volta ao login.
- **AC-5.2** `reset-password-1` chama `onSubmit` com a nova senha e tem link de volta ao login.
- **AC-5.3** O block não lê, não valida nem guarda o token de redefinição; ele é do consumidor.

### US-6. Verificar um código (CAP-5)

Como consumidor, quero a página do código de verificação.

- **AC-6.1** O campo tem `length` dígitos (padrão 6) e chama `onComplete(code)` quando o último dígito é preenchido (proposed).
- **AC-6.2** `onResend()` é chamado pelo botão de reenvio, que fica desabilitado enquanto `resendIn` for maior que zero (proposed).
- **AC-6.3** O block mostra o número de `resendIn`; ele não roda timer próprio (proposed; o dono pode decidir diferente).

### US-7. Usar a página sem mouse nem visão (CAP-6; usuário final, proposed)

Como usuário final, quero preencher a página por teclado e por leitor de tela.

- **AC-7.1** Todo campo tem rótulo.
- **AC-7.2** Os campos usam os tokens de `autocomplete` do tipo deles: `username` ou `email`, `current-password`, `new-password`, `one-time-code`.
- **AC-7.3** Erros ligados ao campo; num envio que falha, o foco vai ao primeiro campo inválido ou, sem campo inválido, à mensagem do formulário.
- **AC-7.4** Enter envia o formulário.
- **AC-7.5** O contraste segue `docs/accessibility.md` e o axe não acusa violação.

### US-8. Ver e testar no Storybook (CAP-7)

Como consumidor, quero ver cada block e confirmar o comportamento antes de instalar.

- **AC-8.1** Cada block tem story em `Blocks/Application/Auth/<Nome>`.
- **AC-8.2** Há um `play` por garantia (envio, `pending`, erros, links, reenvio e conclusão do OTP), com axe (proposed).
- **AC-8.3** O item de cada block tem teste no registry (proposed).

## 7. Rastreabilidade

### História para capacidade e critério

| História | Capacidades | Critérios |
| --- | --- | --- |
| US-1 | CAP-1 a CAP-5, CAP-7 | AC-1.1 a AC-1.4 |
| US-2 | CAP-1 a CAP-6 | AC-2.1 a AC-2.5 |
| US-3 | CAP-6 | AC-3.1 a AC-3.3 |
| US-4 | CAP-2 | AC-4.1 a AC-4.3 |
| US-5 | CAP-3, CAP-4 | AC-5.1 a AC-5.3 |
| US-6 | CAP-5 | AC-6.1 a AC-6.3 |
| US-7 | CAP-6 | AC-7.1 a AC-7.5 |
| US-8 | CAP-7 | AC-8.1 a AC-8.3 |

### Capacidade para história

| Capacidade | Histórias |
| --- | --- |
| CAP-1 | US-1, US-2 |
| CAP-2 | US-1, US-2, US-4 |
| CAP-3 | US-1, US-2, US-5 |
| CAP-4 | US-1, US-2, US-5 |
| CAP-5 | US-1, US-2, US-6 |
| CAP-6 | US-2, US-3, US-7 |
| CAP-7 | US-1, US-8 |

### Objetivo para história

| Objetivo | Histórias |
| --- | --- |
| OBJ-1 | US-1, US-4, US-5, US-6 |
| OBJ-2 | US-2, US-3 |
| OBJ-3 | US-7 |
| OBJ-4 | US-1 |

## 8. Restrições

- Segue o contrato dos patterns e as regras do `AGENTS.md`: sem comentários no código, Biome, `cn` de `@tc96/utils`, COSS por `@tc96/ui/<componente>`, sem override de borda, raio ou sombra num componente COSS sem exceção registrada em `scripts/override-exceptions.json`.
- Um block só importa a própria pasta e o `shared/` do grupo ([layer-decision-map](../../docs/architecture/layer-decision-map.md)).
- Depende do rename do alias do CLI de `templates` para `blocks`, que acontece em outro PR. Enquanto ele não entrar, o CLI grava os blocks no alias `templates` (`AGENTS.md`).
- O [ADR 0009](../adr/0009-blocks-layer.md), que cria a camada, ainda está em `Draft`.

## 9. Questões em aberto

Todas as decisões são do dono.

- [GAP: alternar a visibilidade da senha (botão mostrar/ocultar) entra no login, no cadastro e na redefinição — decides: o dono]
- [GAP: a caixa "lembrar de mim" entra no login — decides: o dono]
- [GAP: o cadastro coleta o nome além de e-mail e senha — decides: o dono]
- [GAP: aceite dos termos e da privacidade é uma caixa de seleção ou só links — decides: o dono]
- [GAP: a redefinição de senha tem o campo de confirmação, e quem confere que os dois valores batem (o block ou o consumidor por `fieldErrors`) — decides: o dono]
- [GAP: o login identifica só por e-mail ou também por nome de usuário — decides: o dono]
- [GAP: tamanho mínimo da senha no cadastro e na redefinição — decides: o dono]
- [GAP: o OTP envia sozinho ao completar o código — decides: o dono]
- [GAP: a contagem regressiva do reenvio é só do consumidor (proposto) ou o block roda um timer próprio — decides: o dono]
- [GAP: como `forgot-password-1` mostra a confirmação "e-mail enviado" — decides: o dono]
- [GAP: medidor de força de senha — decides: o dono]
- [GAP: link mágico — decides: o dono]
- [GAP: quantas variações por block no primeiro PR — decides: o dono]
- [GAP: a documentação usa as seis páginas (API Reference, Playground, Stories, Behavior, Usages, Layouts) ou a página `Doc` que os app shells usam — decides: o dono]
- [GAP: métricas e metas dos objetivos — decides: o dono]

## 10. Relacionados

- [ADR 0009: camada `blocks`](../adr/0009-blocks-layer.md)
- [ADR 0005: templates instaláveis](../adr/0005-installable-templates.md)
- [Mapa de decisão das camadas](../../docs/architecture/layer-decision-map.md)
- [`packages/blocks/AGENTS.md`](../../packages/blocks/AGENTS.md)
- [Acessibilidade](../../docs/accessibility.md)
- [Design: blocks de autenticação](design.md)
