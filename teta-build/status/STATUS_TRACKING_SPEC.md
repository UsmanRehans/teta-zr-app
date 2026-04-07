# Teta Status Tracking — Specification
# Track what's built, what's next, and why decisions were made.

---

## What is this system?

Two files that keep the project's build history alive:

1. **BUILD_STATUS.md** — A dashboard. Open it to know where things stand in 10 seconds.
2. **BUILD_LOG.md** — A decision journal. Open it to know why things were built the way they were.

Together, they ensure that context survives across sessions, onboarding is instant, and past decisions can be audited without guessing.

## When to update

After **every build step**, before moving to the next one. This is part of the post-step checklist defined in MASTER_PROMPT.md. The status update is a deliverable — treat it like code.

## Status values

Only three allowed values. No ambiguity.

| Status | Meaning |
|--------|---------|
| `not-started` | Work has not begun on this system |
| `in-progress` | Actively being built in the current or recent session |
| `done` | Fully functional, tested, and verified |

## BUILD_STATUS.md — The Dashboard

### Structure

1. **Progress header** at the top:
   - Current phase (1–4)
   - Current build step or prompt number
   - Systems completed (e.g., 3/8 for Phase 1)
   - Active blockers (or "None")

2. **One table per phase** with columns:
   - `#` — System number (1–27, matching ALL_PHASES.md)
   - `System` — System name
   - `Status` — One of the three values above
   - `Step/Prompt` — Build step (Phase 1) or prompt number (Phases 2–4)
   - `Started` — Date work began (YYYY-MM-DD)
   - `Completed` — Date work finished (YYYY-MM-DD)
   - `Notes` — One line max. Detailed rationale belongs in BUILD_LOG.md.

### Phase 1 system-to-step mapping

| System | Build Steps (from MASTER_PROMPT) |
|--------|----------------------------------|
| 1. Web app foundation | Steps 1–4 (create project, install deps, Supabase client, DB migration) |
| 2. Phone OTP auth | Step 5 |
| 3. Cook profile | Step 6 |
| 4. Dish listings | Step 7 |
| 5. Customer browse | Step 8 |
| 6. Order flow | Step 9 |
| 7. Teta Agent | Step 10 |
| 8. Admin dashboard | Step 11 (includes deploy to Vercel) |

### Phases 2–4

Use the prompt numbers from ALL_PHASES.md (Prompts 9–20) in the Step/Prompt column instead of build steps.

## BUILD_LOG.md — The Decision Journal

### Rules

- **Newest first** — prepend new entries at the top
- **One entry per build step** completed
- **Never skip an entry** — even if nothing interesting happened

### Entry template

Every entry has exactly this structure:

```markdown
---

## Entry #[N] — [Step/Prompt name]
**Date:** YYYY-MM-DD
**System:** #[N] [System name]
**Status:** not-started → in-progress | in-progress → done
**Duration:** ~[X] hours

### What was built
- [Bullet list of concrete deliverables: files created, components built, integrations wired]

### Decisions made
- **[Decision as a bold statement].** [Rationale — why this choice, what alternatives were considered]

### Deviations from plan
- [What differs from ALL_PHASES.md, MASTER_PROMPT.md, or other specs]
- [If nothing changed: "None. Built exactly as specified."]

### Blockers
- [Anything preventing forward progress, or "None"]

### Lessons learned
- [Gotchas, surprises, tips that future build steps should know]
```

### What belongs in each section

| Section | Include | Do NOT include |
|---------|---------|----------------|
| What was built | Files, components, integrations | Opinions, rationale |
| Decisions made | The choice + why + alternatives rejected | Implementation details |
| Deviations | Differences from specs | Things that matched specs |
| Blockers | Unsolved problems, missing credentials, external dependencies | Solved issues |
| Lessons learned | Surprises, gotchas, non-obvious tips | Obvious things |

## Who updates these files?

Claude Code, as part of the post-step checklist. The human reviews but does not need to write entries manually.
