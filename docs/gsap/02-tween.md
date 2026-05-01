# GSAP Tween - Propriedades e Metodos

## Propriedades Especiais (vars)

### Timing
| Propriedade | Descricao | Default |
|-------------|-----------|---------|
| `duration` | Duracao em segundos | 0.5 |
| `delay` | Atraso antes de iniciar | 0 |
| `repeat` | Numero de repeticoes (-1 = infinito) | 0 |
| `repeatDelay` | Atraso entre repeticoes | 0 |
| `yoyo` | Alterna direcao a cada repeticao | false |

### Comportamento
| Propriedade | Descricao | Default |
|-------------|-----------|---------|
| `ease` | Funcao de suavizacao | "power1.out" |
| `paused` | Inicia pausado | false |
| `reversed` | Inicia invertido | false |
| `immediateRender` | Renderiza imediatamente | from: true |
| `lazy` | Atrasa escrita de valores | true |
| `overwrite` | Conflito com outras animacoes | false |

### Identificacao
| Propriedade | Descricao |
|-------------|-----------|
| `id` | ID unico para gsap.getById() |
| `data` | Dados arbitrarios anexados ao tween |

### Outros
| Propriedade | Descricao |
|-------------|-----------|
| `stagger` | Offset entre multiplos targets |
| `keyframes` | Array de estados sequenciais |
| `startAt` | Valores iniciais |
| `runBackwards` | Inverte inicio/fim |
| `inherit` | Herda defaults do timeline pai |

## Callbacks

```javascript
gsap.to(".box", {
  x: 100,
  duration: 1,

  onStart: () => console.log("Iniciou"),
  onStartParams: ["param1"],

  onUpdate: () => console.log("Atualizando"),
  onUpdateParams: [],

  onComplete: () => console.log("Completou"),
  onCompleteParams: [],

  onRepeat: () => console.log("Repetindo"),
  onRepeatParams: [],

  onReverseComplete: () => console.log("Voltou ao inicio"),
  onReverseCompleteParams: [],

  callbackScope: this // Contexto do this nos callbacks
});
```

## Metodos de Instancia

### Controle de Playback
```javascript
const tween = gsap.to(".box", { x: 100 });

tween.play();           // Continua/inicia
tween.play(0.5);        // Inicia do tempo 0.5s

tween.pause();          // Pausa
tween.pause(1);         // Pausa no tempo 1s

tween.resume();         // Continua sem mudar direcao

tween.reverse();        // Inverte direcao
tween.reverse(0);       // Inverte a partir do inicio

tween.restart();        // Reinicia do inicio
tween.restart(true);    // Inclui delay

tween.seek(0.5);        // Pula para tempo especifico

tween.kill();           // Encerra e remove
tween.kill(null, "x");  // Mata apenas propriedade x
```

### Getters/Setters
```javascript
// Tempo (exclui repeats)
tween.time();         // Getter
tween.time(0.5);      // Setter

// Tempo total (inclui repeats)
tween.totalTime();
tween.totalTime(2);

// Progresso 0-1 (exclui repeats)
tween.progress();
tween.progress(0.5);

// Progresso total 0-1 (inclui repeats)
tween.totalProgress();
tween.totalProgress(0.75);

// Duracao
tween.duration();
tween.duration(2);

// Duracao total (com repeats)
tween.totalDuration();

// Delay
tween.delay();
tween.delay(0.5);

// Repeat
tween.repeat();
tween.repeat(3);

// TimeScale (velocidade)
tween.timeScale();    // 1 = normal
tween.timeScale(2);   // 2x mais rapido
tween.timeScale(0.5); // 2x mais lento

// Estado pausado
tween.paused();
tween.paused(true);

// Estado invertido
tween.reversed();
tween.reversed(true);

// Yoyo
tween.yoyo();
tween.yoyo(true);

// Iteracao atual
tween.iteration();
tween.iteration(2);
```

### Outros Metodos
```javascript
// Verifica se esta ativo (entre start e end)
tween.isActive();

// Invalida valores cached (recalcula no proximo render)
tween.invalidate();

// Reverte para estado original
tween.revert();

// Retorna targets animados
tween.targets();

// Tempo final na timeline pai
tween.endTime();
tween.endTime(true); // Inclui repeats

// Converte tempo local para global
tween.globalTime(0.5);

// Promise-based completion
tween.then(() => console.log("Done"));

// Gerenciar callbacks
tween.eventCallback("onComplete", myFunc, [params]);
tween.eventCallback("onComplete"); // Remove
```

## Propriedades Read-Only

```javascript
tween.ratio         // Progresso na curva ease (pode > 1 com elastic)
tween.vars          // Objeto de configuracao original
tween.data          // Dados customizados
tween.scrollTrigger // Instancia ScrollTrigger associada
```

## Valores Especiais

### Valores Relativos
```javascript
gsap.to(".box", {
  x: "+=100",   // Adiciona 100 ao valor atual
  y: "-=50",    // Subtrai 50 do valor atual
  rotation: "*=2" // Multiplica por 2
});
```

### Valores Randomicos
```javascript
gsap.to(".box", {
  x: "random(-100, 100)",           // Entre -100 e 100
  y: "random(-100, 100, 5)",        // Com snap de 5
  backgroundColor: "random([red, blue, green])" // De array
});
```

### Funcoes como Valores
```javascript
gsap.to(".box", {
  x: (index, target, targets) => {
    return index * 50; // Valor diferente para cada target
  }
});
```

## Keyframes

### Array Syntax
```javascript
gsap.to(".box", {
  keyframes: [
    { x: 100, duration: 1 },
    { y: 50, duration: 0.5 },
    { rotation: 360, duration: 1 }
  ]
});
```

### Percentage Syntax
```javascript
gsap.to(".box", {
  keyframes: {
    "0%":   { x: 0 },
    "50%":  { x: 100, ease: "power2.in" },
    "100%": { x: 50 }
  },
  duration: 2
});
```

## Stagger

### Basico
```javascript
gsap.to(".box", {
  x: 100,
  stagger: 0.1 // 0.1s entre cada elemento
});
```

### Avancado
```javascript
gsap.to(".box", {
  x: 100,
  stagger: {
    each: 0.1,           // Tempo entre cada
    // OU
    amount: 1,           // Tempo total distribuido

    from: "start",       // "start", "end", "center", "edges", "random", index, ou [x,y]
    grid: "auto",        // Auto-detecta grid, ou [rows, cols]
    axis: "x",           // "x" ou "y" para grids
    ease: "power2.inOut" // Ease da distribuicao
  }
});
```

### Funcao Stagger
```javascript
gsap.to(".box", {
  x: 100,
  stagger: (index, target, list) => {
    return index * 0.1;
  }
});
```

## Overwrite Modes

```javascript
gsap.to(".box", {
  x: 100,
  overwrite: "auto" // Mata propriedades conflitantes
});

// Opcoes:
// false - Nao mata nada (default)
// true  - Mata TODOS os tweens do target imediatamente
// "auto" - Mata apenas propriedades conflitantes no primeiro render
```
