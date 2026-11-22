# Design: Blocks de autenticação (`application/auth`)

- **Status:** Draft (o texto espera a revisão do dono)
- **Date:** 2026-11-22
- **Origin:** [`requirements.md`](requirements.md) (CAP-1 a CAP-7); [ADR 0009](../adr/0009-blocks-layer.md)
- **Convenção:** o que o dono decidiu está escrito sem marca. O que o texto propõe leva `(proposed)`. O que ninguém decidiu é uma lacuna `[GAP: ... — decides: ...]`. Os nomes de código ficam em inglês.

## 1. Resumo

Cinco blocks de acesso, uma variação cada (proposed): `login-1`, `signup-1`, `forgot-password-1`, `reset-password-1` e `otp-1`, em `packages/blocks/src/application/auth/<block>/`, com as peças compartilhadas em `application/auth/shared/`. Cada block é uma página controlada: recebe dados e `labels` por props e devolve eventos por callbacks. Ele compõe só COSS (`form`, `field`, `otp-field`, `card` e outros) e não importa pattern nem outro block. Provider de autenticação, sessão, cookie, redirecionamento e tema ficam no consumidor.

## 2. Objetivos e não objetivos

### Objetivos

- Um contrato comum a todo o grupo, para o consumidor ligar qualquer página do mesmo modo (CAP-6).
- Cada block instalável sozinho, com o `shared/` do grupo (CAP-1 a CAP-5, CAP-7).
- Acessível desde a instalação (OBJ-3 do PRD).

### Não objetivos

- Integração com Better Auth, Clerk, NextAuth ou Supabase; roteamento e redirecionamento; sessão e cookie.
- Cadastro de MFA, captcha, limite de tentativas.
- Biblioteca de esquema de validação dentro do block (proposed).
- i18n além de `labels`.
- Medidor de força de senha e link mágico: lacunas abertas (seção 12).
- Variações `-2` (página dividida com painel de marca ou mídia): candidatas, fora desta entrega (proposed).

## 3. O que consome

| O quê | De quem | Onde a forma está definida |
| --- | --- | --- |
| `Form` (envolve o `Form` do Base UI) | `@tc96/ui/form` | `packages/ui/src/form.tsx` |
| `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl` | `@tc96/ui/field` | `packages/ui/src/field.tsx` |
| `OTPField`, `OTPFieldInput`, `OTPFieldSeparator` | `@tc96/ui/otp-field` | `packages/ui/src/otp-field.tsx` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardPanel`, `CardFooter` | `@tc96/ui/card` | `packages/ui/src/card.tsx` |
| `Separator` | `@tc96/ui/separator` | importado por `otp-field.tsx` |
| `Input`, `Button`, `Alert` | `@tc96/ui` | não lidos para este documento; o implementador confere os nomes e as props |
| `cn` | `@tc96/utils` | `packages/ui/src/field.tsx` importa de `@tc96/utils` |
| Patterns | nenhum | o mapa de decisão prevê que os blocks de auth não usam pattern (`docs/architecture/layer-decision-map.md`, "Como o tc96 aplica", 1) |
| Pasta do grupo | `application/auth/shared/` | criada por esta entrega |

A spec do contrato do Base UI (`OTPField`, props de `Form` e `Field`) não está no input. [GAP: os nomes e o comportamento das props do `OTPField` do Base UI (tamanho do código, valor, evento de conclusão) — decides: o implementador, ao ler o componente, e o dono se algo mudar o contrato abaixo]

## 4. O que fornece

Todas as formas desta seção são (proposed), exceto o que o dono decidiu: controlado, `labels` com padrão pt-BR, `renderLink(href)`, `onSubmit(values)` tipado por block, `pending`, `error`, `fieldErrors`, `providers` com `onProviderSelect(id)`, `logo` opcional e, no OTP, `length` (padrão 6), `onComplete(code)` ou `onSubmit` e `onResend()` com `resendIn` do consumidor. Os nomes dos campos dos valores, os tipos e os padrões abaixo são a proposta.

### 4.1 Peças compartilhadas (`application/auth/shared/`)

```ts
import type { ReactElement, ReactNode } from 'react'

