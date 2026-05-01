# GSAP Utilities - Metodos Utilitarios

Todos os utilitarios estao em `gsap.utils`.

## Selecao e Arrays

### toArray()
Converte seletores/NodeLists em arrays.

```javascript
const boxes = gsap.utils.toArray(".box");
// [element, element, element...]

// Com scope
const items = gsap.utils.toArray(".item", container);
```

### selector()
Cria funcao de selecao com escopo.

```javascript
const q = gsap.utils.selector("#container");

gsap.to(q(".box"), { x: 100 });
gsap.to(q(".title"), { opacity: 1 });
```

### shuffle()
Embaralha array in-place.

```javascript
const arr = [1, 2, 3, 4, 5];
gsap.utils.shuffle(arr);
// [3, 1, 5, 2, 4]
```

## Numeros e Ranges

### clamp()
Restringe valor a um range.

```javascript
gsap.utils.clamp(0, 100, -20);  // 0
gsap.utils.clamp(0, 100, 150);  // 100
gsap.utils.clamp(0, 100, 50);   // 50

// Criar funcao reutilizavel
const clampProgress = gsap.utils.clamp(0, 1);
clampProgress(1.5);  // 1
clampProgress(-0.5); // 0
```

### mapRange()
Mapeia valor de um range para outro.

```javascript
// (inputMin, inputMax, outputMin, outputMax, value)
gsap.utils.mapRange(0, 100, 0, 1, 50);  // 0.5
gsap.utils.mapRange(-10, 10, 0, 100, 0); // 50

// Criar funcao reutilizavel
const progress = gsap.utils.mapRange(0, 500, 0, 1);
progress(250);  // 0.5
```

### normalize()
Normaliza valor para 0-1 dentro de um range.

```javascript
gsap.utils.normalize(0, 100, 50);   // 0.5
gsap.utils.normalize(100, 200, 150); // 0.5

// Funcao reutilizavel
const norm = gsap.utils.normalize(0, 500);
norm(250);  // 0.5
```

### interpolate()
Interpola entre dois valores.

```javascript
// Numeros
gsap.utils.interpolate(0, 100, 0.5);  // 50

// Cores
gsap.utils.interpolate("red", "blue", 0.5);
// "rgba(128,0,128,1)"

// Strings com numeros
gsap.utils.interpolate("20px", "100px", 0.5);
// "60px"

// Arrays
gsap.utils.interpolate([0, 50], [100, 200], 0.5);
// [50, 125]

// Objetos
gsap.utils.interpolate(
  { x: 0, y: 0 },
  { x: 100, y: 50 },
  0.5
);
// { x: 50, y: 25 }

// Funcao reutilizavel
const colorMix = gsap.utils.interpolate("red", "blue");
colorMix(0.3);  // Cor 30% do caminho
```

### snap()
Arredonda para incrementos ou valores.

```javascript
// Para incrementos
gsap.utils.snap(5, 12);   // 10
gsap.utils.snap(5, 13);   // 15

// Para array de valores
gsap.utils.snap([0, 25, 50, 100], 32);  // 25
gsap.utils.snap([0, 25, 50, 100], 40);  // 50

// Funcao reutilizavel
const snapTo10 = gsap.utils.snap(10);
snapTo10(47);  // 50

// Com range 2D
gsap.utils.snap({
  values: [0, 100, 200, 300],
  radius: 20  // Snap apenas se dentro de 20px
}, 105);  // 100
```

### wrap()
Ciclico - volta ao inicio quando passa do fim.

```javascript
// Range numerico
gsap.utils.wrap(0, 100, 105);  // 5
gsap.utils.wrap(0, 100, -10);  // 90

// Array
gsap.utils.wrap(["a", "b", "c"], 0);  // "a"
gsap.utils.wrap(["a", "b", "c"], 3);  // "a"
gsap.utils.wrap(["a", "b", "c"], 4);  // "b"

// Funcao reutilizavel
const wrapIndex = gsap.utils.wrap(0, 5);
wrapIndex(7);  // 2
```

### wrapYoyo()
Como wrap, mas volta em vez de reiniciar.

