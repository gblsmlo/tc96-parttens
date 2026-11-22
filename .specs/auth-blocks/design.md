# Design: Blocks de autenticação (`application/auth`)

- **Status:** Draft (o texto espera a revisão do dono)
- **Date:** 2026-11-22
- **Origin:** [`requirements.md`](requirements.md) (CAP-1 a CAP-7); [ADR 0009](../adr/0009-blocks-layer.md)
- **Convenção:** o que o dono decidiu está escrito sem marca. O que o texto propõe leva `(proposed)`. O que ninguém decidiu é uma lacuna `[GAP: ... — decides: ...]`. Os nomes de código ficam em inglês.
- **Decisões do dono em 2026-11-22:** visibilidade da senha, lembrar de mim, nome no cadastro, confirmação de senha, retorno sobre a senha, OTP com botão Verificar, reenvio contado pelo consumidor, `renderAnchor` em `ui`; segunda rodada: termos e privacidade só como links, confirmação de "e-mail enviado" do `forgot-password-1` pela prop `sent`, documentação com uma página `Doc` por block, moldura da página inteira (`main`, centralização, `logo` acima do Card) dentro do block; propostas mantidas pelo dono (ele não se opôs): login só por e-mail, `passwordMinLength` padrão 8, uma variação por block na primeira entrega, ordem de entrega `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1`.

## 1. Resumo

Cinco blocks de acesso, uma variação cada (proposta mantida pelo dono em 2026-11-22): `login-1`, `otp-1`, `signup-1`, `reset-password-1` e `forgot-password-1`, em `packages/blocks/src/application/auth/<block>/`, com as peças compartilhadas em `application/auth/shared/`. Cada block é uma página inteira e controlada: renderiza o `main`, a centralização na janela e o `logo` acima do Card, recebe dados e `labels` por props e devolve eventos por callbacks. Ele compõe só `ui` (COSS, como `form`, `field`, `otp-field` e `card`, mais o `renderAnchor`, item próprio do repositório) e não importa pattern nem outro block. Provider de autenticação, sessão, cookie, redirecionamento e tema ficam no consumidor, que só monta o block na rota. Os campos de senha têm o botão de mostrar/ocultar; o cadastro e a redefinição têm confirmação de senha conferida pelo block e retorno sobre a senha enquanto o usuário digita; o OTP só envia pelo botão "Verificar"; o esqueci a senha troca o formulário por uma confirmação quando a prop `sent` é verdadeira.

## 2. Objetivos e não objetivos

### Objetivos

- Um contrato comum a todo o grupo, para o consumidor ligar qualquer página do mesmo modo (CAP-6).
- Cada block instalável sozinho, com o `shared/` do grupo (CAP-1 a CAP-5, CAP-7).
- Acessível desde a instalação (OBJ-3 do PRD).
- Uma só cópia de `renderAnchor`, em `ui`, para os blocks de todos os grupos (CAP-6).
- A página inteira dentro do block: o consumidor só monta o block na rota (CAP-6).

### Não objetivos

- Integração com Better Auth, Clerk, NextAuth ou Supabase; roteamento e redirecionamento; sessão e cookie.
- Cadastro de MFA, captcha, limite de tentativas.
- Biblioteca de esquema de validação dentro do block (proposed).
- i18n além de `labels`.
- Pontuação de força de senha: não faz parte da decisão do dono (o retorno é de tamanho e de tipos de caractere) e fica fora a menos que ele peça.
- Caixa de aceite dos termos e da privacidade: o dono decidiu só links.
- Login por nome de usuário (proposta mantida pelo dono em 2026-11-22).
- Link mágico: fora desta entrega (dono, 2026-11-22).
- Variações `-2` (página dividida com painel de marca ou mídia): candidatas, fora desta entrega (proposta mantida pelo dono em 2026-11-22).

## 3. O que consome