export type AuthRenderLink = (href: string) => ReactElement

export interface AuthProvider {
  id: string
  label: string
  icon?: ReactNode
}

export type AuthFieldErrors<TValues> = Partial<Record<keyof TValues, string>>

export interface AuthCommonLabels {
  email: string
  password: string
  errorTitle: string
  providersGroup: string
  providersSeparator: string
  providerContinue: (label: string) => string
}

export interface AuthBaseProps<TLabels> {
  error?: string
  labels?: Partial<TLabels>
  logo?: ReactNode
  pending?: boolean
  renderLink?: AuthRenderLink
}
```

- `renderAnchor` é o padrão de `renderLink`: `<a href={href} />`, com `biome-ignore lint/a11y/useAnchorContent`, como o do shell (`packages/blocks/src/application/shell/shared/render-link.tsx`).
- `resolveAuthLabels(defaults, labels)` junta `labels` parcial aos padrões, como `resolveShellLabels`.
- Os componentes internos do grupo, `AuthCard` (moldura: logo, título, descrição, mensagem do formulário, conteúdo, rodapé), `AuthProviders` (botões de provedores e separador) e o hook de foco, ficam em `shared/` e seguem com cada item que os importa.

[GAP: `renderAnchor` já existe em `application/shell/shared/` e em `ai-agents/flow/shared/`; o grupo `auth` seria a terceira cópia. Promover a peça para `ui` ou `helpers`, como o mapa de decisão prevê para peça usada por grupos diferentes, ou aceitar a cópia — decides: o dono]

### 4.2 `login-1`

```ts
export interface LoginValues {
  email: string
  password: string
}

export interface LoginLabels extends AuthCommonLabels {
  title: string
  description: string
  submit: string
  submitPending: string
  forgotPassword: string
  noAccount: string
  signup: string
}

export interface LoginProps extends AuthBaseProps<LoginLabels> {
  fieldErrors?: AuthFieldErrors<LoginValues>
  forgotPasswordHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: LoginValues) => void
  providers?: AuthProvider[]
  signupHref?: string
}
```

Padrões pt-BR (proposed): `title` "Entrar"; `description` "Informe seu e-mail e sua senha para acessar a conta."; `email` "E-mail"; `password` "Senha"; `submit` "Entrar"; `submitPending` "Entrando…"; `forgotPassword` "Esqueceu a senha?"; `noAccount` "Não tem uma conta?"; `signup` "Criar conta"; `errorTitle` "Não foi possível continuar"; `providersGroup` "Entrar com outro serviço"; `providersSeparator` "ou continue com"; `providerContinue(label)` "Continuar com {label}".

Campos: e-mail (`type="email"`, `autoComplete="username"`, `required`) e senha (`type="password"`, `autoComplete="current-password"`, `required`, sem `minLength`, porque a conta existente pode ter regra anterior).

[GAP: o login aceita só e-mail ou também nome de usuário — decides: o dono]

### 4.3 `signup-1`

```ts
export interface SignupValues {
  email: string
  password: string
}

export interface SignupLabels extends AuthCommonLabels {
  title: string
  description: string
  submit: string
  submitPending: string
  hasAccount: string
  login: string
  termsLead: string
  terms: string
  termsAnd: string
  privacy: string
}

export interface SignupProps extends AuthBaseProps<SignupLabels> {
  fieldErrors?: AuthFieldErrors<SignupValues>
  loginHref?: string
  onProviderSelect?: (id: string) => void
  onSubmit: (values: SignupValues) => void
  passwordMinLength?: number
  privacyHref?: string
  providers?: AuthProvider[]
  termsHref?: string
}
```

Padrões pt-BR (proposed): `title` "Criar conta"; `description` "Preencha os dados para começar."; `submit` "Criar conta"; `submitPending` "Criando conta…"; `hasAccount` "Já tem uma conta?"; `login` "Entrar"; `termsLead` "Ao continuar, você concorda com os"; `terms` "Termos de Uso"; `termsAnd` "e a"; `privacy` "Política de Privacidade".

Campos: e-mail (`autoComplete="email"`) e senha (`autoComplete="new-password"`, `minLength={passwordMinLength}`). O aviso de termos só renderiza os links cujo `href` o consumidor passa.

[GAP: o cadastro coleta o nome (valores e campo extra) — decides: o dono]
[GAP: termos e privacidade como caixa de seleção com aceite obrigatório ou só links — decides: o dono]
[GAP: o valor padrão de `passwordMinLength` — decides: o dono]

### 4.4 `forgot-password-1`

```ts
export interface ForgotPasswordValues {
  email: string
}

