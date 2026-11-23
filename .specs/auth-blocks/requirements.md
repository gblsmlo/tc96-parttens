# PRD: Blocks de autenticação (`application/auth`)

- **Status:** Draft (o texto espera a revisão do dono)
- **Date:** 2026-11-22
- **Origin:** pedido do dono em 2026-11-22: ele começa um projeto novo e precisa das páginas do fluxo de autenticação (login e o resto do fluxo); ele as vê como blocks, não como patterns ([ADR 0009](../adr/0009-blocks-layer.md))
- **Design:** [`design.md`](design.md)
- **Convenção:** o que o dono decidiu está escrito sem marca. O que o texto propõe leva `(proposed)` e espera a confirmação dele. O que ninguém decidiu é uma lacuna `[GAP: ... — decides: ...]`.
- **Decisões do dono em 2026-11-22:** visibilidade da senha, lembrar de mim, nome no cadastro, confirmação de senha, retorno sobre a senha, OTP com botão Verificar, reenvio contado pelo consumidor, `renderAnchor` em `ui`; segunda rodada: termos e privacidade só como links, confirmação de "e-mail enviado" do `forgot-password-1` pela prop `sent`, documentação com uma página `Doc` por block, moldura da página inteira (`main`, centralização, `logo` acima do Card) dentro do block; propostas mantidas pelo dono (ele não se opôs): login só por e-mail, `passwordMinLength` padrão 8, uma variação por block na primeira entrega, ordem de entrega `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1`.

## 1. Problema e âncora

O dono começa um projeto novo e precisa das páginas do fluxo de autenticação. O repositório tem a camada `blocks` ([ADR 0009](../adr/0009-blocks-layer.md)) e um primeiro grupo (`application/shell`), mas nenhuma página de acesso. Sem elas, cada projeto refaz login, cadastro e recuperação de senha, e cada refação decide de novo onde fica o provider de autenticação.

Quem tem o problema: o dono, como desenvolvedor que instala os blocks num projeto novo e os edita depois (o "consumidor" neste documento).

Decidido pelo dono:

- as páginas de auth são blocks da categoria Application, grupo `auth`: `packages/blocks/src/application/auth/<block>/`, com as peças compartilhadas em `application/auth/shared/`; as stories se chamam `Blocks/Application/Auth/<Nome>`;
- block é uma variação numerada que o consumidor instala com `npx @tc96/parttens add <nome>` e depois edita;
- o block consome patterns e `ui`; nunca importa outro block; um pattern nunca importa block (`boundaries:check` aplica);
- o block segue o contrato dos patterns: controlado, sem fetch, sessão, cookie, provider de autenticação, tema nem CSS; todo texto visível está em `labels` com padrão pt-BR; os links passam por `renderLink(href)`;
- o alias do CLI para blocks é `blocks` (o rename de `templates` acontece em outro PR, em paralelo).

Decidido pelo dono em 2026-11-22:

- todo campo de senha de `login-1`, `signup-1` e `reset-password-1`, a confirmação incluída, tem o botão de mostrar/ocultar a senha; o estado visível ou oculto é estado de interação dentro do block;
- `login-1` tem a caixa "lembrar de mim", e o valor dela viaja em `onSubmit`;
- `signup-1` coleta o nome, além de e-mail e senha;
- `signup-1` e `reset-password-1` têm o campo de confirmação da senha, e o próprio block confere que os dois valores batem;
- o campo de senha nova de `signup-1` e `reset-password-1` mostra, enquanto o usuário digita, o retorno sobre o número de caracteres em relação ao tamanho mínimo e sobre os tipos de caractere sugeridos; uma pontuação de força não faz parte da decisão e fica fora a menos que o dono peça;
- `otp-1` não envia sozinho: há sempre um botão "Verificar", e `onSubmit` só roda por ele (ou por Enter); `onComplete(code)` é uma notificação opcional de código completo;
- a contagem regressiva do reenvio é do consumidor: o block só mostra `resendIn` e desabilita o reenvio enquanto ele for maior que zero; não roda timer;
- `renderAnchor` sobe para `ui` como item próprio do repositório (`origin: "own"`, como Text e IconFrame), porque uma peça sem domínio usada por blocks de grupos diferentes desce para `ui` ([mapa de decisão](../../docs/architecture/layer-decision-map.md)); os blocks de auth importam de `@tc96/ui`, e a mesma entrega move para ele os `render-link.tsx` de `application/shell/shared` e de `ai-agents/flow/shared`.

