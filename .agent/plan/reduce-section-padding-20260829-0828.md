---
id: reduce-section-padding
schema: 2
date: 2026-08-29
status: Draft
complexity: Medium
risk: Low
linked_issue: None
---

# Implementation Plan - Reduce Section Top/Bottom Padding and Margins

The user requested reducing top and bottom vertical spacing (padding and margin) between landing page sections to create a more compact, visually cohesive layout.

## Objective

Reduce vertical padding (`py-*` classes) and margins (`mt-*` / `mb-*`) across all section components on the marketing landing page (`Landing.tsx` and its individual section components in `src/pages/marketing/components/`).

## Non-Goals

- Changing layout structure, component alignment, or colors.
- Affecting admin or dashboard pages.

## User Review Required

> [!IMPORTANT]
> - Vertical section paddings will be reduced from `py-20 sm:py-24 lg:py-28` to approximately `py-10 sm:py-14 lg:py-16` (around 40-50% reduction).

## Open Questions

- None. All requirements are clear.

## Risks & Rollback

| Risk | Blast radius | Rollback |
| --- | --- | --- |
| Sections feel slightly cramped on large screens | Marketing Landing Page only | Revert changes via git |

## Dependencies & Ordering

None - order-independent.

## Proposed Changes

### Marketing Landing Page Components

#### [MODIFY] `src/pages/marketing/Landing.tsx`
- Change main wrapper top margin from `mt-10` to `mt-4`.

#### [MODIFY] `src/pages/marketing/components/HeroSection.tsx`
- Reduce hero inner container padding from `py-14 sm:py-20 lg:py-16` to `py-8 sm:py-12 lg:py-10`.

#### [MODIFY] `src/pages/marketing/components/AboutSection.tsx`
- Reduce section padding from `py-20 sm:py-28` to `py-10 sm:py-14`.

#### [MODIFY] `src/pages/marketing/components/ProcessSection.tsx`
- Reduce section padding from `py-20 sm:py-24 lg:py-28` to `py-10 sm:py-14 lg:py-16`.

#### [MODIFY] `src/pages/marketing/components/AppScreenshotsSlider.tsx`
- Reduce section padding from `py-24 sm:py-32` to `py-12 sm:py-16`.

#### [MODIFY] `src/pages/marketing/components/BusinessSolutionsSection.tsx`
- Reduce section outer padding from `py-16 sm:py-20 lg:py-24` to `py-8 sm:py-12 lg:py-14`.
- Reduce inner card padding from `py-14 sm:py-16 lg:py-20` to `py-8 sm:py-10 lg:py-12`.

#### [MODIFY] `src/pages/marketing/components/CoverageSection.tsx`
- Reduce section padding from `py-20 sm:py-24 lg:py-28` to `py-10 sm:py-14 lg:py-16`.

#### [MODIFY] `src/pages/marketing/components/DriverSpotlightSection.tsx`
- Reduce section padding from `py-10 sm:py-14 lg:py-16` to `py-6 sm:py-8 lg:py-10`.

#### [MODIFY] `src/pages/marketing/components/TestimonialsSection.tsx`
- Reduce section padding from `py-20 sm:py-28` to `py-10 sm:py-14`.

#### [MODIFY] `src/pages/marketing/components/BlogSection.tsx`
- Reduce section padding from `py-20 sm:py-28` to `py-10 sm:py-14`.

#### [MODIFY] `src/pages/marketing/components/TechnicalBackboneSection.tsx`
- Reduce section padding from `py-20 sm:py-24 lg:py-28` to `py-10 sm:py-14 lg:py-16`.

## Environment / Config Changes

None.

## Verification Plan

### Automated
- `npm run build` or `npx vite build` to ensure no syntax errors in TypeScript/React.

### Manual
1. Open the landing page and scroll through all sections.
2. Verify that top and bottom vertical spacing between sections is tighter and more balanced without visual clipping.

## Definition of Done

- [ ] All section components have updated padding/margin Tailwind classes.
- [ ] Landing page main container top margin updated.
- [ ] Build succeeds without errors.