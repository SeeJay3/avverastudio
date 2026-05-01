# Componentes React

Diretório destinado aos componentes React (incluindo blocos copiados de
[reactbits.dev](https://reactbits.dev)).

## Como usar React Bits

1. Vá em https://reactbits.dev e copie o snippet do componente desejado.
2. Salve o arquivo aqui dentro (ex.: `SplitText.tsx`, `BlurText.tsx`).
3. Se o componente precisar de GSAP, importe direto — `gsap` já está instalado:

   ```tsx
   import { useGSAP } from '@gsap/react';
   import gsap from 'gsap';
   import { useRef } from 'react';

   export function SplitText({ text }: { text: string }) {
     const ref = useRef<HTMLSpanElement>(null);
     useGSAP(
       () => {
         gsap.from(ref.current!.querySelectorAll('span'), {
           opacity: 0,
           y: 20,
           stagger: 0.04,
         });
       },
       { scope: ref }
     );
     return (
       <span ref={ref}>
         {text.split('').map((c, i) => (
           <span key={i} style={{ display: 'inline-block' }}>
             {c}
           </span>
         ))}
       </span>
     );
   }
   ```

4. Use no componente Astro com a diretiva `client:*`:

   ```astro
   ---
   import { SplitText } from '~/components/react/SplitText';
   ---

   <SplitText text="Avvera" client:load />
   ```

   Diretivas disponíveis:
   - `client:load` — hidrata imediatamente.
   - `client:idle` — hidrata quando o navegador estiver ocioso.
   - `client:visible` — hidrata só quando entrar na viewport (ideal para componentes pesados abaixo da dobra).
   - `client:only="react"` — renderiza apenas no cliente, sem SSR.

## Por que `useGSAP`?

`useGSAP` (do pacote `@gsap/react`) faz cleanup automático no unmount,
respeita o `scope` para queries seletoras e evita memory leaks com ScrollTrigger.
Use sempre que escrever animações dentro de componentes React.
