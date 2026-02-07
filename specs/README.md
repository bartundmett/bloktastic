# Bloktastic MVP - Task Specifications

Diese Specs definieren das MVP für Bloktastic. Jeder Task baut auf dem vorherigen auf.

## Übersicht

| Task | Titel | Geschätzte Zeit | Abhängig von |
|------|-------|-----------------|--------------|
| 01 | Repository-Struktur & Monorepo Setup | 1-2h | - |
| 02 | JSON Schemas definieren | 2-3h | Task 01 |
| 03 | CLI Package Setup (Grundgerüst) | 3-4h | Task 02 |
| 04 | CLI init & validate Commands | 2-3h | Task 03 |
| 05 | CLI create Command | 2-3h | Task 04 |
| 06 | CLI add Command mit Storyblok API | 4-5h | Task 05 |
| 07 | CLI search, list, info Commands | 2-3h | Task 06 |
| 08 | Starter Components (5 Stück) | 4-6h | Task 07 |
| 09 | GitHub Actions | 2-3h | Task 08 |
| 10 | Website Setup (Astro) | 3-4h | Task 09 |
| 11 | Website Component Browser | 3-4h | Task 10 |
| 12 | Website Documentation | 2-3h | Task 11 |
| 13 | Final Polish & Launch | 2-3h | Task 12 |

**Geschätzte Gesamtzeit:** 30-45 Stunden

## Task-Dateien

```
specs/
├── README.md                          # Diese Übersicht
├── task-01-repository-setup.md        # Monorepo & pnpm
├── task-02-json-schemas.md            # bloktastic.schema.json
├── task-03-cli-setup.md               # CLI Grundgerüst
├── task-04-cli-init-validate.md       # init & validate Commands
├── task-05-cli-create.md              # create Command
├── task-06-cli-add.md                 # add Command + Storyblok
├── task-07-cli-search-list-info.md    # Discovery Commands
├── task-08-starter-components.md      # 5 Starter Components
├── task-09-github-actions.md          # CI/CD Workflows
├── task-10-website-setup.md           # Astro Setup
├── task-11-website-browser.md         # Component Browser
├── task-12-website-docs.md            # Documentation
└── task-13-final-polish.md            # README, CONTRIBUTING, Launch
```

## Für Coding Agents

Jeder Task enthält:

1. **Ziel** - Was soll erreicht werden
2. **Voraussetzungen** - Welche Tasks müssen abgeschlossen sein
3. **Technische Details** - Stack, Dependencies, Architektur
4. **Zu erstellende Dateien** - Code und Konfiguration
5. **Acceptance Criteria** - Wann ist der Task fertig
6. **Test Commands** - Wie wird getestet

### Empfohlene Vorgehensweise

1. Task von oben nach unten abarbeiten
2. Nach jedem Task die Acceptance Criteria prüfen
3. Bei Unklarheiten: Test Commands ausführen
4. Erst zum nächsten Task, wenn alle Kriterien erfüllt

### Wichtige Hinweise

- **Node.js 20** ist Minimum-Version
- **pnpm** ist der Package Manager (nicht npm/yarn)
- **TypeScript** wird für CLI und Scripts verwendet
- **Astro** für die Website
- **Storyblok OAuth Token** wird für Task 06+ benötigt

## MVP Scope

### Enthalten ✅

- CLI mit allen Commands
- 5 Starter Components
- Website mit Browser, Detail, Docs
- GitHub Actions für CI/CD
- Professionelle Dokumentation

### Nicht enthalten ❌ (Phase 2+)

- E-Commerce Components
- Plugin-Support (nur Components)
- Presets/Bundles
- Private Registry
- Community Feedback System
- Prompt Ratings

## Kontakt

**Maintainer:** Benedikt Müller
**Status:** Storyblok MVP