```javascript
gsap.utils.wrapYoyo(0, 5, 6);  // 4 (voltando)
gsap.utils.wrapYoyo(0, 5, 7);  // 3
gsap.utils.wrapYoyo(0, 5, 10); // 0

const colors = ["red", "green", "blue"];
gsap.utils.wrapYoyo(colors, 4);  // "green"
```

## Randomizacao

### random()
Gera numeros aleatorios.

```javascript
// Range
gsap.utils.random(0, 100);      // Float entre 0 e 100
gsap.utils.random(0, 100, 5);   // Com snap de 5
gsap.utils.random(0, 100, true); // Inteiro

// De array
gsap.utils.random(["red", "green", "blue"]);

// Funcao reutilizavel
const randomX = gsap.utils.random(-100, 100, true);
randomX();  // Numero inteiro aleatorio
```

## Composicao

### pipe()
Encadeia funcoes.

```javascript
const transform = gsap.utils.pipe(
  gsap.utils.clamp(0, 100),
  gsap.utils.snap(10),
  (val) => val + "px"
);

transform(47);   // "50px"
transform(-20);  // "0px"
transform(150);  // "100px"
```

### distribute()
Distribui valores entre elementos com easing.

```javascript
const amounts = gsap.utils.distribute({
  base: 0,
  amount: 100,
  from: "center",
  ease: "power2"
});

// Usar em stagger
gsap.to(".box", {
  x: amounts,
  stagger: 0.1
});
```

## Unidades

### getUnit()
Extrai unidade de uma string.

```javascript
gsap.utils.getUnit("200px");   // "px"
gsap.utils.getUnit("50%");     // "%"
gsap.utils.getUnit("3.5rem");  // "rem"
gsap.utils.getUnit(100);       // ""
```

### unitize()
Wrapper que adiciona unidade ao resultado.

```javascript
const clampPx = gsap.utils.unitize(
  gsap.utils.clamp(0, 100),
  "px"
);

clampPx(150);  // "100px"
clampPx(-20);  // "0px"
```

## Cores

### splitColor()
Divide cor em componentes RGB(A).

```javascript
gsap.utils.splitColor("red");
// [255, 0, 0]

gsap.utils.splitColor("#ff5500");
// [255, 85, 0]

gsap.utils.splitColor("rgba(255,100,50,0.5)");
// [255, 100, 50, 0.5]

// Com formato HSL
gsap.utils.splitColor("hsl(120, 50%, 50%)", true);
// [120, 0.5, 0.5]
```

## CSS

### checkPrefix()
Retorna propriedade com prefixo vendor se necessario.

```javascript
gsap.utils.checkPrefix("transform");
// "transform" ou "webkitTransform"
```

## Exemplo de Uso Combinado

```javascript
// Parallax com clamping
gsap.to(".parallax", {
  y: () => {
    const progress = gsap.utils.mapRange(
      0, document.body.scrollHeight,
      0, 1,
      window.scrollY
    );
    return gsap.utils.interpolate(0, -200, progress);
  },
  scrollTrigger: {
    trigger: ".parallax",
    scrub: true
  }
});

// Carousel infinito
const items = gsap.utils.toArray(".item");
const wrapIndex = gsap.utils.wrap(0, items.length);

function goToIndex(index) {
  const wrappedIndex = wrapIndex(index);
  gsap.to(items[wrappedIndex], { scale: 1.2 });
}

// Mouse follower com snap
const snapX = gsap.utils.pipe(
  gsap.utils.clamp(0, window.innerWidth),
  gsap.utils.snap(50)
);

document.addEventListener("mousemove", (e) => {
  gsap.to(".follower", {
    x: snapX(e.clientX),
    y: e.clientY
  });
});

// Distribuicao de cores
const colors = gsap.utils.toArray(".color-box");
colors.forEach((box, i) => {
  const progress = gsap.utils.normalize(0, colors.length - 1, i);
  const color = gsap.utils.interpolate("#ff0000", "#0000ff", progress);
  gsap.set(box, { backgroundColor: color });
});
```