Decidido pelo dono em 2026-11-22 (segunda rodada):

- termos e privacidade no `signup-1` são só links: um texto como "Ao criar a conta você concorda com…" com os links que o consumidor passa; não há caixa de aceite, e nada além de `name`, `email` e `password` vai em `onSubmit`;
- o `forgot-password-1` mostra "e-mail enviado" pela prop `sent` (booleana): com `sent` verdadeiro, o block troca o formulário por uma confirmação dentro do mesmo Card, com link de volta ao login e a opção de reenviar;
- a documentação no Storybook usa uma página `Doc` por block, como `AppShell1` a `AppShell4` e os editores de fluxo; a estrutura de seis páginas não se aplica a estes blocks;
- o block renderiza a moldura da página inteira: o landmark `main`, a centralização vertical na janela e o `logo` acima do Card; o consumidor só monta o block na rota dele.

Propostas mantidas pelo dono em 2026-11-22 (ele foi avisado de que seriam seguidas, e não se opôs):

- o login identifica só por e-mail, sem nome de usuário (proposta mantida pelo dono em 2026-11-22);
- o valor padrão de `passwordMinLength` é 8 (proposta mantida pelo dono em 2026-11-22);
- a primeira entrega tem uma variação por block; as `-2` seguem candidatas, fora desta entrega (proposta mantida pelo dono em 2026-11-22);
- a ordem de entrega é `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1` (proposta mantida pelo dono em 2026-11-22).

## 2. Usuários

| Grupo | Quem é | Origem |
| --- | --- | --- |
| Consumidor | o desenvolvedor que instala o block, liga os eventos ao próprio provider e edita o código | decidido (o dono) |
| Usuário final do produto do consumidor | quem preenche as páginas para entrar, criar conta ou recuperar a senha; só aparece nos critérios de acessibilidade e de uso | (proposed) |

## 3. Objetivos

As métricas e as metas abaixo foram confirmadas pelo dono em 2026-11-22.

| ID | Objetivo | Métrica | Meta |
| --- | --- | --- | --- |
| OBJ-1 | O consumidor tem as páginas do fluxo de acesso sem escrever o layout | blocks instaláveis do grupo `auth` | 5: `login-1`, `signup-1`, `forgot-password-1`, `reset-password-1`, `otp-1` |
| OBJ-2 | O consumidor liga o block ao provider dele sem editar o block | props necessárias para uma página funcionar | `onSubmit` mais os links; o resto é opcional |
| OBJ-3 | Os blocks são acessíveis desde a instalação | violações de axe nas stories de `Blocks/Application/Auth` | 0 |
| OBJ-4 | O item instalado traz só o necessário | arquivos do item fora de `application/auth`, `helpers` e das dependências de `ui` (COSS e `render-anchor`) | 0 |

O dono confirmou em 2026-11-22 que os quatro objetivos bastam, com estas metas.

## 4. Escopo

### Primeira entrega

Uma variação de cada, nomeada como `app-shell-1`, sem zero à esquerda (proposta mantida pelo dono em 2026-11-22):

| Block | Página |
| --- | --- |
| `login-1` | entrar com e-mail e senha |
| `otp-1` | informar o código de verificação |
| `signup-1` | criar conta |
| `reset-password-1` | definir a nova senha |
| `forgot-password-1` | pedir o link de redefinição de senha e mostrar que o e-mail foi enviado |

A ordem da tabela é a ordem de entrega decidida (seção 5).

