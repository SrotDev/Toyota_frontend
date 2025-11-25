# Frontend Architecture Decision

Date: 2025-11-25
Status: Accepted

## Context
Original high-level vision referenced a Next.js + Tailwind stack. The actual implementation is a lean React 19 + Vite TypeScript project with simple service layer, endpoint abstractions, and mock fallback data. No SSR/ISR requirements have been expressed yet. Current needs:
- Rapid iteration locally with Django backend on localhost
- Simple proxying of /api routes
- Lightweight build and minimal tooling surface

Future possible needs that could motivate migration:
- SEO for public, indexable track pages / marketing content
- Server-side data hydration for performance on large analytics payloads
- Image optimization and edge caching
- Route-level code splitting & middleware auth beyond client side
- Design system standardization using utility-first CSS

## Options Considered
1. Keep Vite + React (augment with Tailwind only if styling scale increases)
2. Migrate to Next.js (App Router) + Tailwind
3. Hybrid: Introduce Tailwind now; defer Next.js until SSR/SEO is proven necessary

## Decision
KEEP current Vite + React for the next iteration; ADD Tailwind only when styling debt or velocity demands it. Defer full Next.js migration until one or more of the following triggers occur:
- Requirement for SEO / pre-rendered marketing pages
- Need for edge middleware / advanced routing primitives
- Persistent performance issue solvable via SSR streaming or server components

## Rationale
- Startup Speed: Vite keeps cold/hot reload extremely fast for frequent model UI iterations.
- Complexity Budget: Avoid introducing routing + SSR concepts prematurely.
- Styling: Current component count and complexity do not yet justify Tailwind or design tokens; can layer later without churn.
- Migration Cost: Jumping to Next.js now provides little immediate ROI absent SEO goals.

## Tailwind Adoption Plan (Optional Future)
1. Add dependency: `npm install -D tailwindcss postcss autoprefixer`
2. Init config: `npx tailwindcss init -p`
3. Configure `tailwind.config.js` content to scan `./{components,App.tsx}/**/*.tsx`
4. Add base styles to `index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
5. Incrementally replace bespoke inline styles with utility classes.

## Next.js Migration Triggers & High-Level Path
Triggers:
- Public marketing site needs indexing
- Shared layouts with dynamic meta tags
- Server component data fetching to reduce client waterfall

High-Level Steps:
1. Create new repo folder `frontend-next/` with `npx create-next-app@latest` (TypeScript)
2. Port routes: Map existing navigation states to `/tracks/[id]`, `/leaderboard`, `/uploads` etc.
3. Move service layer to `lib/api` preserving fetch logic; leverage Next.js route handlers only if auth/session added.
4. Introduce Tailwind concurrently for layout consistency.
5. Run dual for one sprint; retire Vite when feature parity validated.

## Risks & Mitigations
- Risk: Styling divergence if Tailwind introduced ad hoc. Mitigate with a small design guideline doc.
- Risk: Forgetting SSR constraints when copying client-only code. Mitigate via lint rule to forbid `window` usage in server components.
- Risk: Migration stall. Keep success criteria explicit (SEO metrics or page load audit).

## Success Criteria (for staying with Vite short term)
- Sub-150ms local HMR average
- No critical UI perf regressions in dashboard views
- Feature additions not blocked by build tool limitations

## Revisit Timeline
Reassess in 6–8 weeks or earlier if SEO or server rendering requirements surface.

## Summary
Continue with the current Vite React setup; postpone framework migration until justified by clear product/technical signals. Maintain agility while preparing a documented path to Tailwind and Next.js if and when scaling or SEO demands emerge.
