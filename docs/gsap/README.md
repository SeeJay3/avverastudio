# GSAP v3 - Base de Conhecimento

Documentacao completa do GreenSock Animation Platform (GSAP) para referencia no desenvolvimento do projeto Viralize-se.

## Indice

1. [Core - Metodos Principais](./01-core.md)
2. [Tween - Propriedades e Metodos](./02-tween.md)
3. [Timeline - Sequenciamento](./03-timeline.md)
4. [Eases - Funcoes de Suavizacao](./04-eases.md)
5. [ScrollTrigger - Animacoes com Scroll](./05-scrolltrigger.md)
6. [Plugins - Extensoes](./06-plugins.md)
7. [Utilities - Metodos Utilitarios](./07-utilities.md)
8. [Boas Praticas e Performance](./08-best-practices.md)

## Instalacao Rapida

```bash
npm install gsap
```

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

## Sintaxe Basica

```javascript
// Animar PARA valores
gsap.to(".box", { x: 100, duration: 1 });

// Animar DE valores
gsap.from(".box", { opacity: 0, duration: 1 });

// Animar DE/PARA
gsap.fromTo(".box", { x: 0 }, { x: 100, duration: 1 });

// Definir valores instantaneamente
gsap.set(".box", { x: 100 });

// Timeline
const tl = gsap.timeline();
tl.to(".box1", { x: 100 })
  .to(".box2", { y: 50 }, "-=0.5");
```
