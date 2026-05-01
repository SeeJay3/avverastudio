# GSAP - Boas Praticas e Performance

## Performance

### Use Transforms em vez de Layout Properties

```javascript
// BOM - usa GPU, nao causa reflow
gsap.to(".box", { x: 100, y: 50, scale: 1.2, rotation: 45 });

// EVITAR - causa reflow do layout
gsap.to(".box", { left: 100, top: 50, width: 200 });
```

### force3D

Ativa aceleracao de GPU.

```javascript
// Automatico (default) - ativa 3D durante animacao
gsap.config({ force3D: "auto" });

// Sempre ativo
gsap.config({ force3D: true });

// Por animacao
gsap.to(".box", { x: 100, force3D: true });
```

### will-change (CSS)

Use com moderacao - apenas quando necessario.

```css
.animating {
  will-change: transform, opacity;
}
```

### quickTo para Animacoes Repetitivas

```javascript
// EVITAR - cria novo tween a cada mousemove
document.addEventListener("mousemove", (e) => {
  gsap.to(".follower", { x: e.clientX, y: e.clientY });
});

// BOM - reutiliza mesmo tween
const xTo = gsap.quickTo(".follower", "x", { duration: 0.3 });
const yTo = gsap.quickTo(".follower", "y", { duration: 0.3 });

document.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

### Usar toArray para Multiplos Elementos

```javascript
// BOM
const boxes = gsap.utils.toArray(".box");
boxes.forEach((box, i) => {
  gsap.to(box, { x: i * 50 });
});

// TAMBEM BOM - GSAP converte automaticamente
gsap.to(".box", { x: 100 }); // Anima todos
```

## Organizacao

### Defaults no Timeline

Evita repeticao de propriedades.

```javascript
const tl = gsap.timeline({
  defaults: {
    duration: 0.5,
    ease: "power2.out"
  }
});

tl.to(".a", { x: 100 })
  .to(".b", { y: 50 })
  .to(".c", { rotation: 360, duration: 1 }); // Override
```

### Modularizar com Funcoes

```javascript
function createHeroAnimation() {
  const tl = gsap.timeline();
  tl.from(".hero-title", { opacity: 0, y: 50 })
    .from(".hero-subtitle", { opacity: 0, y: 30 }, "-=0.3");
  return tl;
}

function createContentAnimation() {
  const tl = gsap.timeline();
  tl.from(".cards", { opacity: 0, stagger: 0.1 });
  return tl;
}

// Master timeline
const master = gsap.timeline();
master
  .add(createHeroAnimation())
  .add(createContentAnimation(), "-=0.5");
```

### Usar Effects Reutilizaveis

```javascript
gsap.registerEffect({
  name: "fadeUp",
  effect: (targets, config) => {
    return gsap.from(targets, {
      opacity: 0,
      y: config.y,
      duration: config.duration,
      stagger: config.stagger
    });
  },
  defaults: { duration: 0.6, y: 30, stagger: 0.1 },
  extendTimeline: true
});

// Uso simplificado
gsap.effects.fadeUp(".cards");
tl.fadeUp(".items", { y: 50 });
```

## Cleanup (Frameworks)

### React

```javascript
import { useGSAP } from "@gsap/react";

function Component() {
  const container = useRef();

  useGSAP(() => {
    gsap.to(".box", { x: 100 });
  }, { scope: container }); // Auto-cleanup

  return <div ref={container}>...</div>;
}
```

### Vanilla JS

```javascript
const ctx = gsap.context(() => {
  gsap.to(".box", { x: 100 });
  ScrollTrigger.create({ trigger: ".section" });
});

// Cleanup quando necessario
ctx.revert();
```

### Event Listeners

```javascript
const ctx = gsap.context(() => {
  const onClick = () => gsap.to(".box", { scale: 1.2 });
  button.addEventListener("click", onClick);

  // Retornar cleanup function
  return () => {
    button.removeEventListener("click", onClick);
  };
});
```

## ScrollTrigger

### Ordem de Criacao

Crie ScrollTriggers na ordem do documento.

```javascript
// BOM - ordem do documento
gsap.utils.toArray("section").forEach((section) => {
  gsap.to(section.querySelector(".content"), {
    scrollTrigger: { trigger: section }
  });
});
```

### Nao Animar Elementos Pinados

```javascript
// ERRADO - anima o elemento pinado
gsap.to(".section", {
  x: 500,
  scrollTrigger: { pin: ".section" }
});

