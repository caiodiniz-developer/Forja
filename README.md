# Forja — Landing Page (LMS)

Frontend premium de uma plataforma de cursos (LMS), construído seguindo a skill
`frontend-design`. Conceito visual: **a fornalha** — a paleta laranja/âmbar
representa metal fundido e brasa; conhecimento não se assiste, se **forja**.

## Stack

React · TypeScript · Vite · Tailwind CSS · GSAP (ScrollTrigger) · Three.js
(react-three-fiber + drei) · Framer Motion · Lenis (smooth scroll) · React Icons.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção
npm run preview  # servir o build
```

## Vídeo de fundo do hero

O hero tem uma camada de `<video>` que procura `public/hero.mp4`. **Coloque seu
vídeo em `public/hero.mp4`** (mudo, loop; opcionalmente `public/hero-poster.jpg`)
e ele aparece automaticamente. Sem o arquivo, o fundo usa o gradiente animado + a
fornalha 3D como fallback — nada quebra.

## Design System

- **Cores** (`tailwind.config.ts`): escala `ember.900 → ember.200` (a paleta da
  marca, nomeada por temperatura), `cream` (#f9ddbc) e `iron` (grafite quente
  derivado, para contraste). Gradientes `bg-molten` / `bg-molten-soft`.
- **Tipografia**: Clash Display (títulos) · Satoshi (corpo/UI) · JetBrains Mono
  (labels e números).
- **Texturas**: glassmorphism (`.glass`), glow (`shadow-glow`), noise (`.noise`),
  gradient em texto (`.text-molten`).

## Estrutura

```
src/
  components/
    ui/        Button, Badge, CourseCard        (primitivas reutilizáveis)
    common/    Reveal, SectionHeading, ScrollProgress
    layout/    Navbar, Footer
    three/     ForgeScene                        (cena 3D, lazy-loaded)
    sections/  Hero, About, Companies, HowItWorks, Courses,
               Instructors, Benefits, Testimonials, Pricing, Faq, Cta
  hooks/       useSmoothScroll, useGSAP, useMousePosition
  data/        content.ts                        (mock: cursos, planos, etc.)
  lib/         utils.ts (cn)
  pages/       LandingPage
```

## Animações

- **Lenis** conduz o scroll, sincronizado com o ticker do GSAP.
- **GSAP + ScrollTrigger**: reveal de títulos palavra-a-palavra, linha de calor
  que se desenha no scroll (Como funciona), entradas em stagger.
- **Three.js**: núcleo incandescente distorcido + partículas de brasa, ambos
  reativos ao mouse. Carregado via `React.lazy` (fora do bundle inicial).
- **Framer Motion**: pill animado nos filtros de curso, acordeão do FAQ, barra
  de progresso de scroll, menu mobile.
- `prefers-reduced-motion` respeitado (desliga smooth scroll e animações).

## Próximos passos (fora do escopo desta entrega)

Autenticação, catálogo com rota própria, player de aulas, dashboards
(aluno/admin) e o backend (Node/Express/Prisma) do brief ainda não foram
implementados — esta entrega cobre a landing page e o design system base.
```
