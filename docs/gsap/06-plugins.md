# GSAP Plugins

## Core Plugins (Inclusos no GSAP)

### CSS Plugin
Anima propriedades CSS automaticamente.

#### Transform Shortcuts
```javascript
gsap.to(".box", {
  // Translacao
  x: 100,          // translateX em px
  y: 50,           // translateY em px
  xPercent: 50,    // translateX em %
  yPercent: -50,   // translateY em %

  // Escala
  scale: 1.5,      // scaleX e scaleY
  scaleX: 2,
  scaleY: 0.5,

  // Rotacao (graus por padrao)
  rotation: 360,
  rotationX: 45,   // 3D
  rotationY: 90,   // 3D
  rotationZ: 180,  // Mesmo que rotation

  // Skew (graus)
  skewX: 20,
  skewY: 10,

  // 3D
  z: -100,
  transformPerspective: 500
});
```

#### Propriedades CSS Comuns
```javascript
gsap.to(".box", {
  opacity: 0.5,
  backgroundColor: "#ff0000",
  borderRadius: "50%",
  boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
  width: 200,
  height: "50vh",
  padding: "20px",
  fontSize: 24
});
```

#### autoAlpha
Combina opacity com visibility.

```javascript
gsap.to(".box", { autoAlpha: 0 });
// opacity: 0 + visibility: hidden

gsap.to(".box", { autoAlpha: 1 });
// opacity: 1 + visibility: inherit
```

#### clearProps
Remove estilos inline apos animacao.

```javascript
gsap.to(".box", {
  x: 100,
  clearProps: "x"      // Remove x apos completar
});

gsap.to(".box", {
  x: 100,
  rotation: 45,
  clearProps: "all"    // Remove todos
});
```

### Attr Plugin
Anima atributos HTML/SVG.

```javascript
gsap.to("rect", {
  attr: {
    width: 200,
    height: 100,
    fill: "#ff0000"
  }
});

gsap.to("circle", {
  attr: { r: 50, cx: 100 }
});
```

### Modifiers Plugin
Intercepta valores antes de aplicar.

```javascript
gsap.to(".box", {
  x: 500,
  modifiers: {
    x: (x) => {
      // Wrap entre 0 e 500
      return gsap.utils.wrap(0, 500, parseFloat(x)) + "px";
    }
  }
});

// Snap para grid
gsap.to(".box", {
  x: 1000,
  modifiers: {
    x: (x) => Math.round(parseFloat(x) / 50) * 50 + "px"
  }
});
```

## Plugins Gratuitos

### ScrollToPlugin
Anima scroll para posicao/elemento.

```javascript
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

// Scroll para posicao
gsap.to(window, { duration: 1, scrollTo: 500 });

// Scroll para elemento
gsap.to(window, { duration: 1, scrollTo: "#section3" });

// Com offset
gsap.to(window, {
  scrollTo: {
    y: "#section3",
    offsetY: 100
  }
});

// Scroll horizontal
gsap.to(".container", {
  scrollTo: { x: 500 }
});

// Auto-kill se usuario scrollar
gsap.to(window, {
  scrollTo: {
    y: 1000,
    autoKill: true,
    onAutoKill: () => console.log("User scrolled")
  }
});
```

### Observer
Detecta interacoes de scroll/touch/pointer.

```javascript
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);

Observer.create({
  target: window,
  type: "wheel,touch,pointer",

  onUp: () => previousSlide(),
  onDown: () => nextSlide(),

  tolerance: 50,
  dragMinimum: 5,

  onDrag: (self) => {
    console.log(self.deltaY, self.velocityY);
  }
});
```

### Flip
Animacoes de layout state-to-state.

```javascript
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

// 1. Capturar estado
const state = Flip.getState(".boxes");

// 2. Fazer mudancas no DOM
container.appendChild(box);
box.classList.toggle("active");

// 3. Animar da posicao anterior
Flip.from(state, {
  duration: 0.5,
  ease: "power1.inOut",
  absolute: true,
  stagger: 0.1
});
```

### Draggable
Elementos arrastaveis.

```javascript
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

Draggable.create(".box", {
  type: "x,y",           // ou "x", "y", "rotation"
  bounds: ".container",
  inertia: true,

  onDragStart: function() {},
  onDrag: function() {
    console.log(this.x, this.y);
  },
  onDragEnd: function() {},

  snap: {
    x: (value) => Math.round(value / 50) * 50,
    y: (value) => Math.round(value / 50) * 50
  }
});
```

## Plugins Premium (Requerem Licenca)

### SplitText
Divide texto em caracteres/palavras/linhas.

```javascript
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const split = SplitText.create(".text", {
  type: "words,chars",
  charsClass: "char",
  wordsClass: "word"
});

// Animar caracteres
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.02,
  duration: 0.5
});

// Reverter para original
split.revert();
```

### DrawSVGPlugin
Revela stroke de SVG progressivamente.

```javascript
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(DrawSVGPlugin);

// De 0 ate 100%
gsap.from("path", { drawSVG: 0, duration: 2 });

// Segmento especifico
gsap.to("path", { drawSVG: "20% 80%", duration: 1 });

// Animacao de escrita
gsap.fromTo("path",
  { drawSVG: "0% 0%" },
  { drawSVG: "0% 100%", duration: 2 }
);
```

### MorphSVGPlugin
Transforma uma forma SVG em outra.

```javascript
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);

gsap.to("#circle", {
  morphSVG: "#star",
  duration: 1
});

// Com configuracao
gsap.to("#shape1", {
  morphSVG: {
    shape: "#shape2",
    shapeIndex: 2,
    type: "rotational"
  }
});
```

### MotionPathPlugin
Anima ao longo de um caminho.

```javascript
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

gsap.to(".element", {
  duration: 5,
  motionPath: {
    path: "#myPath",
    align: "#myPath",
    alignOrigin: [0.5, 0.5],
    autoRotate: true
  }
});

// Com array de pontos
gsap.to(".element", {
  motionPath: {
    path: [
      { x: 0, y: 0 },
      { x: 100, y: 50 },
      { x: 200, y: 0 }
    ],
    curviness: 1.5
  }
});
```

### ScrollSmoother
Scroll suave nativo.

```javascript
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

// HTML necessario:
// <div id="smooth-wrapper">
//   <div id="smooth-content">...</div>
// </div>

const smoother = ScrollSmoother.create({
  smooth: 1,
  effects: true
});

// Parallax via data attributes:
// <div data-speed="0.5">Parallax lento</div>
// <div data-speed="auto">Auto parallax</div>
// <div data-lag="0.5">Segue com delay</div>

// Scroll programatico
smoother.scrollTo("#section", true);
```

## Registrando Multiplos Plugins

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Flip, Observer, Draggable);
```

## Verificar Plugins Registrados

```javascript
// Ver plugins disponiveis
console.log(gsap.plugins);
```
