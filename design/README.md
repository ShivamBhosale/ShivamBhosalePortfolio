# Portfolio — Claude Code Handoff Package

A complete design specification for a personal portfolio website. Hand this folder to Claude Code (or any developer) and they should be able to build the site without further guidance.

---

## Contents

| File | What it is |
|---|---|
| `README.md` | This file — overview + how to use |
| `00-claude-code-prompt.md` | **Start here.** The exact prompt to paste into Claude Code. |
| `01-design-spec.md` | Full section-by-section build spec |
| `02-design-tokens.json` | Machine-readable design tokens (color, type, spacing) |
| `03-design-tokens.css` | The same tokens as CSS custom properties — drop straight into a stylesheet |
| `04-content.json` | All copy, project data, metrics — keep this separate so it's easy to edit |
| `05-components.md` | Behavior spec for the interactive bits (theme toggle, dashboard, Gantt, Monte Carlo) |
| `Portfolio-reference.html` | A working reference implementation. Visually identical to the target. |

---

## How to use this

### Option A — Hand the whole folder to Claude Code

```
cd ~/your-new-portfolio-repo
# put this folder at the project root, then:
```

Open Claude Code and say:

> "Read everything in the `design/` folder, starting with `00-claude-code-prompt.md`. Build the site as described. Use the reference HTML as a visual ground-truth — match it. Output a clean static site at the repo root."

### Option B — Paste the prompt only

Open `00-claude-code-prompt.md`, copy its contents, paste into Claude Code. Attach `Portfolio-reference.html` as a file reference.

---

## What you're building

A personal portfolio for **Shivam Bhosale**, a Toronto-based Data Analyst & AI Engineer. The aesthetic is **"personal data brief"** — editorial newspaper meets Bloomberg terminal. Cream paper + ink + a single editorial accent color. Dark/light mode. Lots of grid lines, mono labels, indexed sections, and real data viz (sparklines, donut, Gantt timeline, stacked bar, live Monte Carlo simulator).

## Deploy

Static site — no build step. Drop into:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel (static mode)

All hosts will work because there's no framework.
