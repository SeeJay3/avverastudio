import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Observer, ScrollTrigger, ScrollToPlugin);

gsap.defaults({
  ease: 'power2.out',
  duration: 0.8,
});

const NAV_OFFSET = 100;
const isMobile = () => window.innerWidth <= 768;

/* =========================================================================
 * PANEL SYSTEM (desktop) — slide-mask reveal entre seções
 * Pattern: panels stacked com position:fixed. Wheel/touch hijack troca panels
 * via timeline (outer/inner yPercent opostos cria efeito de máscara).
 * Mobile: skipa, panels viram blocos normais via CSS.
 * ========================================================================= */
function initPanelSystem() {
  const panels = Array.from(document.querySelectorAll<HTMLElement>('.panel'));
  if (panels.length === 0) return;

  const outerWrappers = gsap.utils.toArray<HTMLElement>('.panel .outer');
  const innerWrappers = gsap.utils.toArray<HTMLElement>('.panel .inner');
  const panelContents = gsap.utils.toArray<HTMLElement>('.panel .panel-content');

  let currentIndex = -1;
  let animating = false;
  const lastIndex = panels.length - 1;

  // Em modo painel, o slide-mask JÁ é a entrada — força .gsap-fade visível
  // pra evitar flash/desyncs (CSS global esconde por padrão pro mobile).
  gsap.set('.gsap-fade', { opacity: 1, y: 0 });
  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });

  function gotoSection(index: number, direction: number) {
    if (index < 0 || index > lastIndex || animating) return;
    animating = true;
    const dFactor = direction === -1 ? -1 : 1;
    const targetPanel = panels[index];

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power2.inOut' },
      onComplete: () => {
        animating = false;
        window.dispatchEvent(
          new CustomEvent('panelchange', { detail: { index, section: targetPanel.dataset.section } })
        );
      },
    });

    if (currentIndex >= 0) {
      gsap.set(panels[currentIndex], { zIndex: 0 });
      // Slide-out espelhado do antigo (continuous flow). yPercent inverso
      // do novo cria sensação de scroll contínuo entre painéis.
      tl.to(
        [outerWrappers[currentIndex], innerWrappers[currentIndex]],
        { yPercent: (i: number) => (i ? 100 * dFactor : -100 * dFactor) },
        0
      )
        .to(panelContents[currentIndex], { yPercent: -5 * dFactor }, 0)
        .set(panels[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(targetPanel, { autoAlpha: 1, zIndex: 1 });

    tl.fromTo(
      [outerWrappers[index], innerWrappers[index]],
      { yPercent: (i: number) => (i ? -100 * dFactor : 100 * dFactor) },
      { yPercent: 0 },
      0
    ).fromTo(panelContents[index], { yPercent: 5 * dFactor }, { yPercent: 0 }, 0);

    currentIndex = index;
  }

  // Wheel/touch hijack — pattern oficial GSAP fullpage
  Observer.create({
    type: 'wheel,touch,pointer',
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    onUp: () => {
      if (animating) return;
      gotoSection(currentIndex + 1, 1);
    },
    onDown: () => {
      if (animating) return;
      gotoSection(currentIndex - 1, -1);
    },
  });

  // Primeiro painel
  gotoSection(0, 1);

  // Anchor links (nav, CTAs) → goToSection do painel correspondente
  const sectionMap: Record<string, number> = {};
  panels.forEach((panel, i) => {
    const section = panel.dataset.section;
    if (section) sectionMap[section] = i;
  });

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === '#') {
      e.preventDefault();
      if (currentIndex !== 0 && !animating) {
        gotoSection(0, currentIndex > 0 ? -1 : 1);
      }
      return;
    }

    const targetId = href.slice(1);
    const targetIndex = sectionMap[targetId];
    if (targetIndex !== undefined && targetIndex !== currentIndex && !animating) {
      e.preventDefault();
      const direction = targetIndex > currentIndex ? 1 : -1;
      gotoSection(targetIndex, direction);
    }
  });

  (window as Window & { __panelNav?: unknown }).__panelNav = {
    goto: gotoSection,
    getCurrentIndex: () => currentIndex,
  };
}

/* =========================================================================
 * MOBILE FALLBACK — sem hijack. ScrollToPlugin pra anchors, ScrollTrigger
 * pra revelar .gsap-fade conforme entram na viewport.
 * ========================================================================= */
function initMobileScroll() {
  // Anchor smooth-scroll com offset pra nav
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href === '#') {
        e.preventDefault();
        gsap.to(window, { duration: 1.0, scrollTo: { y: 0 }, ease: 'power2.out' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: href, offsetY: NAV_OFFSET },
        ease: 'power2.out',
      });
    });
  });

  // Reveal por scroll
  gsap.utils.toArray<HTMLElement>('.gsap-fade').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/* =========================================================================
 * MAGNETIC HOVER — qualquer elemento com [data-magnet]
 * ========================================================================= */
function initMagneticElements() {
  const els = gsap.utils.toArray<HTMLElement>('[data-magnet]');
  const strength = 0.35;

  els.forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ========================================================================= */

const ctx = gsap.context(() => {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    if (isMobile()) {
      initMobileScroll();
    } else {
      initPanelSystem();
    }

    // Nav fade-in (universal)
    gsap.from('[data-nav]', {
      opacity: 0,
      y: -12,
      duration: 0.7,
      ease: 'power2.out',
      delay: 0.1,
    });

    initMagneticElements();
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.gsap-fade', { opacity: 1, y: 0 });
    initMobileScroll();
  });
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    ctx.revert();
    Observer.getAll().forEach((o) => o.kill());
    ScrollTrigger.getAll().forEach((st) => st.kill());
  });
}