| O quê | De quem | Onde a forma está definida |
| --- | --- | --- |
| `Form` (envolve o `Form` do Base UI) | `@tc96/ui/form` | `packages/ui/src/form.tsx` |
| `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl` | `@tc96/ui/field` | `packages/ui/src/field.tsx` |
| `OTPField`, `OTPFieldInput`, `OTPFieldSeparator` | `@tc96/ui/otp-field` | `packages/ui/src/otp-field.tsx` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardPanel`, `CardFooter` | `@tc96/ui/card` | `packages/ui/src/card.tsx` |
| `Separator` | `@tc96/ui/separator` | importado por `otp-field.tsx` |
| `Input` (envolve o `Input` do Base UI; `InputGroup`, `InputGroupAddon` e `InputGroupInput` ficam em `input-group.tsx`) | `@tc96/ui/input`, `@tc96/ui/input-group` | `packages/ui/src/input.tsx`, `packages/ui/src/input-group.tsx` |
| `Button` (`variant`, `size`, `loading`, `render`; o `type` padrão é `button`, então o envio leva `type="submit"`; `loading` desabilita e mostra o `Spinner`) | `@tc96/ui/button` | `packages/ui/src/button.tsx` |
| `Alert`, `AlertTitle`, `AlertDescription` (`variant="error"`; renderiza `role="alert"` e repassa `ref` e `tabIndex`) | `@tc96/ui/alert` | `packages/ui/src/alert/alert.tsx` |
| `Checkbox` (a caixa "lembrar de mim"; `Checkbox.Root` do Base UI: `checked`, `defaultChecked`, `onCheckedChange`, `name`; não traz rótulo, então vai dentro de `FieldLabel` de um `Field`, como em `FieldCheckbox` de `apps/storybook/src/ui/checkbox/checkbox-layouts.tsx`) | `@tc96/ui/checkbox` | `packages/ui/src/checkbox.tsx` |
| `renderAnchor` | `@tc96/ui` (`@tc96/ui/render-anchor`, pelo padrão `@tc96/ui/<componente>`) | `packages/ui/src/render-anchor.tsx`, criado por esta entrega; o nome do arquivo e do export é proposto (proposed) |
| `cn` | `@tc96/utils` | `packages/ui/src/field.tsx` importa de `@tc96/utils` |
| Patterns | nenhum | o mapa de decisão prevê que os blocks de auth não usam pattern (`docs/architecture/layer-decision-map.md`, "Como o tc96 aplica", 1) |
| Pasta do grupo | `application/auth/shared/` | criada por esta entrega |

Props lidas pelo implementador da fundação (T10, 2026-11-22): `OTPField` repassa as props de `OTPField.Root` do Base UI (`node_modules/@base-ui/react/otp-field/root/OTPFieldRoot.d.mts`): `length` (obrigatória), `value` e `defaultValue`, `onValueChange`, `onValueComplete(value, eventDetails)` (o evento de conclusão), `autoSubmit` (padrão `false`; ligado, envia o formulário ao completar) e `autoComplete` (padrão `one-time-code`); `size` é `default` ou `lg` (`packages/ui/src/otp-field.tsx`). O `otp-1` não liga `autoSubmit`, e `onComplete(code)` sai de `onValueComplete` (proposed). `Form` (`packages/ui/src/form.tsx`) repassa as props de `Form` do Base UI: `errors`, `onFormSubmit(values)`, `validationMode`, `ref`. As props de `Field` e `Field.Error` seguem o Base UI (`name` do `Field` liga o campo ao `errors` do `Form`).

## 4. O que fornece

Todas as formas desta seção são (proposed), exceto o que o dono decidiu: controlado, `labels` com padrão pt-BR, `renderLink(href)`, `onSubmit(values)` tipado por block, `pending`, `error`, `fieldErrors`, `providers` com `onProviderSelect(id)` e `logo` opcional; a moldura da página inteira dentro do block (`main`, centralização vertical, `logo` acima do Card); o botão de mostrar/ocultar em todo campo de senha, com os textos em `labels`; `remember` no login, com o valor em `onSubmit`; o login só por e-mail; o nome no cadastro; os termos e a privacidade do cadastro só como links, sem caixa de aceite e sem valor em `onSubmit`; a confirmação de senha no cadastro e na redefinição, conferida pelo block; o retorno sobre o número de caracteres e sobre os tipos de caractere sugeridos na senha nova, com `passwordMinLength` padrão 8; a prop booleana `sent` do `forgot-password-1`, que troca o formulário por uma confirmação no mesmo Card, com link de volta ao login e opção de reenviar; e, no OTP, `length` (padrão 6), o botão "Verificar" como único caminho até `onSubmit`, `onComplete(code)` opcional como notificação e `onResend()` com `resendIn` do consumidor, sem timer no block. Os nomes dos campos dos valores, os tipos, os textos e os padrões abaixo são a proposta.

### 4.1 Peças compartilhadas (`application/auth/shared/`)

```ts
import type { ReactNode } from 'react'
import type { RenderLink } from '@tc96/ui/render-anchor'

export type AuthRenderLink = RenderLink

export interface AuthProvider {
  id: string
  label: string
  icon?: ReactNode
}

export type AuthFieldErrors<TValues> = Partial<Record<keyof TValues, string>>

export type AuthPasswordSuggestion = 'lowercase' | 'uppercase' | 'number' | 'symbol'

export interface AuthCommonLabels {
  email: string
  password: string
  showPassword: string
  hidePassword: string
  errorTitle: string
  providersGroup: string
  providersSeparator: string
  providerContinue: (label: string) => string
}

export interface AuthNewPasswordLabels {
  confirmPassword: string
  passwordMismatch: string
  passwordLength: (count: number, minLength: number) => string
  passwordSuggestionsTitle: string
  suggestionLowercase: string
  suggestionUppercase: string
  suggestionNumber: string
  suggestionSymbol: string
  suggestionMet: string
  suggestionMissing: string
}

