# GSAP ScrollTrigger - Animacoes com Scroll

## Instalacao

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

## Uso Basico

```javascript
gsap.to(".box", {
  x: 500,
  scrollTrigger: ".box" // Trigger simples
});

// Ou com configuracao
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});
```

## Configuracao Principal

### trigger
Elemento que define a posicao do ScrollTrigger.

```javascript
scrollTrigger: {
  trigger: ".section"  // Seletor ou elemento
}
```

### start
Quando o ScrollTrigger ativa. Formato: `"triggerPosition viewportPosition"`.

```javascript
start: "top center"      // Topo do trigger no centro da viewport
start: "top 80%"         // Topo do trigger em 80% da viewport
start: "top top"         // Topo do trigger no topo da viewport
start: "center center"   // Centro do trigger no centro
start: "bottom top"      // Fundo do trigger no topo
start: "top bottom-=100" // Com offset
start: () => window.innerHeight * 0.5 // Funcao
```

### end
Quando o ScrollTrigger desativa.

```javascript
end: "bottom top"        // Fundo do trigger no topo
end: "+=500"            // 500px apos o start
end: "bottom center"
end: () => "+=" + document.querySelector(".box").offsetHeight
```

### scrub
Vincula progresso da animacao ao scroll.

```javascript
scrub: true       // Sincronizacao imediata
scrub: 0.5        // 0.5s para "alcançar" (smoothing)
scrub: 1          // 1s de smoothing
```

### pin
Fixa elemento durante o scroll.

```javascript
pin: true                  // Fixa o trigger
pin: ".other-element"      // Fixa outro elemento
pinSpacing: true           // Adiciona padding (default)
pinSpacing: "margin"       // Usa margin ao inves de padding
pinSpacing: false          // Sem spacing
```

### markers
Debug visual.

```javascript
markers: true
markers: {
  startColor: "green",
  endColor: "red",
  fontSize: "12px",
  indent: 20
}
```

### toggleActions
Controla playback em 4 pontos de toggle.

```javascript
// Formato: "onEnter onLeave onEnterBack onLeaveBack"
toggleActions: "play pause resume reset"

// Opcoes:
// "play"      - Toca do inicio
// "pause"     - Pausa
// "resume"    - Continua de onde parou
// "restart"   - Reinicia
// "reset"     - Volta ao inicio sem animar
// "complete"  - Pula para o fim
// "reverse"   - Inverte
// "none"      - Nada
```

### toggleClass
Adiciona/remove classe CSS.

```javascript
toggleClass: "active"
toggleClass: {
  targets: ".my-element",
  className: "is-visible"
}
```

### snap
Snap para posicoes especificas apos parar de scrollar.

```javascript
snap: 0.1              // Incrementos de 10%
snap: 0.5              // Incrementos de 50%
snap: [0, 0.25, 0.5, 1] // Valores especificos
snap: "labels"         // Labels da timeline

snap: {
  snapTo: 0.1,
  duration: 0.3,
  delay: 0.1,
  ease: "power1.inOut",
  directional: true,
  onStart: () => {},
  onComplete: () => {}
}
```

## Callbacks

```javascript
scrollTrigger: {
  trigger: ".box",

  onEnter: (self) => {
    console.log("Entrou (scrollando para baixo)");
  },

  onLeave: (self) => {
    console.log("Saiu (scrollando para baixo)");
  },

  onEnterBack: (self) => {
    console.log("Voltou a entrar (scrollando para cima)");
  },

  onLeaveBack: (self) => {
    console.log("Saiu voltando (scrollando para cima)");
  },

  onToggle: (self) => {
    console.log("Toggled:", self.isActive);
  },

  onUpdate: (self) => {
    console.log("Progress:", self.progress);
    console.log("Direction:", self.direction); // 1 ou -1
    console.log("Velocity:", self.getVelocity());
  },

  onScrubComplete: () => {
    console.log("Scrub terminou de animar");
  },

  onSnapComplete: () => {
    console.log("Snap completou");
  },

  onRefresh: (self) => {
    console.log("Posicoes recalculadas");
  }
}
```

## ScrollTrigger Standalone

Criar ScrollTrigger sem animacao GSAP.

```javascript
ScrollTrigger.create({
  trigger: ".box",
  start: "top center",
  end: "bottom center",

  onEnter: () => console.log("Entered"),
  onLeave: () => console.log("Left"),

  // Pode disparar animacao manualmente
  onToggle: (self) => {
    if (self.isActive) {
      myAnimation.play();
    } else {
      myAnimation.reverse();
    }
  }
});
```

