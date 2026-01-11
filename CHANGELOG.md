# Changelog

## Unreleased

### Added
- feat: add shipments page with forced dynamic rendering
- feat: add `.env.example` template file for environment variables
- feat: add comprehensive work log documentation (`docs/WORK_LOG.md`)

### Changed
- fix: update development server port from 3005 to 3001 in documentation
- fix: align README.md and IMPLEMENTATION_GUIDE.md with package.json dev script
- refactor: add environment variable validation with explicit error messages
  - `src/lib/supabase.ts`: Add validation for all Supabase environment variables
  - `src/app/api/shipments/[id]/route.ts`: Add validation for API environment variables

### Improved
- docs: update README.md with environment variable setup instructions
- docs: improve code quality with better type safety (remove non-null assertions)
- docs: add `.env.example` exception in `.gitignore` for template file