export interface AuthBaseProps<TLabels> {
  error?: string
  labels?: Partial<TLabels>
  logo?: ReactNode
  pending?: boolean
  renderLink?: AuthRenderLink
}
```

- `renderAnchor` vem de `ui`, não de `auth/shared/`: é o padrão de `renderLink`, `<a href={href} />` com `biome-ignore lint/a11y/useAnchorContent`, como o que hoje está em `application/shell/shared/render-link.tsx`. O item de `ui` é próprio do repositório (`origin: "own"`, como Text e IconFrame), listado em `packages/ui/ui.manifest.json`. O tipo `RenderLink`, exportado pelo mesmo arquivo, e o alias `AuthRenderLink = RenderLink` são propostos (proposed).
- A mesma entrega move `application/shell/shared/render-link.tsx` e `ai-agents/flow/shared/render-link.tsx` para o item de `ui`: os dois grupos passam a importar `renderAnchor` de `@tc96/ui`. `ShellRenderLink` e `FlowRenderLink` podem ficar como aliases de grupo do mesmo tipo (proposed).
- `resolveAuthLabels(defaults, labels)` junta `labels` parcial aos padrões, como `resolveShellLabels`.
- Os componentes internos do grupo ficam em `shared/` e seguem com cada item que os importa: `AuthCard` (moldura da página inteira: `main`, centralização, logo acima do Card, título, descrição, mensagem do formulário, conteúdo, rodapé), `AuthProviders` (botões de provedores e separador), o hook de foco, `AuthPasswordField` (campo de senha com o botão de mostrar/ocultar) e `AuthPasswordFeedback` (retorno sobre a senha nova) (proposed, os nomes; se a moldura da página e o Card se separarem, o nome da moldura pode ser `AuthPage`).
- `getPasswordSuggestions(password, suggestions)`, função pura e sem React, devolve quais tipos sugeridos a senha já tem (proposed).

**Moldura da página.** O block renderiza a página inteira: o landmark `main`, o conteúdo centralizado na vertical na altura da janela e o `logo` acima do Card, fora dele. O consumidor só monta o block na rota. Detalhes propostos: a centralização usa `min-h-svh` com `flex`, `items-center` e `justify-center` e um respiro nas bordas; o `logo` e o Card ficam numa coluna de largura limitada; sem `logo`, nada é renderizado no lugar; o consumidor não envolve o block em outro `main`, porque a página deve ter um só (proposed).

**Mostrar/ocultar a senha.** Todo campo de senha de `login-1`, `signup-1` e `reset-password-1`, a confirmação incluída, tem um botão que alterna entre mostrar e ocultar. Os textos do botão e o nome acessível vêm de `labels.showPassword` e `labels.hidePassword`. O estado visível ou oculto fica dentro do block, como estado de interação. Detalhes propostos: cada campo tem o próprio estado e começa oculto; o botão é `type="button"` e seu nome acessível muda com o estado; alternar não muda o valor do campo nem envia o formulário (proposed).

**Confirmação da senha.** `signup-1` e `reset-password-1` têm um segundo campo de senha. No envio, o block confere que os dois valores batem. Se não batem, ele mostra o erro de `labels.passwordMismatch` no campo de confirmação, move o foco para ele e não chama `onSubmit`. Detalhes propostos: o campo se chama `confirmPassword`, é `required` e usa `autoComplete="new-password"`; o valor da confirmação não é enviado, e os valores trazem só `password`; a mensagem some quando o usuário edita um dos dois campos; a conferência roda depois das restrições nativas (proposed). O consumidor não pode definir erro para a confirmação por `fieldErrors`, porque ela não é uma chave dos valores (proposed).

**Retorno sobre a senha nova.** O campo de senha nova de `signup-1` e `reset-password-1` mostra, enquanto o usuário digita: (a) o número de caracteres em relação ao tamanho mínimo (por exemplo "6 de 8 caracteres") e (b) os tipos de caractere sugeridos (por exemplo letra minúscula, letra maiúscula, número e símbolo). Os textos vêm de `labels` (`AuthNewPasswordLabels`). O tamanho mínimo é `passwordMinLength`, com padrão 8 (proposta mantida pelo dono em 2026-11-22); é o mesmo número da restrição `minLength` e do retorno "n de N caracteres". Uma pontuação de força não faz parte da decisão. Detalhes propostos:

- a lista de sugestões padrão é minúscula, maiúscula, número e símbolo; o consumidor a configura por `passwordSuggestions?: AuthPasswordSuggestion[]`, e uma lista vazia esconde as sugestões;
- as sugestões são conselhos e não bloqueiam o envio; só `minLength` bloqueia, pela restrição nativa;
- o retorno liga-se ao campo por `aria-describedby`; um anúncio educado (`aria-live="polite"`) avisa só quando o mínimo é atingido ou quando uma sugestão passa de faltando a atendida (ou o contrário), sem anunciar cada tecla;
- cada sugestão mostra o estado em texto (`suggestionMet`, `suggestionMissing`), não só em cor;
- o valor da senha nova é lido por um estado de interação do block só para calcular o retorno (proposed).

Padrões pt-BR (proposed): `showPassword` "Mostrar senha"; `hidePassword` "Ocultar senha"; `confirmPassword` "Confirmar senha"; `passwordMismatch` "As senhas não coincidem."; `passwordLength(count, minLength)` "{count} de {minLength} caracteres" (o padrão limita `count` ao mínimo); `passwordSuggestionsTitle` "Para uma senha mais segura, use:"; `suggestionLowercase` "letra minúscula"; `suggestionUppercase` "letra maiúscula"; `suggestionNumber` "número"; `suggestionSymbol` "símbolo"; `suggestionMet` "atendida"; `suggestionMissing` "faltando".

### 4.2 `login-1`

```ts
export interface LoginValues {
  email: string
  password: string
  remember: boolean
}

