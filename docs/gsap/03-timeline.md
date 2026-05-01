# GSAP Timeline - Sequenciamento de Animacoes

## Criando Timeline

```javascript
const tl = gsap.timeline();

// Encadeamento - executa em sequencia
tl.to(".box1", { x: 100, duration: 1 })
  .to(".box2", { y: 50, duration: 0.5 })
  .to(".box3", { rotation: 360, duration: 1 });
```

## Configuracao do Timeline

```javascript
const tl = gsap.timeline({
  // Timing
  delay: 0.5,
  repeat: 2,
  repeatDelay: 1,
  yoyo: true,
  paused: false,
  reversed: false,

  // Defaults herdados por filhos
  defaults: {
    duration: 1,
    ease: "power2.out"
  },

  // Comportamento
  smoothChildTiming: true,
  autoRemoveChildren: false,

  // Callbacks
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},
  onRepeat: () => {},
  onReverseComplete: () => {}
});
```

## Position Parameter (Posicionamento)

O terceiro parametro controla ONDE a animacao e inserida na timeline.

### Valores Absolutos
```javascript
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, 0)      // No tempo 0 (absoluto)
  .to(".c", { opacity: 1 }, 2); // No tempo 2s
```

### Valores Relativos ao Fim
```javascript
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "+=0.5")  // 0.5s DEPOIS do fim
  .to(".c", { opacity: 1 }, "-=0.3"); // 0.3s ANTES do fim (overlap)
```

### Relativo a Animacao Anterior
```javascript
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "<")      // Mesmo inicio da anterior
  .to(".c", { opacity: 1 }, ">"); // Mesmo fim da anterior

tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "<0.5")   // 0.5s apos inicio da anterior
  .to(".c", { opacity: 1 }, ">-0.2"); // 0.2s antes do fim da anterior
```

### Labels
```javascript
tl.to(".a", { x: 100 })
  .addLabel("middle")
  .to(".b", { y: 50 }, "middle")      // No label
  .to(".c", { opacity: 1 }, "middle+=0.5"); // 0.5s apos label
```

## Metodos de Sequenciamento

### .to() / .from() / .fromTo()
```javascript
tl.to(".box", { x: 100 }, "<")
  .from(".box", { opacity: 0 }, "+=0.5")
  .fromTo(".box", { scale: 0 }, { scale: 1 }, 2);
```

### .set()
Aplica valores instantaneamente.
```javascript
tl.set(".box", { visibility: "visible" })
  .to(".box", { x: 100 });
```

### .call()
Executa funcao em ponto especifico.
```javascript
tl.to(".box", { x: 100 })
  .call(myFunction, ["param1", "param2"], "+=0.5")
  .to(".box", { y: 50 });
```

### .add()
Adiciona tween, timeline, label, ou callback.
```javascript
tl.add(otherTimeline)
  .add("myLabel")
  .add(() => console.log("Here!"), "+=1")
  .add(gsap.to(".box", { x: 100 }), "<");
```

### .addLabel() / .removeLabel()
```javascript
tl.addLabel("intro", 0)
  .addLabel("middle", 2)
  .addLabel("outro", "+=1");

tl.removeLabel("middle");
```

### .addPause()
Pausa a timeline em ponto especifico.
```javascript
tl.to(".box", { x: 100 })
  .addPause()  // Pausa aqui
  .to(".box", { y: 50 });

// Com callback
tl.addPause(2, () => console.log("Pausado!"));
```

## Metodos de Controle

```javascript
const tl = gsap.timeline();

// Playback
tl.play();
tl.play("labelName");
tl.pause();
tl.resume();
tl.reverse();
tl.reverse("labelName");
tl.restart();
tl.seek(1.5);
tl.seek("labelName");

// TimeScale
tl.timeScale(2);    // 2x mais rapido
tl.timeScale(0.5);  // 2x mais lento

// Progresso
tl.progress(0.5);   // 50%
tl.totalProgress(0.75);

// Tempo
tl.time(2);
tl.totalTime(5);

// Kill
tl.kill();

// Invalidar (recalcula valores)
tl.invalidate();

// Reverter para estado original
tl.revert();
```

## Navegacao por Labels

```javascript
tl.currentLabel();    // Label atual ou anterior
tl.nextLabel();       // Proximo label
tl.previousLabel();   // Label anterior

tl.nextLabel(2);      // Proximo label apos tempo 2s
tl.previousLabel(5);  // Label anterior ao tempo 5s
```

## Gerenciando Filhos

```javascript
// Obter todos os filhos
tl.getChildren();
tl.getChildren(true);   // Nested
tl.getChildren(true, true, false); // nested, tweens, timelines

// Obter tweens de um target
tl.getTweensOf(".box");
tl.getTweensOf(".box", true); // Nested

// Matar tweens de um target
tl.killTweensOf(".box");
tl.killTweensOf(".box", "x,y");

// Buscar por ID
tl.getById("myTween");

// Limpar timeline
tl.clear();
tl.clear(true); // Tambem mata filhos
```

## Propriedades Read-Only

```javascript
tl.labels         // Objeto com todos os labels
tl.parent         // Timeline pai
tl.vars           // Configuracao original
tl.scrollTrigger  // ScrollTrigger associado (se houver)
```

## Timeline Defaults

Propriedades em `defaults` sao herdadas por todos os filhos.

```javascript
const tl = gsap.timeline({
  defaults: {
    duration: 1,
    ease: "power2.out",
    opacity: 0 // Para .from()
  }
});

// Todos herdam duration: 1 e ease: "power2.out"
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 })
  .to(".c", { rotation: 360, duration: 2 }); // Override duration
```

## Nested Timelines

Timelines podem conter outras timelines.

```javascript
function createIntro() {
  const tl = gsap.timeline();
  tl.from(".logo", { opacity: 0 })
    .from(".tagline", { y: 50 });
  return tl;
}

function createMain() {
  const tl = gsap.timeline();
  tl.to(".hero", { scale: 1.1 })
    .to(".cta", { backgroundColor: "red" });
  return tl;
}

// Master timeline
const master = gsap.timeline();
master
  .add(createIntro())
  .add(createMain(), "+=0.5")
  .add(createOutro(), "-=0.3");
```

## Exemplo Completo

```javascript
const tl = gsap.timeline({
  defaults: { duration: 0.8, ease: "power2.out" },
  paused: true,
  onComplete: () => console.log("Animacao completa!")
});

tl.addLabel("start")
  .from(".hero-title", { opacity: 0, y: 50 })
  .from(".hero-subtitle", { opacity: 0, y: 30 }, "-=0.5")
  .addLabel("buttons")
  .from(".btn", {
    opacity: 0,
    scale: 0.8,
    stagger: 0.1
  }, "buttons")
  .from(".decoration", {
    opacity: 0,
    rotation: -15
  }, "<0.3");

// Controlar
document.querySelector(".play").addEventListener("click", () => tl.play());
document.querySelector(".reset").addEventListener("click", () => tl.restart());
```