export interface ForgotPasswordLabels extends Pick<AuthCommonLabels, 'email' | 'errorTitle'> {
  title: string
  description: string
  submit: string
  submitPending: string
  backToLogin: string
}

export interface ForgotPasswordProps extends AuthBaseProps<ForgotPasswordLabels> {
  fieldErrors?: AuthFieldErrors<ForgotPasswordValues>
  loginHref?: string
  onSubmit: (values: ForgotPasswordValues) => void
}
```

Padrões pt-BR (proposed): `title` "Esqueceu a senha?"; `description` "Informe seu e-mail e enviaremos um link para redefinir a senha."; `submit` "Enviar link"; `submitPending` "Enviando…"; `backToLogin` "Voltar para entrar".

[GAP: como o block mostra a confirmação de que o e-mail foi enviado (uma prop de estado, ou o consumidor troca a página) — decides: o dono]

### 4.5 `reset-password-1`

```ts
export interface ResetPasswordValues {
  password: string
}

export interface ResetPasswordLabels extends Pick<AuthCommonLabels, 'errorTitle'> {
  title: string
  description: string
  newPassword: string
  submit: string
  submitPending: string
  backToLogin: string
}

export interface ResetPasswordProps extends AuthBaseProps<ResetPasswordLabels> {
  fieldErrors?: AuthFieldErrors<ResetPasswordValues>
  loginHref?: string
  onSubmit: (values: ResetPasswordValues) => void
  passwordMinLength?: number
}
```

Padrões pt-BR (proposed): `title` "Redefinir senha"; `description` "Escolha uma nova senha para a sua conta."; `newPassword` "Nova senha"; `submit` "Redefinir senha"; `submitPending` "Redefinindo…"; `backToLogin` "Voltar para entrar".

Campo: senha (`autoComplete="new-password"`, `minLength={passwordMinLength}`). O token de redefinição não passa pelo block: o consumidor o guarda e o usa em `onSubmit`. Um token expirado volta pelo consumidor em `error`.

[GAP: a redefinição tem o campo de confirmação; se tiver, quem confere que os dois valores batem, já que restrição nativa não compara dois campos e o block não tem biblioteca de esquema — decides: o dono]

### 4.6 `otp-1`

```ts
export interface OtpValues {
  code: string
}

export interface OtpLabels extends Pick<AuthCommonLabels, 'errorTitle'> {
  title: string
  description: (length: number, destination?: string) => string
  code: string
  digit: (position: number, total: number) => string
  submit: string
  submitPending: string
  didNotReceive: string
  resend: string
  resendIn: (seconds: number) => string
}

