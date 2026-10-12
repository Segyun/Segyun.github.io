# AGENTS.md

> Guidance and instructions for AI coding agents working on `Segyun.github.io`.

## Overview
`Segyun.github.io` is a personal portfolio and technical blog built with **Astro v5**, **Tailwind CSS v4**, **shadcn/ui (React)**, and **`@shadcn/lint`**. Runtime and development tools are managed using **mise** and **pnpm**.

---

## Dev environment tips
- **Runtime manager**: Use `mise` to maintain tool versions (`node 24`, `pnpm 12`).
  - Run `mise install` upon entering the repository to ensure all runtimes match.
  - Run tasks via `mise run <task>` (e.g. `mise run dev`, `mise run build`, `mise run lint`).
- **Package manager**: Always use `pnpm` (v12+).
  - Do not use `npm` or `yarn`. Lockfile is `pnpm-lock.yaml`.
  - Native build scripts (like `esbuild`, `sharp`) are allowed in `pnpm-workspace.yaml`.
- **Development server**:
  - Run `mise run dev` (or `pnpm dev`) to start Astro dev server at `http://localhost:4321`.
- **Directory layout**:
  - `src/pages/`: Astro file-based routing (`/`, `/about`, `/projects`, `/blog`, `rss.xml.ts`).
  - `src/layouts/`: Base HTML skeletons and SEO layouts (`BaseLayout.astro`).
  - `src/components/ui/`: shadcn/ui primitives (`button.tsx`, `card.tsx`, `badge.tsx`, `separator.tsx`).
  - `src/components/`: Reusable domain components (`ProjectListItem.tsx`, `PostListItem.tsx`, `Header.astro`, `Footer.astro`, `MarkdownEnhancer.astro`, `InteractiveSpotlight.astro`).
  - `src/content/`: Content Collections (`blog/*.md`, `projects/*.md`, `about/*.md`).
  - `src/styles/`: Global CSS and Tailwind v4 theme definitions (`global.css`).

---

## Design System & Architecture Rules

### 1. Agent-First Linter (`@shadcn/lint`) Compliance
All React TSX components in `src/components/**/*.tsx` are strictly enforced by `@shadcn/lint`:
- **`no-restyle`**: Never override internal styles (e.g. padding, background, border radius) on design system components (`<Button>`, `<Card>`, `<Badge>`, etc.) from consumer components.
  - Allowed: Layout utilities specified in configuration (`margin`, `width`, `flex`, `grid`).
  - For styling variations: Define or use `cva` variants inside `src/components/ui/*.tsx`.
- **`no-raw-colors`**: Do not use hardcoded palette colors like `bg-zinc-100` or `text-slate-500`. Always use declared theme tokens (e.g. `bg-primary`, `bg-card`, `text-muted-foreground`, `border-border`).
- **`no-arbitrary-values`**: Do not use arbitrary Tailwind values (e.g. `p-[13px]`, `w-[320px]`). Stick to standard Tailwind scale tokens.
- **`no-inline-styles`**: Do not use inline `style={{ ... }}` props on components.

### 2. Astro Islands & Component Strategy
- Use `.astro` files for pages, page layouts, and static page containers (Zero-JS by default).
- Use `.tsx` for shadcn design system components and client-interactive widgets.
- Static `.tsx` components in Astro pages render as zero-JS static HTML by default. Add client directives (`client:load`, `client:idle`) only when client-side interactivity is necessary.

### 3. Theme Policy
- The site follows the operating system's theme preference (`prefers-color-scheme`).
- Do not introduce manual light/dark toggle buttons into the header unless explicitly instructed.

---

## Content Management Conventions

### Adding Projects
- Create a markdown file in `src/content/projects/<slug>.md`.
- Frontmatter must satisfy the schema in `src/content.config.ts`:
  ```yaml
  ---
  title: "Project Name"
  description: "One line summary of the project"
  pubDate: 2026-10-10
  thumbnail: "./thumbnail.png" # optional local image or URL
  githubUrl: "https://github.com/..." # optional URL
  demoUrl: "https://..." # optional URL
  ---
  ```

### Adding Blog Posts
- Create a markdown file in `src/content/blog/<slug>.md`.
- Frontmatter must satisfy the schema in `src/content.config.ts`:
  ```yaml
  ---
  title: "Post Title"
  description: "Brief summary of the article"
  pubDate: 2026-10-10
  thumbnail: "./thumbnail.png" # optional local image or URL
  draft: false
  ---
  ```

### Editing About Page
- Edit or create markdown file in `src/content/about/index.md`.
- Frontmatter schema in `src/content.config.ts`:
  ```yaml
  ---
  title: "About | Segyun"
  description: "소개 설명란"
  ---
  ```

---

## Testing & Verification Instructions
- **Lint check**:
  ```bash
  mise run lint
  # or: pnpm run lint
  ```
  Runs ESLint with `@shadcn/lint`. Must complete with 0 errors.
- **Build verification**:
  ```bash
  mise run build
  # or: pnpm run build
  ```
  Generates static HTML and assets in `dist/`. Must pass with 0 errors and no CSS bundle warnings.
- **Preview check**:
  ```bash
  mise run preview
  # or: pnpm run preview
  ```
  Serves the `dist/` directory locally to verify links, assets, and typography.
- Fix all lint and build issues before committing. Never leave broken build or lint states.

---

## PR & Commit Instructions
- **Commit message convention**: Follow Conventional Commits format:
  - `feat: <description>` (new feature, page, or component)
  - `fix: <description>` (bug fix or layout repair)
  - `docs: <description>` (documentation or blog post)
  - `style: <description>` (code styling or theme adjustments)
  - `refactor: <description>` (code restructuring without feature changes)
- **CI / Deployment**:
  - The repository automatically deploys to GitHub Pages via `.github/workflows/deploy.yml` upon push to `main`.
  - GitHub Actions runs `jdx/mise-action` -> `pnpm install --frozen-lockfile` -> `pnpm run lint` -> `pnpm run build` -> Pages deployment.
  - Always verify that `mise run lint` and `mise run build` pass locally before pushing to `main`.
