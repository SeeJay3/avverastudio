# GSAP Eases - Funcoes de Suavizacao

## Ease Padrao

GSAP usa `"power1.out"` como ease padrao. Pode ser alterado globalmente:

```javascript
gsap.defaults({ ease: "power2.inOut" });
```

## Sintaxe

```javascript
gsap.to(".box", {
  x: 100,
  ease: "power2.out"   // String
});

// Ou com funcao
gsap.to(".box", {
  x: 100,
  ease: Power2.easeOut // Objeto
});
```

## Tipos de Ease

### Power (Potencia)
Quanto maior o numero, mais acentuada a curva.

| Ease | Descricao |
|------|-----------|
| `none` / `linear` | Velocidade constante |
| `power1` | Suave (equivale a Quad) |
| `power2` | Moderado (equivale a Cubic) |
| `power3` | Forte (equivale a Quart) |
| `power4` | Muito forte (equivale a Quint) |

### Variacoes
- `.in` - Comeca devagar, acelera
- `.out` - Comeca rapido, desacelera
- `.inOut` - Devagar nas duas pontas

```javascript
"power2.in"     // Comeca devagar
"power2.out"    // Termina devagar (mais natural)
"power2.inOut"  // Suave nas duas pontas
```

### Eases Especiais

| Ease | Descricao |
|------|-----------|
| `back` | Ultrapassa e volta |
| `elastic` | Efeito elastico/mola |
| `bounce` | Efeito de quique |
| `circ` | Curva circular |
| `expo` | Exponencial (muito acentuado) |
| `sine` | Senoidal (muito suave) |

## Back

Ultrapassa o destino e volta.

```javascript
// Controlar overshoot (default: 1.70158)
"back.out(1.7)"
"back.in(3)"      // Mais overshoot
"back.inOut(2)"
```

## Elastic

Efeito de mola/elastico.

```javascript
// Configurar amplitude e periodo
"elastic.out(1, 0.3)"     // amplitude, periodo
"elastic.in(1, 0.5)"
"elastic.inOut(1, 0.2)"

// Defaults: amplitude=1, period=0.3
```

## Bounce

Efeito de quique.

```javascript
"bounce.out"    // Quica no final
"bounce.in"     // Quica no inicio
"bounce.inOut"  // Quica nas duas pontas
```

## Steps (Degraus)

Animacao em passos discretos.

```javascript
"steps(5)"        // 5 passos
"steps(12)"       // 12 passos

// SteppedEase com mais controle
SteppedEase.config(5)
```

## Expo

Exponencial - muito acentuado.

```javascript
"expo.out"     // Muito rapido no inicio
"expo.in"      // Muito lento no inicio
"expo.inOut"
```

## Circ

Curva circular.

```javascript
"circ.out"
"circ.in"
"circ.inOut"
```

## Sine

Muito suave (senoidal).

```javascript
"sine.out"
"sine.in"
"sine.inOut"
```

## EasePack (Requer Import Separado)

```javascript
import { SlowMo, RoughEase, ExpoScaleEase } from "gsap/EasePack";
gsap.registerPlugin(SlowMo, RoughEase, ExpoScaleEase);
```

### SlowMo
Desacelera no meio.

```javascript
"slow(0.7, 0.7, false)"
// linearRatio, power, yoyoMode
```

### RoughEase
Adiciona "ruido" a animacao.

```javascript
"rough({ strength: 1, points: 20, template: 'none', taper: 'none', randomize: true })"
```

### ExpoScaleEase
Escala exponencial para efeitos de zoom.

```javascript
"expoScale(0.5, 2)"  // startScale, endScale
```

## CustomEase (Plugin Premium)

Cria curvas Bezier customizadas.

```javascript
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

CustomEase.create("myEase", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1 1,1");

gsap.to(".box", {
  x: 100,
  ease: "myEase"
});
```

## CustomBounce (Plugin Premium)

Bounce customizavel.

```javascript
import { CustomBounce } from "gsap/CustomBounce";
gsap.registerPlugin(CustomBounce);

CustomBounce.create("myBounce", {
  strength: 0.6,
  squash: 3,
  squashID: "myBounce-squash"
});

gsap.to(".box", { y: 300, ease: "myBounce" });
gsap.to(".box", { scaleY: 0.5, ease: "myBounce-squash" });
```

## CustomWiggle (Plugin Premium)

Efeito de tremor/wiggle.

```javascript
import { CustomWiggle } from "gsap/CustomWiggle";
gsap.registerPlugin(CustomWiggle);

CustomWiggle.create("myWiggle", {
  wiggles: 10,
  type: "uniform"  // "uniform", "random", "easeOut"
});

gsap.to(".box", { rotation: 30, ease: "myWiggle" });
```

## Comparacao Visual

```
Linear:     _______________
            /
Power1.out: /￣￣￣￣
Power2.out: /￣￣￣
Power3.out: |￣￣
Back.out:   |￣⌒
Elastic:    |~⌒~⌒~
Bounce:     |_._._
```

## Dicas

1. **`.out`** e a variacao mais comum - parece mais natural
2. **`power2.out`** e um bom padrao para a maioria das animacoes
3. **`elastic`** e **`bounce`** funcionam melhor como `.out`
4. **`back`** funciona bem com scale e posicao
5. Use o [visualizador de eases](https://gsap.com/docs/v3/Eases) para testar