export interface LoginLabels extends AuthCommonLabels {
  title: string
  description: string
  submit: string
  submitPending: string
  remember: string
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

`remember` é o valor da caixa "lembrar de mim", que viaja em `onSubmit`; o nome `remember` é proposto (proposed).

O login identifica só por e-mail: não há campo de nome de usuário, e `LoginValues` não tem chave para ele (proposta mantida pelo dono em 2026-11-22).

Padrões pt-BR (proposed): `title` "Entrar"; `description` "Informe seu e-mail e sua senha para acessar a conta."; `email` "E-mail"; `password` "Senha"; `submit` "Entrar"; `submitPending` "Entrando…"; `remember` "Lembrar de mim"; `forgotPassword` "Esqueceu a senha?"; `noAccount` "Não tem uma conta?"; `signup` "Criar conta"; `errorTitle` "Não foi possível continuar"; `providersGroup` "Entrar com outro serviço"; `providersSeparator` "ou continue com"; `providerContinue(label)` "Continuar com {label}".

Campos: e-mail (`type="email"`, `autoComplete="username"`, `required`; o token `username` fica por ser o que os gerenciadores de senha esperam no campo de identificação, mesmo só com e-mail (proposed)), senha (`type="password"`, `autoComplete="current-password"`, `required`, sem `minLength`, porque a conta existente pode ter regra anterior; com o botão de mostrar/ocultar) e a caixa "lembrar de mim" (`remember`, desmarcada por padrão, e `false` no valor quando desmarcada) (proposed, o estado inicial e o valor).

### 4.3 `signup-1`

```ts
export interface SignupValues {
  name: string
  email: string
  password: string
}

export interface SignupLabels extends AuthCommonLabels, AuthNewPasswordLabels {
  title: string
  description: string
  name: string
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
  passwordSuggestions?: AuthPasswordSuggestion[]
  privacyHref?: string
  providers?: AuthProvider[]
  termsHref?: string
}
```

`SignupValues.name` é o nome coletado além de e-mail e senha; a chave `name` e a obrigatoriedade são propostas (proposed). Os valores não levam a confirmação (ver 4.1).

`passwordMinLength` tem padrão 8 (proposta mantida pelo dono em 2026-11-22).

**Termos e privacidade.** O aviso é só texto com links: "Ao criar a conta você concorda com…" e os links de termos e de privacidade que o consumidor passa em `termsHref` e `privacyHref`. Não há caixa de aceite, e o aceite não gera campo nem valor em `SignupValues`. Detalhes propostos: o aviso só renderiza os links cujo `href` o consumidor passa, por `renderLink(href)`; sem nenhum dos dois `href`, o aviso não renderiza (proposed).

Padrões pt-BR (proposed): `title` "Criar conta"; `description` "Preencha os dados para começar."; `name` "Nome"; `submit` "Criar conta"; `submitPending` "Criando conta…"; `hasAccount` "Já tem uma conta?"; `login` "Entrar"; `termsLead` "Ao criar a conta você concorda com os"; `terms` "Termos de Uso"; `termsAnd` "e a"; `privacy` "Política de Privacidade". Os textos de senha, confirmação e retorno são os de 4.1.

Campos: nome (`autoComplete="name"`, `required` (proposed)), e-mail (`autoComplete="email"`), senha (`autoComplete="new-password"`, `minLength={passwordMinLength}`, com o botão de mostrar/ocultar e o retorno sobre a senha) e confirmação da senha (com o botão de mostrar/ocultar).

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
  sentTitle: string
  sentDescription: (destination?: string) => string
  didNotReceive: string
  resend: string
  resendIn: (seconds: number) => string
}

export interface ForgotPasswordProps extends AuthBaseProps<ForgotPasswordLabels> {
  destination?: string
  fieldErrors?: AuthFieldErrors<ForgotPasswordValues>
  loginHref?: string
  onResend?: () => void
  onSubmit: (values: ForgotPasswordValues) => void
  resendIn?: number
  sent?: boolean
}
```

Os campos novos são `sent` (decidido pelo dono) e, propostos, `destination`, `onResend`, `resendIn` e os rótulos `sentTitle`, `sentDescription`, `didNotReceive`, `resend` e `resendIn` (proposed).

Padrões pt-BR (proposed): `title` "Esqueceu a senha?"; `description` "Informe seu e-mail e enviaremos um link para redefinir a senha."; `submit` "Enviar link"; `submitPending` "Enviando…"; `backToLogin` "Voltar para entrar"; `sentTitle` "Verifique seu e-mail"; `sentDescription(destination)` "Enviamos um link para redefinir a senha para {destination}." (sem `destination`: "Enviamos um link para redefinir a senha para o seu e-mail."); `didNotReceive` "Não recebeu o e-mail?"; `resend` "Reenviar e-mail"; `resendIn` "Reenviar em {seconds}s".

**Confirmação "e-mail enviado" (`sent`).** `sent` é uma prop booleana do consumidor. Com `sent` verdadeiro, o block substitui o formulário por uma confirmação dentro do mesmo Card, com um link de volta ao login e a opção de reenviar. O consumidor decide quando `sent` fica verdadeiro, normalmente depois de `onSubmit` ter dado certo; o block não guarda esse estado. Detalhes propostos:

- `sent` ausente equivale a `false`;
- a confirmação mostra `sentTitle` como título (`h1`, no lugar de `title`) e `sentDescription(destination)` no lugar de `description`; o endereço só aparece quando o consumidor passa `destination`, e o block não lê o e-mail do formulário;
- o botão de reenvio (`resend`) só renderiza quando o consumidor passa `onResend`; ele chama `onResend()`, fica desabilitado enquanto `resendIn` for maior que zero e mostra `resendIn(seconds)`; a contagem é do consumidor, como no `otp-1`, e o block não roda timer;
- o link de volta ao login (`backToLogin`) segue a regra de `loginHref` e `renderLink`;
- quando `sent` passa de falso a verdadeiro, o foco vai ao título da confirmação (`tabIndex={-1}`), sem região `aria-live` extra, para o leitor de tela não anunciar duas vezes;
- `error` continua aparecendo no Alert enquanto `sent` for verdadeiro, para o consumidor informar uma falha no reenvio; com `pending`, `onResend` não é chamado.

### 4.5 `reset-password-1`

```ts
export interface ResetPasswordValues {
  password: string
}

