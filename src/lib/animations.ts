/**
 * Site-wide motion system (GSAP + ScrollTrigger + Lenis).
 *
 * Declarative data attributes — add them in markup, no per-page JS needed:
 *   data-hero              Hero entrance timeline item (order via data-hero="1..n")
 *   data-reveal            Fade + rise when scrolled into view
 *   data-stagger           Children reveal in a staggered sequence
 *   data-split             Heading words slide up (text reveal)
 *   data-float             Gentle infinite floating (decorative only)
 *   data-img-reveal        Clip-path image reveal
 *   data-parallax="0.1"    Very subtle parallax (decorative only)
 *   data-magnetic          Button follows the pointer slightly (fine pointers only)
 *
 * This module is only imported when prefers-reduced-motion is NOT set
 * (see BaseLayout), and all content is visible without it.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

declare global {
  interface Window {
    __starmedAnim?: boolean;
  }
}

const EASE = 'expo.out';

function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.splitDone) return Array.from(el.querySelectorAll<HTMLElement>('.split-word > span'));
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(' '));
          } else {
            const outer = document.createElement('span');
            outer.className = 'split-word';
            const inner = document.createElement('span');
            inner.textContent = part;
            outer.append(inner);
            frag.append(outer);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as HTMLElement).classList.contains('split-word')) {
        walk(child);
      }
    });
  };
  walk(el);
  el.dataset.splitDone = 'true';
  // Screen readers read the original sentence, not word fragments.
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  el.querySelectorAll('.split-word').forEach((w) => w.setAttribute('aria-hidden', 'true'));
  return Array.from(el.querySelectorAll<HTMLElement>('.split-word > span'));
}

function initLenis(): Lenis | null {
  // Native scrolling on touch devices (better for accessibility and battery).
  if (window.matchMedia('(pointer: coarse)').matches) return null;
  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: -96 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('menu:toggle', (e) => {
    const open = (e as CustomEvent<{ open: boolean }>).detail.open;
    if (open) lenis.stop();
    else lenis.start();
  });
  return lenis;
}

function heroIntro() {
  const items = gsap.utils.toArray<HTMLElement>('[data-hero]');
  if (!items.length) return;
  items.sort((a, b) => Number(a.dataset.hero || 0) - Number(b.dataset.hero || 0));
  const tl = gsap.timeline({ defaults: { ease: EASE, duration: 1.1 } });
  items.forEach((el, i) => {
    const at = i === 0 ? 0 : '<0.08';
    if (el.hasAttribute('data-hero-split')) {
      tl.set(el, { opacity: 1 }, at);
      tl.to(el.querySelectorAll('.split-word > span'), { y: 0, duration: 1.2, stagger: 0.06 }, '<');
    } else if (el.hasAttribute('data-hero-image')) {
      tl.fromTo(
        el,
        { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 2.5rem)', scale: 1.04 },
        { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 2.5rem)', scale: 1, duration: 1.4 },
        i === 0 ? 0 : '<0.1',
      );
    } else {
      tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, at);
    }
  });
}

function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE,
        delay: Number(el.dataset.revealDelay || 0),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    gsap.fromTo(
      children,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: EASE,
        stagger: Number(group.dataset.stagger || 0.08),
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    const words = splitWords(el);
    gsap.set(words, { y: '105%' });
    gsap.to(words, {
      y: 0,
      duration: 1.1,
      ease: EASE,
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-img-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(10% 10% 10% 10% round 2rem)', scale: 1.06 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 2rem)',
        scale: 1,
        duration: 1.5,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    );
  });
}

function decorative() {
  gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, i) => {
    const amp = Number(el.dataset.float || 10);
    gsap.to(el, {
      y: -amp,
      rotation: i % 2 ? 2 : -2,
      duration: 3.5 + (i % 3),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.3,
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Math.min(Number(el.dataset.parallax || 0.1), 0.2);
    gsap.to(el, {
      yPercent: -speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // ECG line draw
  gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path) => {
    const len = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: path, start: 'top 90%', once: true },
      },
    );
  });
}

function magnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.15);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

export function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  window.__starmedAnim = true;

  initLenis();
  heroIntro();
  reveals();
  decorative();
  magnetic();

  // Recalculate trigger positions once images/fonts settle (prevents mis-fires).
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
