# Claude Code Prompt — Portfolio Build

**Paste everything below into Claude Code. Attach `Portfolio-reference.html` as a reference if you can.**

---

Build me a personal portfolio website. The full specification is in this `design/` folder — read every file before you start.

## Identity

- **Shivam Bhosale** — Data Analyst & AI Engineer
- Based in Toronto, ON, Canada (43.65°N, 79.38°W)
- Currently at MJR Capital Services
- Email: `shivambhosale909@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/shivambhosale`
- GitHub: `https://github.com/ShivamBhosale`

## What to build

A single static portfolio site:

- **Output:** `index.html` + `styles.css` + `script.js` at the repo root (vanilla — no framework, no build step).
- **Responsive:** mobile, tablet, desktop. Mobile breakpoint at 760px, intermediate at 1100px.
- **Deployable** straight to GitHub Pages / Cloudflare Pages / Netlify / Vercel as a static site.
- **Visually identical** to `Portfolio-reference.html` in this folder. Match it.

## How to use this folder

1. Read `01-design-spec.md` — the full section-by-section spec.
2. Use `02-design-tokens.json` (or `03-design-tokens.css`) as the single source of truth for colors, type, spacing.
3. Use `04-content.json` for all copy, project data, and metric numbers. Don't hardcode strings — read from this file (inline-import into the HTML, or fetch on load — your call).
4. Read `05-components.md` for interactive behavior (theme toggle, dashboard, Gantt, Monte Carlo simulator).
5. Reference `Portfolio-reference.html` to see the working result.

## Non-negotiables

- **Typography:** Instrument Serif (display, italics for accent words), Inter (body), JetBrains Mono (labels + numerics).
- **Palette:** off-white cream paper + ink black + ONE editorial accent (default amber `oklch(60% 0.14 65)`). Dark mode flips paper/ink and bumps accent lightness.
- **Theme toggle:** light/dark only. Persist to localStorage. No other theme variants.
- **Monte Carlo simulator must actually run.** It's not decorative — 3 sliders, a real Box-Muller normal RNG, 10,000 trials drawn bin-by-bin into a canvas histogram via requestAnimationFrame, live stats (μ, σ, p5, p95, verdict).
- **The Gantt timeline must be a real Gantt** — year ticks, "NOW" marker, positioned bars, not a decoration.
- **No emojis. No drop shadows. No gradients** outside the masthead accent dot. Editorial restraint.

## Hosting

After building, set up a `.gitignore` for `node_modules`, `.DS_Store`, etc. Commit. The repo is ready to push to a hosting provider.

---

If anything in the spec is unclear, **read the reference HTML** — it's the ground truth. The spec describes intent; the reference shows the result.