export interface ResetPasswordLabels
  extends Pick<AuthCommonLabels, 'errorTitle' | 'showPassword' | 'hidePassword'>,
    AuthNewPasswordLabels {
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
  passwordSuggestions?: AuthPasswordSuggestion[]
}
```

`passwordMinLength` tem padrão 8, o mesmo número do retorno "n de N caracteres" (proposta mantida pelo dono em 2026-11-22).

Padrões pt-BR (proposed): `title` "Redefinir senha"; `description` "Escolha uma nova senha para a sua conta."; `newPassword` "Nova senha"; `submit` "Redefinir senha"; `submitPending` "Redefinindo…"; `backToLogin` "Voltar para entrar". Os textos de confirmação e retorno são os de 4.1.

Campos: senha nova (`autoComplete="new-password"`, `minLength={passwordMinLength}`, com o botão de mostrar/ocultar e o retorno sobre a senha) e confirmação da senha (com o botão de mostrar/ocultar; ver 4.1). `onSubmit` recebe só `password`. O token de redefinição não passa pelo block: o consumidor o guarda e o usa em `onSubmit`. Um token expirado volta pelo consumidor em `error`.

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

`length` tem padrão 6. O block não envia sozinho: há sempre o botão "Verificar", e `onSubmit` só roda por ele ou por Enter. `onComplete(code)` é opcional e só notifica que o código ficou completo; não envia. `resendIn` é o número de segundos que o consumidor controla: o block só o mostra, desabilita o botão de reenvio enquanto ele for maior que zero e não roda timer.

**Código vazio ou incompleto (decidido pelo implementador, opção A, 2026-11-22).** O `OtpField` deixa as restrições nativas no input de validação que o `OTPField` renderiza escondido (`required` e o `pattern` de `length` dígitos). Um código vazio ou incompleto é barrado por elas no envio: o `Form` não chama `onFormSubmit`, foca o primeiro dígito e o `FieldError` mostra a mensagem do navegador (o `validationMessage`, já localizado; não há rótulo para ela em `labels`, como no `login-1`). Os dígitos só recebem `aria-invalid` por `fieldErrors`: o Base UI deriva o estado inválido dos dígitos dos erros do `Form` (`errors`) e da prop `invalid` do `Field`, não da validade nativa, e um `validate` do `Field` não chega a rodar enquanto uma restrição nativa falha. A guarda `code.length < length` em `onFormSubmit` continua, além das restrições. Marcar os dígitos como inválidos nesses casos exigiria que o dono aceitasse tirar as restrições nativas do `OtpField` (sem `required` e com `validationType="none"` e `normalizeValue`) e trocá-las por estado ou erro do próprio block; isso fica ligado ao ponto em aberto da §5.2 sobre as mensagens nativas serem as do navegador (decisão do dono pendente), que vale igual para o `login-1`.

## 5. Invariantes e erros

### 5.1 Decididos pelo dono

| Invariante | Efeito para quem consome |
| --- | --- |
| Todo campo de senha de `login-1`, `signup-1` e `reset-password-1`, a confirmação incluída, tem um botão de mostrar/ocultar; o estado visível ou oculto é estado de interação do block | o texto e o nome acessível do botão vêm de `labels.showPassword` e `labels.hidePassword`; (proposed) o botão é `type="button"`, e alternar não muda o valor nem envia |
| `onSubmit` do login recebe `remember` com o valor da caixa "lembrar de mim" | (proposed) `remember` é `false` com a caixa desmarcada; o block não guarda nada além disso |
| O login identifica só por e-mail (proposta mantida pelo dono em 2026-11-22) | `LoginValues` traz `email`, `password` e `remember`; não há chave de nome de usuário |
| `signup-1` coleta o nome | `SignupValues.name`; a chave e a obrigatoriedade são propostas |
| Termos e privacidade do `signup-1` são só links, sem caixa de aceite | `SignupValues` não ganha chave por causa deles; o aviso renderiza os links que o consumidor passa por `href` |
| `passwordMinLength` tem padrão 8 (proposta mantida pelo dono em 2026-11-22) | o mesmo número vale para `minLength` e para o retorno "n de N caracteres" |
| Em `signup-1` e `reset-password-1`, o block confere que a senha e a confirmação batem; se não batem, mostra `labels.passwordMismatch` no campo de confirmação, move o foco para ele e não chama `onSubmit` | o consumidor só recebe `onSubmit` com os dois valores iguais; (proposed) o valor da confirmação não é enviado |
| O campo de senha nova mostra, enquanto o usuário digita, o retorno sobre o número de caracteres em relação ao mínimo e sobre os tipos de caractere sugeridos | (proposed) as sugestões não bloqueiam o envio, só `minLength`; o retorno é ligado ao campo por `aria-describedby` e anunciado de forma educada, sem anunciar cada tecla |
| `forgot-password-1` com `sent` verdadeiro troca o formulário por uma confirmação dentro do mesmo Card, com link de volta ao login e opção de reenviar | `sent` é do consumidor; o block não guarda estado de "enviado"; (proposed) `onResend` só existe quando o consumidor o passa, e o endereço só aparece com `destination` |
| O block renderiza a moldura da página inteira: `main`, centralização vertical na janela e `logo` acima do Card | o consumidor só monta o block na rota; (proposed) não envolve o block em outro `main`, e `min-h-svh` é a classe de centralização |
| `otp-1` tem sempre o botão "Verificar"; `onSubmit` só roda por ele ou por Enter | completar o código não envia; (proposed) `onSubmit` não roda com o código incompleto |
| `onComplete(code)` é uma notificação opcional de código completo | é chamado uma vez cada vez que o código atinge `length` e não envia o formulário |
| A contagem do reenvio é do consumidor: o block mostra `resendIn` e não roda timer; `onResend` só é chamado com `resendIn` ausente ou zero | com `resendIn` maior que zero o botão fica desabilitado e mostra `resendIn(seconds)`; no `forgot-password-1` a mesma regra vale para o reenvio da confirmação (proposed) |

### 5.2 Propostos

Todos (proposed).

| Invariante | Efeito para quem consome |
| --- | --- |
| O block não guarda estado de envio | `pending` é do consumidor; o retorno de `onSubmit` é ignorado |
| `onSubmit` só é chamado com as restrições nativas satisfeitas (`required`, `type="email"`, `minLength`) | o consumidor recebe valores que passaram nelas; valida o resto no servidor |
| Com `pending` verdadeiro, `onSubmit`, `onProviderSelect` e `onResend` não são chamados | o envio por Enter também fica retido |
| `pending` desabilita o botão de envio, marca `aria-busy` no formulário e troca o texto por `submitPending` | |
| `fieldErrors[campo]` marca `aria-invalid` e mostra a mensagem em `FieldError` ligada ao campo | a mensagem é uma string do consumidor |
| `error` mostra um Alert do COSS com `role="alert"` e `errorTitle` | mensagem do formulário, não de um campo |
| Quando `fieldErrors` ou `error` passam de vazios a preenchidos, o foco vai ao primeiro campo inválido; sem campo inválido, vai ao Alert | o Alert recebe `tabIndex={-1}` |
| Quando `sent` do `forgot-password-1` passa de falso a verdadeiro, o foco vai ao título da confirmação | o título recebe `tabIndex={-1}`; não há região `aria-live` extra |
| Os campos são não controlados; o block lê os valores do formulário no envio | os valores permanecem após um erro; `defaultValues` não existe nesta proposta |
| O estado de interação do block é só a visibilidade de cada campo de senha, o valor da senha nova para o retorno e a mensagem de divergência da confirmação | o block não guarda mais nada; a mensagem de divergência some quando um dos dois campos é editado |
| `providers` vazio ou ausente não renderiza botões nem separador | `onProviderSelect(id)` recebe o `id` do provedor |
| Um link só renderiza com o `href` passado, por `renderLink(href)` | sem `renderLink`, é o `renderAnchor` de `ui` |
| `labels` é parcial e se junta aos padrões | |

Erros que o block não produz: ele não classifica falhas de rede, credenciais inválidas nem token expirado; o consumidor traduz isso em `error` e `fieldErrors`. O único erro de campo que o block produz é o da confirmação que não bate.

**Validação (decidida pelo implementador da fundação, por delegação do dono, 2026-11-22; T9).** Os blocks usam o `Form` do COSS (`@tc96/ui/form`, o `Form` do Base UI): ele define `noValidate`, valida as restrições nativas no envio, bloqueia o envio e foca o primeiro controle inválido. A prop `errors` é indexada pelo `name` do `Field`, marca `aria-invalid`, mostra o `FieldError` e limpa quando o campo é editado; o block a monta com `useMemo(() => toFormErrors(fieldErrors), [fieldErrors])`, para o objeto só mudar quando `fieldErrors` mudar. O block liga `ref={formRef}`, `onFormSubmit={(values) => ...}` (que ignora o envio com `pending`) e `aria-busy={pending}`. O hook `useFocusFirstInvalid({ formRef, alertRef, error, fieldErrors })` cobre só o que o `Form` não cobre: o `Alert` e os erros de campo que chegam sem um envio. O contrato do dono não muda. As mensagens das restrições nativas (`required`, `type="email"`, `minLength`) são o `validationMessage` do navegador, já localizado; o dono as mantém por ora, e não há rótulo para elas em `labels`.

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
| `ai-agents/flow/shared/render-link.tsx` tem uma cópia da mesma peça (`FlowRenderLink`) | informado no pedido do dono; não aberto |
| `labels` parcial com padrão pt-BR, e `resolveShellLabels` junta | `packages/blocks/src/application/shell/shared/labels.ts:34-36` |
| Rótulos com texto interpolado são funções (`itemActions: (title) => string`) | `packages/blocks/src/application/shell/shared/labels.ts:7` |
| `boundaries:check` recusa que um block importe fora da própria pasta e do `shared/` do grupo | `packages/blocks/AGENTS.md` (Map) |
| `manifest.test.ts` confere que o item de um block leva só as pastas esperadas | `packages/blocks/AGENTS.md` (Dependents) |
| Todo arquivo de `packages/ui` tem de estar listado em `packages/ui/ui.manifest.json`; `bun run check:coss` confere | `AGENTS.md` (Rules that are enforced by scripts) |

## 7. Decisões de fronteira

| Decisão | Dono da decisão |
| --- | --- |
| Auth é block, não pattern: variação estrutural numerada que o consumidor edita | [ADR 0009](../adr/0009-blocks-layer.md), D1; o dono |
| Categoria Application, grupo `auth`, caminho `packages/blocks/src/application/auth/<block>/` | [ADR 0009](../adr/0009-blocks-layer.md), D3 e D4; o dono |
| Block consome patterns e `ui`; nunca importa outro block; pattern nunca importa block | [ADR 0009](../adr/0009-blocks-layer.md), D2; `boundaries:check` |
| O provider de autenticação fica no consumidor: o block é só controlado | [mapa de decisão](../../docs/architecture/layer-decision-map.md), ressalva 6 |
| O CLI alias é `blocks` | o dono; o rename acontece em outro PR |
| Peças de grupos diferentes descem para pattern ou `ui`; as do grupo ficam em `auth/shared/` | [mapa de decisão](../../docs/architecture/layer-decision-map.md), desempate 3 |
| `renderAnchor` é uma peça sem domínio usada por blocks de grupos diferentes (`shell`, `flow` e `auth`), então desce para `ui` como item próprio (`origin: "own"`, como Text e IconFrame); os blocks de auth importam de `@tc96/ui`, e a mesma entrega move para ele os `render-link.tsx` de `application/shell/shared` e de `ai-agents/flow/shared` | o dono, em 2026-11-22; [mapa de decisão](../../docs/architecture/layer-decision-map.md) |
| Estado dentro do block: só estado de interação (visibilidade da senha, valor da senha nova para o retorno, divergência da confirmação); nada de envio, sessão ou provider | o dono, em 2026-11-22; contrato dos patterns |
| O block renderiza a moldura da página inteira (`main`, centralização vertical, `logo` acima do Card); o consumidor só monta o block na rota | o dono, em 2026-11-22 (segunda rodada) |
| A confirmação "e-mail enviado" do `forgot-password-1` é a prop `sent`; o consumidor não troca de página | o dono, em 2026-11-22 (segunda rodada) |
| Termos e privacidade do cadastro são só links, sem caixa de aceite | o dono, em 2026-11-22 (segunda rodada) |
| A documentação é uma página `Doc` por block, como `AppShell1` a `AppShell4` e os editores de fluxo | o dono, em 2026-11-22 (segunda rodada) |
| Login só por e-mail; `passwordMinLength` padrão 8; uma variação por block; ordem `login-1`, `otp-1`, `signup-1`, `reset-password-1`, `forgot-password-1` | o dono, em 2026-11-22: propostas mantidas (ele não se opôs) |
| Nenhum arquivo, classe ou dado do mercado entra no repositório; o shadcn/ui orienta só a anatomia | [ADR 0005](../adr/0005-installable-templates.md), D9 |

## 8. Alternativas

| Alternativa | Por que perde |
| --- | --- |
| Auth como patterns | recusada no [ADR 0009](../adr/0009-blocks-layer.md): são variações estruturais que o consumidor edita, sem API estável no baseline |
| Provider de autenticação dentro do block | quebra o contrato dos patterns e prende o block a um provider; a camada de lógica com serviços fica no consumidor |
| Biblioteca de esquema para validar (proposed) | o block ficaria com uma dependência npm a mais; restrições nativas mais `fieldErrors` bastam para esta entrega |
| Timer de reenvio dentro do `otp-1` | o dono decidiu que a contagem é do consumidor: estado de relógio fora do block, e o consumidor já sabe quando o servidor aceita um novo envio |
| OTP que envia sozinho ao completar o código | recusada pelo dono: o botão "Verificar" é o único caminho até `onSubmit`; `onComplete` só notifica |
| O consumidor conferir a confirmação da senha por `fieldErrors` | recusada pelo dono: o block confere que os dois valores batem |
| Pontuação de força da senha | fora da decisão do dono, que escolheu o retorno sobre tamanho e tipos de caractere; só entra se ele pedir |
| Terceira cópia de `renderAnchor` em `auth/shared/` | recusada pelo dono: peça sem domínio usada por grupos diferentes desce para `ui` |
| `renderAnchor` em `helpers` | `helpers` é livre de React e `renderAnchor` devolve um elemento (proposed) |
| Caixa de aceite obrigatória para termos e privacidade | recusada pelo dono: só links, sem campo nem valor extra em `onSubmit` |
| O consumidor trocar a página para mostrar "e-mail enviado" | recusada pelo dono: o block mostra a confirmação pela prop `sent`, no mesmo Card |
| O layout do consumidor definir o `main`, a centralização e a posição do `logo` | recusada pelo dono: o block renderiza a moldura da página inteira |
| `logo` dentro do cabeçalho do Card | recusada pelo dono: o `logo` fica acima do Card |
| Seis páginas de documentação (API Reference, Playground, Stories, Behavior, Usages, Layouts) | recusada pelo dono: uma página `Doc` por block |
| Login por nome de usuário além do e-mail | não adotada: o dono manteve só e-mail (proposta mantida em 2026-11-22) |
| Página dividida com painel de marca ou mídia como primeira variação | cresce o escopo; fica como candidato `-2`, fora da primeira entrega (proposta mantida pelo dono em 2026-11-22) |

## 9. Preocupações transversais

### Acessibilidade (proposed)

- Todo campo tem `FieldLabel`; nenhum placeholder substitui o rótulo.
- O block renderiza o landmark `main` (decidido); a página deve ter um só, então o consumidor não envolve o block em outro (proposed). `CardTitle` renderiza como `h1` por `render` (o `Card` do COSS aceita `render`).
- Tokens de `autoComplete`: `username` (login), `name` (nome do cadastro), `email` (cadastro e esquecimento), `current-password`, `new-password` (senha nova e confirmação), `one-time-code`.
- O botão de mostrar/ocultar é `type="button"`, alcançável por teclado, e seu nome acessível vem de `labels.showPassword` e `labels.hidePassword` e muda com o estado; Enter no campo envia o formulário e não alterna a visibilidade.
- O retorno sobre a senha liga-se ao campo por `aria-describedby`. O anúncio é educado (`aria-live="polite"`) e só ocorre quando uma condição muda (mínimo atingido, sugestão atendida ou perdida), não a cada tecla; o estado de cada sugestão aparece em texto, não só em cor.
- Na confirmação que não bate, o erro é `FieldError` ligado ao campo de confirmação, com `aria-invalid`, e o foco vai para ele.
- O foco vai ao primeiro campo inválido ou ao Alert; o Alert usa `role="alert"`.
- No `forgot-password-1`, quando `sent` passa a verdadeiro, o foco vai ao título da confirmação (`h1` com `tabIndex={-1}`), e a confirmação não cria região `aria-live` extra.
- A contagem do reenvio, no `otp-1` e na confirmação do `forgot-password-1`, não fica numa região `aria-live`, para o leitor de tela não ler a cada segundo.
- Cada dígito do OTP tem o rótulo `digit(position, total)`.
- Contraste conforme `docs/accessibility.md`; qualquer razão nova entra lá.

### Segurança (proposed)

- O block não registra, não guarda nem repete valores de senha ou código; os valores só saem por `onSubmit` e `onComplete`. A exceção é o valor da senha nova no estado de interação, que existe só para o retorno e não é registrado, persistido nem exibido fora do campo (e do botão de mostrar).
- A mensagem de `error` e `fieldErrors` é texto, não HTML.
- O OTP e o token de redefinição ficam fora do estado do block.
- A decisão de não revelar se um e-mail existe é do consumidor, ao escrever `error`, a confirmação (`sent`) e o `destination`.

### Estilo

Sem CSS, tema ou token no block. Só classes de layout sobre COSS, entre elas as da moldura da página (`min-h-svh` e o alinhamento, propostos). Nenhum override de borda, raio ou sombra num componente COSS, para não entrar em `scripts/override-exceptions.json` (proposed).

### Testes (proposed)

- Stories em `apps/storybook/src/blocks/application/auth/`, com `play` por garantia e axe: envio chama `onSubmit` com os valores (incluindo `name` e `remember`); `pending` desabilita; erros aparecem e se ligam ao campo; os links renderizam por `renderLink`; o botão de mostrar/ocultar alterna o tipo do campo e o nome acessível; a confirmação que não bate mostra o erro, move o foco e não chama `onSubmit`; o retorno sobre a senha muda enquanto se digita e não bloqueia o envio; o OTP chama `onComplete` ao completar sem enviar, e `onSubmit` só roda pelo "Verificar"; o reenvio fica desabilitado com `resendIn` maior que zero; com `sent` verdadeiro o `forgot-password-1` mostra a confirmação no lugar do formulário, com o link de volta, o reenvio (`onResend` e `resendIn`) e o foco no título; a página tem um `main` e o `logo` vem acima do Card e fora dele.
- As stories das páginas inteiras usam `parameters.layout: 'fullscreen'`, para o `min-h-svh` ocupar a janela da story (proposed).
- Teste de `getPasswordSuggestions` em `bun test`, por ser código que não renderiza (`AGENTS.md`).
- Teste do item no registry: o item leva só arquivos de `application/auth`, `helpers` e as dependências de `ui` (COSS e `render-anchor`).
- `bun run check:coss` confere a entrada de `render-anchor` em `packages/ui/ui.manifest.json`; os testes e as stories de `application/shell` e `ai-agents/flow` continuam verdes depois da troca do `render-link.tsx` (proposed).
- `boundaries:check` cobre as regras de importação; o `login-1` e os demais entram em `docs/architecture/public-api-exports.json` como `block:<nome>` (`bun scripts/verify-public-api.ts --record`).

### Instalação

Cada item vai para `application/auth/<block>/` mais `application/auth/shared/`, sob o alias `blocks` do consumidor, e traz os itens de `ui` de que depende, o `render-anchor` entre eles (proposed). O nome no registry não leva a categoria (`login-1`). Enquanto o refactor do CLI não entrar, a lista de blocks do `manifest.ts` e o alias de destino ainda dizem `template` (`packages/blocks/AGENTS.md`).

### i18n

Só `labels`. Sem biblioteca de i18n.

## 10. Experiência

Decidido pelo dono: a página inteira é do block, com o `main`, o conteúdo centralizado na vertical na altura da janela e o `logo` acima do Card. O restante desta seção é proposta (proposed).

- Variações `-1`: a página centralizada (`min-h-svh`, classe proposta), com o `logo` opcional acima do Card e, dentro do Card do COSS, título, descrição, mensagem do formulário, campos, botão de envio, provedores opcionais acima de um separador e links de rodapé.
- Login: e-mail, senha com o botão de mostrar/ocultar, caixa "lembrar de mim" abaixo da senha, links para recuperar a senha e criar conta. Cadastro: nome, e-mail, senha com o retorno sobre a senha logo abaixo, confirmação, link para entrar e o aviso de termos e privacidade só com links. Esqueceu: e-mail e link de volta ao login; com `sent`, o mesmo Card mostra o título e o texto de confirmação, o link de volta ao login e o reenvio com a contagem do consumidor. Redefinição: senha nova com o retorno, confirmação e link de volta ao login. OTP: dígitos em `OTPField`, botão "Verificar" sempre visível e reenvio com a contagem do consumidor.
- Os provedores são botões com `icon` e `label` que o consumidor passa.

## 11. Documentação e Storybook

- Título: `Blocks/Application/Auth/<Nome>`, com `Login1`, `Otp1`, `Signup1`, `ResetPassword1` e `ForgotPassword1` (proposed, pelo precedente `AppShell1`).
- Cada block tem uma única página `Doc`, como `AppShell1` a `AppShell4` e os editores de fluxo (decidido pelo dono). A estrutura de seis páginas (API Reference, Playground, Stories, Behavior, Usages, Layouts) não se aplica a estes blocks. A forma da `Doc` segue a do `AppShell1`, que o implementador lê (proposed).
- Os dados de exemplo ficam em `fixtures/` da story e não vão para o registry.

## 12. Lacunas abertas

- Fechadas em 2026-11-22 pelo implementador da fundação: a validação do `Form` (§5.2) e as props do `OTPField` e dos componentes de `ui` (§3).
- [GAP: o tipo de teste de cada invariante (proposed) — o [ADR 0009](../adr/0009-blocks-layer.md) já deixa a confirmação dos tipos de teste com o dono — decides: o dono]

## 13. Relacionados

- [Requisitos](requirements.md)
- [ADR 0009: camada `blocks`](../adr/0009-blocks-layer.md)
- [ADR 0005: templates instaláveis](../adr/0005-installable-templates.md)
- [Mapa de decisão das camadas](../../docs/architecture/layer-decision-map.md)
- [`packages/blocks/AGENTS.md`](../../packages/blocks/AGENTS.md)
- [Acessibilidade](../../docs/accessibility.md)
