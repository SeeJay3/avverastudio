# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing page do **Avvera Studio** — agência brasileira de comunicação para profissionais de saúde e estética. Conteúdo em PT-BR (`lang="pt-BR"`).

Stack: **Astro 5 + React 19 + GSAP 3** (com ScrollTrigger). Astro renderiza tudo estático; React fica reservado para componentes interativos / [reactbits.dev](https://reactbits.dev) e é hidratado sob demanda via diretivas `client:*`.

## Comandos

```bash
npm install        # primeira vez
npm run dev        # dev server (http://localhost:4321)
npm run build      # build estático em dist/
npm run preview    # serve o dist/ localmente
npm run check      # astro check (type-check de .astro/.ts/.tsx)
```

## Arquitetura

- [src/pages/index.astro](src/pages/index.astro) é a única rota — uma single-page que importa os componentes de seção em ordem.
- [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) define `<head>` (Google Fonts: Cormorant Garamond + DM Sans), importa `global.css` e injeta o script de animações via `<script>import '~/scripts/animations';</script>`. O Astro bundla esse import como módulo client-side.
- Cada seção é um componente Astro em [src/components/](src/components/) — `Nav`, `Hero`, `TickerStrip`, `HowWeHelp`, `Services`, `Manifesto`, `Portfolio`, `About`, `FinalCta`, `Footer`. Conteúdo de listas (passos, serviços, dores, projetos) está em arrays no frontmatter dos próprios componentes — edite ali, não no markup.
- [src/styles/global.css](src/styles/global.css) carrega todos os estilos globais. Não use `<style>` scoped nos componentes a menos que precise de algo realmente local — todas as classes dependem dos design tokens em `:root` e da cascata global.
- [src/scripts/animations.ts](src/scripts/animations.ts) é o entry-point GSAP: registra ScrollTrigger, define defaults, anima o hero numa timeline e dispara `.gsap-fade` por ScrollTrigger nas demais seções. Usa `gsap.matchMedia` para respeitar `prefers-reduced-motion` e `gsap.context()` + `import.meta.hot.dispose` para cleanup no HMR.
- [src/components/react/](src/components/react/) é onde vão componentes React (incluindo blocos do React Bits). Veja o `README.md` lá dentro com o padrão `useGSAP` + `client:visible`.

## Convenções de design (não mexer sem motivo)

Estes pontos são "load-bearing" — preservá-los mantém a identidade visual:

- **Tokens de cor** em `:root` (`--cream`, `--warm-white`, `--beige`, `--sand`, `--taupe`, `--brown`, `--espresso`, `--accent`, `--accent-dark`). Nunca use hex inline; sempre referencie a variável.
- **Tipografia**: serif (`Cormorant Garamond`) é exclusiva para headlines, logo, monogramas e `.about-quote`. Tudo mais é `DM Sans`. `<em>` dentro de `.hero-headline`, `.section-title`, `.manifesto-title`, `.final-headline` recebe `--accent-dark` em itálico.
- **Ritmo de seção**: `padding: 7rem 5%`. Cada seção começa com um `.section-label` (uppercase, letterspaced, com risco de 30 px) acima do `.section-title`.
- **Grid de portfólio**: `.portfolio-item:nth-child(1)` ocupa 2 linhas, `:nth-child(4)` ocupa 2 colunas. Reordenar `projects` em [Portfolio.astro](src/components/Portfolio.astro) muda quem recebe esses spans — ajuste os `nth-child` em `global.css` se reordenar.
- **Ticker strip** (`.strip-inner`) anima com `translateX(-50%)`. Por isso o array `loop` em [TickerStrip.astro](src/components/TickerStrip.astro) é o array original duplicado — não remova essa duplicação, ou o loop fica com costura visível.
- **Breakpoint único** em `@media (max-width: 768px)` no fim do `global.css`. Adicione overrides mobile lá; não introduza outros breakpoints sem necessidade.

## Animações com GSAP

- **Pattern de fade-in por scroll**: adicione a classe `.gsap-fade` em qualquer elemento que deva entrar com fade+y. O CSS deixa ele `opacity: 0; transform: translateY(24px)`, e [animations.ts](src/scripts/animations.ts) anima ao entrar na viewport (start: `top 85%`, `toggleActions: "play none none none"` — animação one-shot). O `<noscript>` no `BaseLayout` reverte para visível se JS estiver desabilitado.
- **Hero tem timeline própria** (não ScrollTrigger) e é detectada pelo atributo `data-animate-hero` na `<section class="hero">`. Os filhos `.gsap-fade` do hero são excluídos do laço de ScrollTrigger.
- **Sempre registre plugins**: `gsap.registerPlugin(ScrollTrigger)` no topo de `animations.ts` — sem isso, o tree-shaking do Vite remove o plugin.
- **Em componentes React**, use `useGSAP` do `@gsap/react` com `scope: ref` para cleanup automático (ver [src/components/react/README.md](src/components/react/README.md)). NUNCA use `useEffect` cru com GSAP — vaza no unmount.
- **Documentação local**: [docs/gsap/](docs/gsap/) é a base de conhecimento GSAP em PT-BR. Consulte antes de implementar — especialmente `05-scrolltrigger.md` e `08-best-practices.md`.

## Adicionando React Bits

1. Copie o componente de https://reactbits.dev para [src/components/react/NomeDoComponente.tsx](src/components/react/).
2. Importe no Astro e use com diretiva client: `<NomeDoComponente client:visible />` (preferência por `client:visible` para componentes abaixo da dobra; `client:load` só se for crítico).
3. Se o componente animar com GSAP, troque qualquer `useEffect`/`useLayoutEffect` por `useGSAP` antes de mexer.

## Notas

- Astro path alias: `~/*` → `src/*` (ver `tsconfig.json`).
- `gsap` e `@gsap/react` estão em `vite.ssr.noExternal` no `astro.config.mjs` — sem isso o SSR quebra com erros de CommonJS.
- Não há testes nem lint configurados; use `npm run check` para validação de tipos.
