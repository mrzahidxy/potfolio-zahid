# AGENT.md

## Project Overview
This folder contains a Next.js portfolio app with two main surfaces:

- Public site: landing page, project list, experience list, contact section, footer, and navbar.
- Admin area: login, dashboard, project management, experience management, and profile editing.

Data comes from a mix of file-backed defaults and MongoDB-backed records. The public site should keep working with sensible fallback content even if the database is unavailable.

## Structure
- `src/app/`
  - App router layouts, pages, and API routes.
  - `src/app/(root)/` contains the public site.
  - `src/app/(admin)/` contains the admin area.
  - `src/app/api/` contains public and admin API handlers.
- `src/components/`
  - Public-facing UI plus shared presentational components.
  - `src/components/common/` contains small reusable UI pieces only when reuse is real.
- `src/context/`
  - Client-side auth and public-profile state.
- `src/lib/`
  - Database connection, profile/content transforms, and admin validation helpers.
- `src/models/`
  - Mongoose models.
- `src/data/profile.json`
  - Default profile content and fallback content source.
- `scripts/`
  - Seed/update scripts for local data setup.

## Main App Areas
- Public homepage
  - [src/app/(root)/page.tsx](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/app/(root)/page.tsx)
  - [src/components/HomeProfileSections.tsx](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/components/HomeProfileSections.tsx)
  - [src/components/HomeContactSection.tsx](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/components/HomeContactSection.tsx)
- Public profile loading and fallback behavior
  - [src/context/PublicProfileContext.tsx](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/context/PublicProfileContext.tsx)
  - [src/lib/profile-content.ts](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/lib/profile-content.ts)
  - [src/data/profile.json](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/data/profile.json)
- Admin auth and layout
  - [src/context/AuthContext.tsx](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/context/AuthContext.tsx)
  - [src/app/(admin)/AdminShell.tsx](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/app/(admin)/AdminShell.tsx)
  - [src/middleware/auth.ts](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/middleware/auth.ts)
- Project and experience data flows
  - [src/app/api/projects/route.ts](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/app/api/projects/route.ts)
  - [src/app/api/experiences/route.ts](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/app/api/experiences/route.ts)
  - [src/app/api/admin/projects/route.ts](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/app/api/admin/projects/route.ts)
  - [src/app/api/admin/experiences/route.ts](/mnt/c/Users/mrzah/Desktop/Projects/portfolio/potfolio-zahid/portfolio/src/app/api/admin/experiences/route.ts)

## Coding Principles
- Prefer direct code over reusable-looking abstractions that only serve one place.
- Keep data flow obvious. If content comes from `profile.json` first and DB second, make that easy to trace.
- Use shared helpers only when they remove real duplication or enforce one source of truth.
- Keep components small enough to scan quickly. Split only when a component becomes meaningfully harder to read.
- Favor plain state and effects over extra layers of memoization unless they prevent a real bug or rerender loop.
- Preserve current behavior unless a change clearly fixes a bug or removes dead code.

## Practical Rules For Future Changes
- Prefer simple solutions.
- Avoid speculative abstractions.
- Delete unused code.
- Keep components small and readable.
- Follow existing patterns unless they are clearly harmful.
- Make focused changes, not sweeping rewrites.
- Do not introduce a helper just to move a few lines elsewhere.
- Keep API handlers boring and explicit.
- Keep fallback behavior safe for the public site.
- Ignore generated directories such as `.next/` and dependency directories such as `node_modules/`.