// CORRETO - anima filho do elemento pinado
gsap.to(".section-content", {
  x: 500,
  scrollTrigger: {
    trigger: ".section",
    pin: true
  }
});
```

### Markers em Desenvolvimento

```javascript
ScrollTrigger.defaults({
  markers: process.env.NODE_ENV === "development"
});
```

### Refresh Apos Mudancas no DOM

```javascript
// Apos carregar imagens/conteudo
imagesLoaded(container, () => {
  ScrollTrigger.refresh();
});

// Apos resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
```

## Responsividade

### matchMedia para Breakpoints

```javascript
const mm = gsap.matchMedia();

mm.add({
  isDesktop: "(min-width: 1024px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isMobile: "(max-width: 767px)"
}, (context) => {
  const { isDesktop, isMobile } = context.conditions;

  gsap.to(".box", {
    x: isDesktop ? 500 : isMobile ? 100 : 300,
    scrollTrigger: isDesktop ? { scrub: true } : false
  });
});
```

### Respeitar prefers-reduced-motion

```javascript
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Desabilitar ou simplificar animacoes
  gsap.set(".animated", { clearProps: "all" });
});

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Animacoes completas
  gsap.from(".animated", { opacity: 0, y: 50 });
});
```

## Debuging

### Ferramentas

```javascript
// Labels para identificar pontos na timeline
tl.addLabel("intro")
  .to(".a", { x: 100 })
  .addLabel("middle")
  .to(".b", { y: 50 });

// GSDevTools (plugin de dev)
GSDevTools.create();

// Log de estado
console.log(gsap.globalTimeline.getChildren());
```

### Pausar para Inspecionar

```javascript
const tl = gsap.timeline({ paused: true });
tl.to(".box", { x: 100 })
  .call(() => console.log("Checkpoint!"))
  .to(".box", { y: 50 });

// Controlar manualmente
tl.play();
tl.seek("middle");
tl.progress(0.5);
```

## Padroes Comuns

### Fade In on Scroll

```javascript
gsap.utils.toArray(".fade-in").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none"
    }
  });
});
```

### Parallax

```javascript
gsap.utils.toArray("[data-speed]").forEach((el) => {
  const speed = parseFloat(el.dataset.speed) || 0.5;

  gsap.to(el, {
    yPercent: speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
```

### Staggered Cards

```javascript
gsap.from(".card", {
  opacity: 0,
  y: 50,
  duration: 0.6,
  stagger: {
    each: 0.1,
    from: "start"
  },
  scrollTrigger: {
    trigger: ".cards-container",
    start: "top 80%"
  }
});
```

### Hover Animation

```javascript
const cards = gsap.utils.toArray(".card");

cards.forEach((card) => {
  const tl = gsap.timeline({ paused: true });
  tl.to(card, { scale: 1.05, duration: 0.3 })
    .to(card.querySelector(".overlay"), { opacity: 1 }, 0);

  card.addEventListener("mouseenter", () => tl.play());
  card.addEventListener("mouseleave", () => tl.reverse());
});
```

## Erros Comuns

### 1. Esquecer de Registrar Plugins

```javascript
// ERRADO - plugin pode ser removido por tree-shaking
import { ScrollTrigger } from "gsap/ScrollTrigger";

// CORRETO
gsap.registerPlugin(ScrollTrigger);
```

### 2. Conflitos de Overwrite

```javascript
// Pode causar conflitos
gsap.to(".box", { x: 100, duration: 1 });
gsap.to(".box", { x: 200, duration: 0.5 }); // Conflito!

// Solucao: usar overwrite
gsap.to(".box", { x: 200, overwrite: true });

// Ou matar animacoes anteriores
gsap.killTweensOf(".box");
gsap.to(".box", { x: 200 });
```

### 3. Animar display/visibility

```javascript
// ERRADO - display nao e animavel
gsap.to(".box", { display: "block" });

// CORRETO - usar autoAlpha ou callbacks
gsap.to(".box", { autoAlpha: 1 }); // opacity + visibility

// Ou
gsap.to(".box", {
  opacity: 1,
  onStart: () => el.style.display = "block",
  onReverseComplete: () => el.style.display = "none"
});
```

### 4. Selectors Nao Existentes

```javascript
// Pode falhar silenciosamente
gsap.to(".nao-existe", { x: 100 });

// Debug
gsap.config({ nullTargetWarn: true });
```