O block renderiza a página inteira: `main`, centralização vertical na janela e `logo` acima do Card. O Card centralizado do COSS com título, descrição, formulário e links de rodapé é a proposta de layout das variações `-1` (proposed). Como referência de anatomia, não de código, o mercado tem os blocks `login-01..05`, `signup-01..05` e `otp-01..05` do shadcn/ui (<https://ui.shadcn.com/blocks/login>); o [ADR 0005](../adr/0005-installable-templates.md) (D9) vale aqui: nenhum arquivo, classe ou dado de produto externo entra no repositório.

### Na mesma entrega

- `renderAnchor` vira um item próprio de `ui` (`origin: "own"`), listado em `packages/ui/ui.manifest.json`; o arquivo `packages/ui/src/render-anchor.tsx` e o export `renderAnchor` são o nome proposto (proposed).
- `application/shell/shared/render-link.tsx` e `ai-agents/flow/shared/render-link.tsx` passam a usar esse item. Os tipos `ShellRenderLink` e `FlowRenderLink` podem ficar como aliases de grupo (proposed).

### Variação pedida depois

- `reset-password-2`: pedido do dono em 2026-11-22, uma versão do `reset-password-n` com um tempo de validade para a solicitação de redefinição de senha; o tempo vem por props e o consumidor decide (decidido). A forma concreta (`expiresIn`, `requestNewLinkIn`, `onRequestNewLink`, o estado expirado) é proposta (proposed), em [`design.md`](design.md) §4.5.1.

### Candidatos fora desta entrega

- `login-2` e as demais `-2`: página dividida, com um painel de marca ou mídia ao lado do formulário. Ficam fora da primeira entrega (proposta mantida pelo dono em 2026-11-22).

### Fora do escopo

- integração com provider de autenticação (Better Auth, Clerk, NextAuth, Supabase);
- roteamento e redirecionamentos;
- sessão e cookie;
- cadastro de MFA;
- captcha;
- limite de tentativas (rate limiting);
- i18n além de `labels`;
- pontuação de força de senha: o dono decidiu o retorno sobre tamanho e tipos de caractere; a pontuação só entra se ele pedir;
- caixa de aceite dos termos e da privacidade: o dono decidiu só links;
- login por nome de usuário (proposta mantida pelo dono em 2026-11-22);
- link mágico (magic link): o dono decidiu deixar fora desta entrega em 2026-11-22.

### Lacunas de escopo

- Nenhuma: o link mágico ficou fora desta entrega (dono, 2026-11-22).

## 5. Capacidades

| ID | Capacidade | Prioridade |
| --- | --- | --- |
| CAP-1 | `login-1`: entrar com e-mail e senha, com botão de mostrar/ocultar a senha, caixa "lembrar de mim", links para recuperar a senha e criar conta e botões de provedores opcionais | alta (proposed) |
| CAP-2 | `signup-1`: criar conta com nome, e-mail, senha e confirmação da senha, com mostrar/ocultar, retorno sobre a senha, link para entrar e aviso com links opcionais de termos e privacidade | alta (proposed) |
| CAP-3 | `forgot-password-1`: pedir o link de redefinição, com link de volta ao login, e confirmação de "e-mail enviado" (prop `sent`) com link de volta e reenvio | média (proposed) |
| CAP-4 | `reset-password-1`: definir a nova senha com confirmação, com mostrar/ocultar, retorno sobre a senha e link de volta ao login | média (proposed) |
| CAP-5 | `otp-1`: informar o código de verificação, com botão "Verificar", reenvio e contagem regressiva controlada pelo consumidor | média (proposed) |
| CAP-6 | Contrato comum do grupo: controlado, `labels` em pt-BR, `renderLink` com `renderAnchor` de `ui`, `pending`, `error`, `fieldErrors`, provedores opcionais, `logo` opcional, moldura da página (`main`, centralização, `logo` acima do Card) | alta (proposed) |
| CAP-7 | Instalação e documentação: item no registry, stories com testes, uma página `Doc` por block | alta (proposed) |
| CAP-8 | `reset-password-2`: variação de `reset-password-1` com um tempo de validade da solicitação de redefinição, passado por props e decidido pelo consumidor; estado expirado com pedido de um novo link e contagem do novo pedido, também do consumidor | média (proposed) |

A ordem de entrega dos blocks é `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1` (proposta mantida pelo dono em 2026-11-22). As prioridades da tabela são derivadas: CAP-6 e CAP-1 destravam os demais.

## 6. Histórias e critérios

### US-1. Instalar um block de acesso (CAP-1 a CAP-5, CAP-7)

Como consumidor, quero instalar a página que preciso com um comando para editá-la no meu projeto.

- **AC-1.1** `npx @tc96/parttens add login-1` grava a pasta `application/auth/login-1` e a pasta `application/auth/shared` que ele importa, sob o alias `blocks` do consumidor.
- **AC-1.2** A instalação inclui os itens de `ui` que faltam no consumidor: os componentes COSS e o `render-anchor` (proposed).
- **AC-1.3** O item do registry não leva arquivo fora de `application/auth`, `helpers` e das dependências de `ui` (proposed).
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
- **AC-3.2** Todo link renderiza por `renderLink(href)`; sem `renderLink`, o padrão é o `renderAnchor` de `ui` (proposed).
- **AC-3.3** Um link só aparece quando o consumidor passa o `href` dele (proposed).
- **AC-3.4** `renderAnchor` existe uma só vez, em `ui`: os blocks de auth, o `application/shell` e o `ai-agents/flow` importam dele, e nenhum grupo mantém uma cópia.

### US-4. Criar conta (CAP-2)

Como consumidor, quero uma página de cadastro para o fluxo de entrada de novos usuários.

- **AC-4.1** A página coleta nome, e-mail e senha e chama `onSubmit({ name, email, password })`; o campo e a chave `name` e a obrigatoriedade do nome são proposta (proposed).
- **AC-4.2** A senha exige o tamanho mínimo definido por restrição nativa (`minLength`), sem biblioteca de esquema (proposed). O tamanho mínimo padrão (`passwordMinLength`) é 8 (proposta mantida pelo dono em 2026-11-22).
- **AC-4.3** Há link para entrar e um aviso do tipo "Ao criar a conta você concorda com…" com os links de termos e privacidade que o consumidor passa por `href`; o texto exato é proposto (proposed). Não há caixa de aceite.
- **AC-4.4** O campo de nome usa `autoComplete="name"`.
- **AC-4.5** O aceite dos termos não gera campo nem valor: `onSubmit` traz só `name`, `email` e `password`.

A confirmação, o mostrar/ocultar e o retorno sobre a senha do cadastro estão na US-9.

### US-5. Recuperar a senha (CAP-3, CAP-4)

Como consumidor, quero as duas páginas da recuperação de senha.

- **AC-5.1** `forgot-password-1` chama `onSubmit({ email })` e tem link de volta ao login.
- **AC-5.2** `reset-password-1` chama `onSubmit` com a nova senha e tem link de volta ao login.
- **AC-5.3** O block não lê, não valida nem guarda o token de redefinição; ele é do consumidor.
- **AC-5.4** Com a prop `sent` (booleana) verdadeira, `forgot-password-1` substitui o formulário por uma confirmação de "e-mail enviado" dentro do mesmo Card, com link de volta ao login e a opção de reenviar. `sent` é do consumidor: o block não decide sozinho que o e-mail foi enviado.
- **AC-5.5** O reenvio chama um callback do consumidor, que reaproveita a contagem do `otp-1`: `resendIn` é do consumidor, o botão fica desabilitado enquanto ele for maior que zero e o block não roda timer. O nome do callback (`onResend`), a prop `resendIn` e o botão só aparecer quando o consumidor passa `onResend` são propostos (proposed).
- **AC-5.6** A confirmação mostra o endereço de e-mail quando o consumidor o passa (prop `destination`, nome proposto) e usa um texto genérico sem ele; o block não lê o e-mail do formulário (proposed).
- **AC-5.7** Quando `sent` passa a verdadeiro, o foco vai ao título da confirmação (proposed).

A confirmação, o mostrar/ocultar e o retorno sobre a senha da redefinição estão na US-9.

### US-6. Verificar um código (CAP-5)

Como consumidor, quero a página do código de verificação.

- **AC-6.1** O campo tem `length` dígitos (padrão 6) e, quando o código fica completo, chama `onComplete(code)` se o consumidor o passou; `onComplete` é só uma notificação e não envia o formulário.
- **AC-6.2** `onResend()` é chamado pelo botão de reenvio, que fica desabilitado enquanto `resendIn` for maior que zero.
- **AC-6.3** O block mostra o número de `resendIn`; ele não roda timer próprio: a contagem regressiva é do consumidor.
- **AC-6.4** Há sempre um botão "Verificar", e `onSubmit({ code })` só roda por ele ou por Enter; completar o código não envia sozinho.
- **AC-6.5** `onSubmit` não é chamado com o código incompleto (proposed).

### US-7. Usar a página sem mouse nem visão (CAP-6; usuário final, proposed)

Como usuário final, quero preencher a página por teclado e por leitor de tela.

- **AC-7.1** Todo campo tem rótulo.
- **AC-7.2** Os campos usam os tokens de `autocomplete` do tipo deles: `username` ou `email`, `name`, `current-password`, `new-password` (senha nova e confirmação), `one-time-code`.
- **AC-7.3** Erros ligados ao campo; num envio que falha, o foco vai ao primeiro campo inválido ou, sem campo inválido, à mensagem do formulário.
- **AC-7.4** Enter envia o formulário.
- **AC-7.5** O contraste segue `docs/accessibility.md` e o axe não acusa violação.
- **AC-7.6** O botão de mostrar/ocultar a senha é alcançável por teclado, tem nome acessível vindo de `labels` e não envia o formulário.
- **AC-7.7** O retorno sobre a senha liga-se ao campo por `aria-describedby` e é anunciado de forma educada (`aria-live="polite"`), sem anunciar cada tecla; o estado de cada sugestão aparece em texto, não só em cor.

### US-8. Ver e testar no Storybook (CAP-7)

Como consumidor, quero ver cada block e confirmar o comportamento antes de instalar.

- **AC-8.1** Cada block tem story em `Blocks/Application/Auth/<Nome>` e uma única página `Doc`, como `AppShell1` a `AppShell4` e os editores de fluxo; as seis páginas (API Reference, Playground, Stories, Behavior, Usages, Layouts) não se aplicam.
- **AC-8.2** Há um `play` por garantia (envio, `pending`, erros, links, mostrar/ocultar a senha, confirmação que não bate, retorno sobre a senha, "lembrar de mim", reenvio, envio do OTP só pelo "Verificar", confirmação `sent` do `forgot-password-1` e moldura da página), com axe (proposed).
- **AC-8.3** O item de cada block tem teste no registry (proposed).

### US-9. Escolher e conferir a senha (CAP-1, CAP-2, CAP-4)

Como consumidor, quero que as páginas com senha ajudem o usuário a digitá-la e a escolher uma boa, sem eu escrever essa lógica.

- **AC-9.1** Todo campo de senha de `login-1`, `signup-1` e `reset-password-1`, a confirmação incluída, tem um botão que alterna entre mostrar e ocultar a senha. O texto do botão e o nome acessível vêm de `labels` (nomes e padrões em pt-BR propostos, por exemplo "Mostrar senha" e "Ocultar senha") (proposed). O estado visível ou oculto é estado de interação do block.
- **AC-9.2** `signup-1` e `reset-password-1` têm o campo de confirmação da senha. No envio, o block confere que os dois valores batem; se não batem, mostra um erro de campo, com texto vindo de `labels`, no campo de confirmação, move o foco para ele e não chama `onSubmit`.
- **AC-9.3** O valor da confirmação não vai em `onSubmit`: os valores trazem só `password` (proposed).
- **AC-9.4** O campo de senha nova mostra, enquanto o usuário digita, o retorno sobre o número de caracteres em relação ao tamanho mínimo, que é 8 por padrão (proposta mantida pelo dono em 2026-11-22), por exemplo "6 de 8 caracteres"; o texto é proposto (proposed).
- **AC-9.5** O campo de senha nova mostra, enquanto o usuário digita, o retorno sobre os tipos de caractere sugeridos: letra minúscula, letra maiúscula, número e símbolo; a lista, o fato de o consumidor poder configurá-la e os rótulos são proposta (proposed).
- **AC-9.6** As sugestões são avisos e não bloqueiam o envio: só o tamanho mínimo bloqueia, pela restrição nativa (`minLength`) (proposed).

### US-10. Entrar e lembrar do usuário (CAP-1)

Como consumidor, quero receber a escolha "lembrar de mim" do usuário para decidir a duração da sessão no meu provider.

- **AC-10.1** `login-1` tem a caixa "lembrar de mim".
- **AC-10.2** O valor da caixa viaja em `onSubmit`, como `remember: boolean`; o nome `remember` é proposto, e a caixa começa desmarcada (proposed).
- **AC-10.3** O login identifica o usuário só por e-mail: não há campo de nome de usuário, e `onSubmit` traz `email`, `password` e `remember` (proposta mantida pelo dono em 2026-11-22).

### US-11. Montar a página só com a rota (CAP-6)

Como consumidor, quero que o block desenhe a página inteira para só montá-lo na minha rota.

- **AC-11.1** O block renderiza o landmark `main` da página.
- **AC-11.2** O block centraliza o conteúdo na vertical, na altura da janela; `min-h-svh` é a classe proposta (proposed).
- **AC-11.3** O `logo`, quando o consumidor o passa, renderiza acima do Card, fora dele.
- **AC-11.4** O consumidor só monta o block na rota e não precisa de layout próprio para a página; ele não envolve o block em outro `main` (proposed).

### US-12. Dar um tempo de validade ao link de redefinição (CAP-8)

Como consumidor, quero que a página de redefinição mostre o tempo que falta para o link expirar, com o tempo vindo por props, para eu decidir a contagem e o que acontece ao expirar. (Pedido do dono em 2026-11-22: uma versão do `reset-password-n` com um tempo de validade para a solicitação de redefinição; o tempo passa por props e o consumidor decide.)

- **AC-12.1** `reset-password-2` recebe o tempo de validade por props e o block não roda timer: o consumidor decrementa o valor e passa o novo a cada tick (decidido pelo dono; o nome `expiresIn` e a unidade em segundos são propostos).
- **AC-12.2** Com `expiresIn` maior que zero, o block mostra o tempo que falta acima do formulário, em `m:ss` (581 segundos aparecem como `9:41`), como texto simples fora de qualquer região `aria-live` (proposed).
- **AC-12.3** Sem `expiresIn`, `reset-password-2` se comporta exatamente como `reset-password-1`: `onSubmit({ password })`, sem token, com confirmação, retorno sobre a senha e mostrar/ocultar (proposed).
- **AC-12.4** Com `expiresIn` igual a zero ou menor, o formulário é substituído, no mesmo Card, por um estado expirado com título, descrição e o link de volta ao login; `onSubmit` não pode ser chamado (proposed).
- **AC-12.5** Quando `expiresIn` passa a zero, o foco vai ao título do estado expirado (proposed).
- **AC-12.6** No estado expirado, o botão de pedir um novo link só renderiza com `onRequestNewLink` e o chama; `pending` o desabilita e bloqueia o callback (proposed).
- **AC-12.7** Com `requestNewLinkIn` maior que zero, o botão fica desabilitado e mostra o tempo em `m:ss`, como texto simples fora de `aria-live`; com zero ou ausente, fica habilitado. A contagem é do consumidor (proposed).
- **AC-12.8** A contagem visível não é anunciada a cada segundo; o único anúncio é um aviso educado, dado uma só vez, quando falta um minuto ou menos (proposed; a alternativa é não anunciar nada).
- **AC-12.9** O link de volta ao login aparece nos dois estados, só com `loginHref`, por `renderLink` (proposed).

## 7. Rastreabilidade

### História para capacidade e critério

| História | Capacidades | Critérios |
| --- | --- | --- |
| US-1 | CAP-1 a CAP-5, CAP-7 | AC-1.1 a AC-1.4 |
| US-2 | CAP-1 a CAP-6 | AC-2.1 a AC-2.5 |
| US-3 | CAP-6 | AC-3.1 a AC-3.4 |
| US-4 | CAP-2 | AC-4.1 a AC-4.5 |
| US-5 | CAP-3, CAP-4 | AC-5.1 a AC-5.7 |
| US-6 | CAP-5 | AC-6.1 a AC-6.5 |
| US-7 | CAP-6 | AC-7.1 a AC-7.7 |
| US-8 | CAP-7 | AC-8.1 a AC-8.3 |
| US-9 | CAP-1, CAP-2, CAP-4 | AC-9.1 a AC-9.6 |
| US-10 | CAP-1 | AC-10.1 a AC-10.3 |
| US-11 | CAP-6 | AC-11.1 a AC-11.4 |
| US-12 | CAP-8 | AC-12.1 a AC-12.9 |

### Capacidade para história

| Capacidade | Histórias |
| --- | --- |
| CAP-1 | US-1, US-2, US-9, US-10 |
| CAP-2 | US-1, US-2, US-4, US-9 |
| CAP-3 | US-1, US-2, US-5 |
| CAP-4 | US-1, US-2, US-5, US-9 |
| CAP-5 | US-1, US-2, US-6 |
| CAP-6 | US-2, US-3, US-7, US-11 |
| CAP-7 | US-1, US-8 |
| CAP-8 | US-1, US-2, US-8, US-9, US-12 |

### Objetivo para história

| Objetivo | Histórias |
| --- | --- |
| OBJ-1 | US-1, US-4, US-5, US-6, US-9, US-10, US-11 |
| OBJ-2 | US-2, US-3, US-11 |
| OBJ-3 | US-7 |
| OBJ-4 | US-1 |

## 8. Restrições

- Segue o contrato dos patterns e as regras do `AGENTS.md`: sem comentários no código, Biome, `cn` de `@tc96/utils`, COSS por `@tc96/ui/<componente>`, sem override de borda, raio ou sombra num componente COSS sem exceção registrada em `scripts/override-exceptions.json`.
- Um block só importa a própria pasta e o `shared/` do grupo ([layer-decision-map](../../docs/architecture/layer-decision-map.md)); o `renderAnchor` vem de `ui`.
- O item novo de `ui` entra em `packages/ui/ui.manifest.json` (`bun run check:coss` confere).
- A mesma entrega altera dois grupos que já existem, `application/shell` e `ai-agents/flow`, para trocar o `render-link.tsx` local pelo `renderAnchor` de `ui`.
- Depende do rename do alias do CLI de `templates` para `blocks`, que acontece em outro PR. Enquanto ele não entrar, o CLI grava os blocks no alias `templates` (`AGENTS.md`).
- O [ADR 0009](../adr/0009-blocks-layer.md), que cria a camada, ainda está em `Draft`.

## 9. Questões em aberto

Nenhuma questão de produto segue aberta. Ficam com o implementador da fundação, por delegação do dono em 2026-11-22, a escolha entre a validação do `Form` do Base UI e um estado próprio para o foco, e os nomes e props dos componentes de `ui` (`design.md` §12).


## 10. Relacionados

- [ADR 0009: camada `blocks`](../adr/0009-blocks-layer.md)
- [ADR 0005: templates instaláveis](../adr/0005-installable-templates.md)
- [Mapa de decisão das camadas](../../docs/architecture/layer-decision-map.md)
- [`packages/blocks/AGENTS.md`](../../packages/blocks/AGENTS.md)
- [Acessibilidade](../../docs/accessibility.md)
- [Design: blocks de autenticação](design.md)