export interface OtpProps extends AuthBaseProps<OtpLabels> {
  destination?: string
  fieldErrors?: AuthFieldErrors<OtpValues>
  length?: number
  onComplete?: (code: string) => void
  onResend?: () => void
  onSubmit: (values: OtpValues) => void
  resendIn?: number
}
```

Padrões pt-BR (proposed): `title` "Verifique seu código"; `description` "Enviamos um código de {length} dígitos para {destination}." (sem `destination`: "Enviamos um código de {length} dígitos."); `code` "Código de verificação"; `digit` "Dígito {position} de {total}"; `submit` "Verificar"; `submitPending` "Verificando…"; `didNotReceive` "Não recebeu o código?"; `resend` "Reenviar código"; `resendIn` "Reenviar em {seconds}s".

`length` tem padrão 6. `resendIn` é o número de segundos que o consumidor controla; o block só o mostra e não roda timer próprio, a menos que o dono decida o contrário.

[GAP: o OTP chama `onSubmit` sozinho ao completar o código, ou só `onComplete`, com o botão "Verificar" enviando — decides: o dono]
[GAP: a contagem regressiva do reenvio fica no consumidor (proposto) ou em um timer do block — decides: o dono]

## 5. Invariantes e erros

Todas (proposed).

| Invariante | Efeito para quem consome |
| --- | --- |
| O block não guarda estado de envio | `pending` é do consumidor; o retorno de `onSubmit` é ignorado |
| `onSubmit` só é chamado com as restrições nativas satisfeitas (`required`, `type="email"`, `minLength`) | o consumidor recebe valores que passaram nelas; valida o resto no servidor |
| Com `pending` verdadeiro, `onSubmit`, `onProviderSelect` e `onResend` não são chamados | o envio por Enter também fica retido |
| `pending` desabilita o botão de envio, marca `aria-busy` no formulário e troca o texto por `submitPending` | |
| `fieldErrors[campo]` marca `aria-invalid` e mostra a mensagem em `FieldError` ligada ao campo | a mensagem é uma string do consumidor |
| `error` mostra um Alert do COSS com `role="alert"` e `errorTitle` | mensagem do formulário, não de um campo |
| Quando `fieldErrors` ou `error` passam de vazios a preenchidos, o foco vai ao primeiro campo inválido; sem campo inválido, vai ao Alert | o Alert recebe `tabIndex={-1}` |
| Os campos são não controlados; o block lê os valores do formulário no envio | os valores permanecem após um erro; `defaultValues` não existe nesta proposta |
| `providers` vazio ou ausente não renderiza botões nem separador | `onProviderSelect(id)` recebe o `id` do provedor |
| Um link só renderiza com o `href` passado, por `renderLink(href)` | sem `renderLink`, é `<a href>` |
| `onResend` só é chamado com `resendIn` ausente ou zero | com `resendIn` maior que zero o botão fica desabilitado e mostra `resendIn(seconds)` |
| `onComplete(code)` é chamado uma vez cada vez que o código atinge `length` | |
| `labels` é parcial e se junta aos padrões | |

Erros que o block não produz: ele não classifica falhas de rede, credenciais inválidas nem token expirado; o consumidor traduz isso em `error` e `fieldErrors`.

[GAP: usar a validação do `Form` do Base UI (`errors`, modo de validação) ou `noValidate` com estado próprio para o foco no primeiro campo inválido — decides: o dono, com o implementador]

## 6. Fatos do código

Copiados do que o pedido forneceu; nada foi aberto para conferir.

| Fato | Origem |
| --- | --- |
| `Form` envolve o `Form` do Base UI com `data-slot="form"` | `packages/ui/src/form.tsx:6-11` |
| `Field` é o `Field.Root` do Base UI; `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl` e `FieldValidity` vêm do mesmo módulo | `packages/ui/src/field.tsx:7-80` |
| `OTPField` tem `size` `default` ou `lg`; `OTPFieldInput` e `OTPFieldSeparator` completam a peça | `packages/ui/src/otp-field.tsx:8-63` |
| `Card` e `CardTitle` aceitam `render` (`useRender`), então o título pode renderizar como `h1` | `packages/ui/src/card.tsx:8-26`, `159-174` |
| `Card` já traz borda, raio e sombra; o raio é do tema do consumidor | `packages/ui/src/card.tsx:15`; `AGENTS.md` (Code conventions) |
| `ShellRenderLink = (href: string) => ReactElement` e `renderAnchor` com `biome-ignore` | `packages/blocks/src/application/shell/shared/types.ts:3`, `render-link.tsx:3-6` |
| `labels` parcial com padrão pt-BR, e `resolveShellLabels` junta | `packages/blocks/src/application/shell/shared/labels.ts:34-36` |
| Rótulos com texto interpolado são funções (`itemActions: (title) => string`) | `packages/blocks/src/application/shell/shared/labels.ts:7` |
| `boundaries:check` recusa que um block importe fora da própria pasta e do `shared/` do grupo | `packages/blocks/AGENTS.md` (Map) |
| `manifest.test.ts` confere que o item de um block leva só as pastas esperadas | `packages/blocks/AGENTS.md` (Dependents) |

## 7. Decisões de fronteira

| Decisão | Dono da decisão |
| --- | --- |
| Auth é block, não pattern: variação estrutural numerada que o consumidor edita | [ADR 0009](../adr/0009-blocks-layer.md), D1; o dono |
| Categoria Application, grupo `auth`, caminho `packages/blocks/src/application/auth/<block>/` | [ADR 0009](../adr/0009-blocks-layer.md), D3 e D4; o dono |
| Block consome patterns e `ui`; nunca importa outro block; pattern nunca importa block | [ADR 0009](../adr/0009-blocks-layer.md), D2; `boundaries:check` |
| O provider de autenticação fica no consumidor: o block é só controlado | [mapa de decisão](../../docs/architecture/layer-decision-map.md), ressalva 6 |
| O CLI alias é `blocks` | o dono; o rename acontece em outro PR |
| Peças de grupos diferentes descem para pattern ou `ui`; as do grupo ficam em `auth/shared/` | [mapa de decisão](../../docs/architecture/layer-decision-map.md), desempate 3 |
| Nenhum arquivo, classe ou dado do mercado entra no repositório; o shadcn/ui orienta só a anatomia | [ADR 0005](../adr/0005-installable-templates.md), D9 |

## 8. Alternativas

| Alternativa | Por que perde |
| --- | --- |
| Auth como patterns | recusada no [ADR 0009](../adr/0009-blocks-layer.md): são variações estruturais que o consumidor edita, sem API estável no baseline |
| Provider de autenticação dentro do block | quebra o contrato dos patterns e prende o block a um provider; a camada de lógica com serviços fica no consumidor |
| Biblioteca de esquema para validar (proposed) | o block ficaria com uma dependência npm a mais; restrições nativas mais `fieldErrors` bastam para esta entrega |
| Timer de reenvio dentro do `otp-1` (proposed) | estado de relógio dentro do block; o consumidor já sabe quando o servidor aceita um novo envio |
| Página dividida com painel de marca ou mídia como primeira variação (proposed) | cresce o escopo; fica como candidato `-2` |

## 9. Preocupações transversais

### Acessibilidade (proposed)

- Todo campo tem `FieldLabel`; nenhum placeholder substitui o rótulo.
- `CardTitle` renderiza como `h1` por `render` (o `Card` do COSS aceita `render`).
- Tokens de `autoComplete`: `username` (login), `email` (cadastro e esquecimento), `current-password`, `new-password`, `one-time-code`.
- O foco vai ao primeiro campo inválido ou ao Alert; o Alert usa `role="alert"`.
- A contagem do reenvio não fica numa região `aria-live`, para o leitor de tela não ler a cada segundo.
- Cada dígito do OTP tem o rótulo `digit(position, total)`.
- Contraste conforme `docs/accessibility.md`; qualquer razão nova entra lá.

[GAP: a página renderiza o landmark `main` ou o layout do consumidor o define — decides: o dono]

### Segurança (proposed)

- O block não registra, não guarda nem repete valores de senha ou código; os valores só saem por `onSubmit` e `onComplete`.
- A mensagem de `error` e `fieldErrors` é texto, não HTML.
- O OTP e o token de redefinição ficam fora do estado do block.
- A decisão de não revelar se um e-mail existe é do consumidor, ao escrever `error` e a confirmação.

### Estilo

Sem CSS, tema ou token no block. Só classes de layout sobre COSS. Nenhum override de borda, raio ou sombra num componente COSS, para não entrar em `scripts/override-exceptions.json` (proposed).

### Testes (proposed)

- Stories em `apps/storybook/src/blocks/application/auth/`, com `play` por garantia e axe: envio chama `onSubmit` com os valores; `pending` desabilita; erros aparecem e se ligam ao campo; os links renderizam por `renderLink`; o OTP completa e reenvia.
- Teste do item no registry: o item leva só arquivos de `application/auth`, `helpers` e as dependências COSS.
- `boundaries:check` cobre as regras de importação; o `login-1` e os demais entram em `docs/architecture/public-api-exports.json` como `block:<nome>` (`bun scripts/verify-public-api.ts --record`).

### Instalação

Cada item vai para `application/auth/<block>/` mais `application/auth/shared/`, sob o alias `blocks` do consumidor. O nome no registry não leva a categoria (`login-1`). Enquanto o refactor do CLI não entrar, a lista de blocks do `manifest.ts` e o alias de destino ainda dizem `template` (`packages/blocks/AGENTS.md`).

### i18n

Só `labels`. Sem biblioteca de i18n.

## 10. Experiência (proposed)

- Variações `-1`: um Card centralizado do COSS, com `logo` opcional no alto, título, descrição, mensagem do formulário, campos, botão de envio, provedores opcionais acima de um separador e links de rodapé.
- Login: links para recuperar a senha e criar conta. Cadastro: link para entrar e termos opcionais. Esqueceu e redefinição: link de volta ao login. OTP: dígitos em `OTPField`, botão "Verificar" e reenvio com a contagem.
- Os provedores são botões com `icon` e `label` que o consumidor passa.

[GAP: o block centraliza a página na altura da janela (`min-h-svh`) ou só desenha o Card e o consumidor o posiciona — decides: o dono]
[GAP: `logo` fica acima do Card ou dentro do cabeçalho dele — decides: o dono]

## 11. Documentação e Storybook

- Título: `Blocks/Application/Auth/<Nome>`, com `Login1`, `Signup1`, `ForgotPassword1`, `ResetPassword1` e `Otp1` (proposed, pelo precedente `AppShell1`).
- Os dados de exemplo ficam em `fixtures/` da story e não vão para o registry.

[GAP: a documentação usa as seis páginas (API Reference, Playground, Stories, Behavior, Usages, Layouts) ou a página `Doc` que os app shells usam — decides: o dono]

## 12. Lacunas abertas

- [GAP: alternar a visibilidade da senha — decides: o dono]
- [GAP: "lembrar de mim" no login (e, com ele, um valor `remember` em `LoginValues`) — decides: o dono]
- [GAP: o cadastro coleta o nome — decides: o dono]
- [GAP: termos e privacidade como caixa de seleção ou só links — decides: o dono]
- [GAP: confirmação de senha na redefinição e quem confere a igualdade — decides: o dono]
- [GAP: login só por e-mail ou também por nome de usuário — decides: o dono]
- [GAP: `passwordMinLength` padrão — decides: o dono]
- [GAP: medidor de força de senha — decides: o dono]
- [GAP: link mágico — decides: o dono]
- [GAP: o OTP envia sozinho ao completar — decides: o dono]
- [GAP: o timer do reenvio é do consumidor ou do block — decides: o dono]
- [GAP: a confirmação de "e-mail enviado" no `forgot-password-1` — decides: o dono]
- [GAP: validação do `Form` do Base UI ou estado próprio para o foco no erro — decides: o dono, com o implementador]
- [GAP: `renderAnchor` pela terceira vez, ou promovido — decides: o dono]
- [GAP: o landmark `main`, a centralização da página e a posição de `logo` — decides: o dono]
- [GAP: quantas variações por block no primeiro PR — decides: o dono]
- [GAP: seis páginas de docs ou página `Doc` — decides: o dono]
- [GAP: props do `OTPField` do Base UI e nomes de `Input`, `Button` e `Alert` do `ui`, não lidos — decides: o implementador, ao ler os componentes]
- [GAP: o tipo de teste de cada invariante (proposed) — o [ADR 0009](../adr/0009-blocks-layer.md) já deixa a confirmação dos tipos de teste com o dono — decides: o dono]

## 13. Relacionados

- [Requisitos](requirements.md)
- [ADR 0009: camada `blocks`](../adr/0009-blocks-layer.md)
- [ADR 0005: templates instaláveis](../adr/0005-installable-templates.md)
- [Mapa de decisão das camadas](../../docs/architecture/layer-decision-map.md)
- [`packages/blocks/AGENTS.md`](../../packages/blocks/AGENTS.md)
- [Acessibilidade](../../docs/accessibility.md)
