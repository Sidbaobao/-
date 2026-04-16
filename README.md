# Stay or Return V1

A beginner-friendly Next.js scaffold for a decision-support website that helps Chinese international students in the US think through whether to stay in the US or return to China.

## Tech

- Next.js App Router
- TypeScript
- Tailwind CSS
- Frontend-only local state with `localStorage`

## Main folders

- `app/`: pages and route-level structure
- `components/`: reusable UI and chart wrappers
- `data/`: editable dimensions, questions, and report templates
- `lib/`: scoring, report generation, storage, and route guards
- `types/`: shared TypeScript types

## Notes

- The current chart components are placeholders that already use dynamic import with `ssr: false`.
- All `localStorage` access is centralized in `lib/storage.ts`.
- This V1 is intentionally simple so future changes stay easy to follow.