## Propriedades da Instancia

```javascript
const st = ScrollTrigger.create({ trigger: ".box" });

st.progress      // 0-1
st.direction     // 1 (forward) ou -1 (backward)
st.isActive      // true se entre start/end
st.start         // Posicao start em pixels
st.end           // Posicao end em pixels
st.trigger       // Elemento trigger
st.pin           // Elemento pinado
st.scroller      // Container de scroll
st.animation     // Tween/Timeline associado
```

## Metodos da Instancia

```javascript
st.disable();     // Desativa temporariamente
st.enable();      // Reativa
st.kill();        // Remove permanentemente
st.refresh();     // Recalcula posicoes
st.scroll(500);   // Define posicao do scroller
st.getVelocity(); // Velocidade em px/s
st.getTween();    // Retorna scrub tween
```

## Metodos Estaticos

### ScrollTrigger.refresh()
Recalcula todas as posicoes.

```javascript
ScrollTrigger.refresh();
ScrollTrigger.refresh(true); // Tambem recarrega conteudo
```

### ScrollTrigger.getAll()
Retorna array de todos os ScrollTriggers.

```javascript
const allTriggers = ScrollTrigger.getAll();
```

### ScrollTrigger.getById(id)
Busca por ID.

```javascript
const st = ScrollTrigger.getById("myTrigger");
```

### ScrollTrigger.killAll()
Destroi todos os ScrollTriggers.

```javascript
ScrollTrigger.killAll();
```

### ScrollTrigger.defaults()
Define configuracao padrao.

```javascript
ScrollTrigger.defaults({
  markers: true,
  toggleActions: "play none none reverse"
});
```

### ScrollTrigger.batch()
Coordena multiplos triggers.

```javascript
ScrollTrigger.batch(".box", {
  onEnter: (batch) => {
    gsap.to(batch, { opacity: 1, stagger: 0.1 });
  },
  onLeave: (batch) => {
    gsap.to(batch, { opacity: 0 });
  }
});
```

### ScrollTrigger.matchMedia()
Animacoes responsivas.

```javascript
ScrollTrigger.matchMedia({
  "(min-width: 800px)": function() {
    // Desktop
    gsap.to(".box", {
      x: 500,
      scrollTrigger: { trigger: ".box", scrub: true }
    });
  },
  "(max-width: 799px)": function() {
    // Mobile
    gsap.to(".box", {
      y: 200,
      scrollTrigger: { trigger: ".box", scrub: true }
    });
  }
});
```

### ScrollTrigger.isInViewport()
Verifica se elemento esta visivel.

```javascript
ScrollTrigger.isInViewport(".box");        // boolean
ScrollTrigger.isInViewport(".box", 0.5);   // 50% visivel
```

### ScrollTrigger.positionInViewport()
Posicao relativa na viewport.

```javascript
ScrollTrigger.positionInViewport(".box");  // 0-1
ScrollTrigger.positionInViewport(".box", "top"); // Posicao do topo
```

### ScrollTrigger.maxScroll()
Maximo scroll possivel.

```javascript
ScrollTrigger.maxScroll(window);
ScrollTrigger.maxScroll(window, true); // Horizontal
```

## Horizontal Scroll

```javascript
// Container horizontal
const sections = gsap.utils.toArray(".panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".container").offsetWidth
  }
});
```

## Integracao com Lenis

```javascript
import Lenis from 'lenis';

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

## Boas Praticas

1. **Criar ScrollTriggers na ordem do documento** (top to bottom)
2. **Nao animar elementos pinados diretamente** - anime filhos
3. **Usar `markers: true` durante desenvolvimento**
4. **Registrar plugin** para evitar tree-shaking
5. **Usar `anticipatePin: 1`** para scrolls rapidos
6. **Evitar pinning aninhado**

## Exemplo Completo

```javascript
gsap.registerPlugin(ScrollTrigger);

// Fade in sections
gsap.utils.toArray(".section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

// Parallax
gsap.to(".parallax-bg", {
  yPercent: -30,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// Pin section
gsap.to(".pinned-content", {
  x: 500,
  scrollTrigger: {
    trigger: ".pinned-section",
    start: "top top",
    end: "+=1000",
    pin: true,
    scrub: 1
  }
});
```
