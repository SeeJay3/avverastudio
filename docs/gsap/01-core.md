# GSAP Core - Metodos Principais

## Metodos de Animacao

### gsap.to(targets, vars)
Anima propriedades PARA os valores especificados.

```javascript
gsap.to(".box", {
  rotation: 27,
  x: 100,
  duration: 1,
  ease: "power2.out"
});
```

### gsap.from(targets, vars)
Anima DE valores especificados para o estado atual.

```javascript
gsap.from(".box", {
  opacity: 0,
  y: 50,
  duration: 1
});
```

### gsap.fromTo(targets, fromVars, toVars)
Define valores iniciais E finais explicitamente.

```javascript
gsap.fromTo(".box",
  { opacity: 0, x: -100 },
  { opacity: 1, x: 0, duration: 1 }
);
```

### gsap.set(targets, vars)
Aplica valores instantaneamente (sem animacao).

```javascript
gsap.set(".box", { x: 100, opacity: 0.5 });
```

### gsap.timeline(vars)
Cria container para sequenciar multiplos tweens.

```javascript
const tl = gsap.timeline({ repeat: -1, yoyo: true });
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 50 })
  .to(".box3", { rotation: 360 });
```

## Metodos de Controle Global

### gsap.killTweensOf(targets, properties)
Encerra todas as animacoes de um target.

```javascript
gsap.killTweensOf(".box");           // mata todas
gsap.killTweensOf(".box", "x,y");    // mata apenas x e y
```

### gsap.isTweening(target)
Verifica se target esta sendo animado.

```javascript
if (gsap.isTweening(".box")) {
  console.log("Animando!");
}
```

### gsap.getTweensOf(targets)
Retorna array de tweens ativos para o target.

```javascript
const tweens = gsap.getTweensOf(".box");
```

### gsap.getProperty(target, property, unit)
Obtem valor atual de uma propriedade.

```javascript
gsap.getProperty("#box", "x");        // 100 (numero)
gsap.getProperty("#box", "x", "px");  // "100px" (string)
```

## Configuracao Global

### gsap.defaults(vars)
Define propriedades padrao para TODOS os tweens.

```javascript
gsap.defaults({
  ease: "power2.inOut",
  duration: 0.8
});
```

### gsap.config(vars)
Configuracoes gerais do engine (nao relacionadas a tweens).

```javascript
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false
});
```

### gsap.registerPlugin(...plugins)
Registra plugins para evitar tree-shaking.

```javascript
import { ScrollTrigger, Flip } from "gsap/all";
gsap.registerPlugin(ScrollTrigger, Flip);
```

## gsap.context()
Coleta animacoes para cleanup automatico (essencial para React/Vue).

```javascript
const ctx = gsap.context(() => {
  gsap.to(".box", { x: 100 });
  gsap.from(".title", { opacity: 0 });
});

// Reverte todas as animacoes do contexto
ctx.revert();
```

### Com Scoped Selectors
```javascript
const ctx = gsap.context(() => {
  gsap.to(".box", { x: 100 }); // Scoped para myRef
}, myRef);
```

## gsap.matchMedia()
Animacoes responsivas com media queries.

```javascript
const mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  // Animacoes desktop
  gsap.to(".box", { x: 200 });
});

mm.add("(max-width: 799px)", () => {
  // Animacoes mobile
  gsap.to(".box", { x: 50 });
});

// Syntax com conditions
mm.add({
  isDesktop: "(min-width: 800px)",
  isMobile: "(max-width: 799px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (context) => {
  const { isDesktop, reduceMotion } = context.conditions;
  gsap.to(".box", {
    x: isDesktop ? 200 : 50,
    duration: reduceMotion ? 0 : 1
  });
});
```

## gsap.quickTo() / gsap.quickSetter()
Otimizacao para animacoes repetitivas (mousemove, etc).

```javascript
// quickTo - cria funcao reutilizavel
const xTo = gsap.quickTo("#follower", "x", { duration: 0.4, ease: "power3" });
const yTo = gsap.quickTo("#follower", "y", { duration: 0.4, ease: "power3" });

document.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});

// quickSetter - sem animacao, valores instantaneos
const setX = gsap.quickSetter("#el", "x", "px");
setX(100);
```

## gsap.registerEffect()
Cria efeitos customizados reutilizaveis.

```javascript
gsap.registerEffect({
  name: "fadeIn",
  effect: (targets, config) => {
    return gsap.from(targets, {
      opacity: 0,
      y: config.y,
      duration: config.duration
    });
  },
  defaults: { duration: 1, y: 50 },
  extendTimeline: true
});

// Uso
gsap.effects.fadeIn(".box");

// Em timeline
tl.fadeIn(".box", { y: 100 });
```

## gsap.ticker
Heartbeat do engine GSAP (requestAnimationFrame).

```javascript
// Adicionar callback ao ticker
gsap.ticker.add((time, deltaTime, frame) => {
  console.log("Tick!", time);
});

// Limitar FPS
gsap.ticker.fps(30);

// Lag smoothing (evita saltos apos lag)
gsap.ticker.lagSmoothing(500, 33);

// Delta ratio para movimento independente de framerate
const delta = gsap.ticker.deltaRatio(60);
```

## gsap.delayedCall()
Executa funcao apos delay (alternativa a setTimeout).

```javascript
gsap.delayedCall(2, myFunction, [param1, param2]);

// Pode ser controlado
const delayed = gsap.delayedCall(2, myFunc);
delayed.kill();
```
