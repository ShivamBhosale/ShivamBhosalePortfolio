# Component Behavior Spec

Everything interactive in the portfolio. Build these correctly — they're what makes the site feel alive instead of static.

---

## 1. Theme toggle (light ↔ dark)

- Single button in the masthead, 32px circle with a sun/moon SVG icon.
- Default theme: light. Sun icon shows when light is active; moon icon when dark is active.
- On click: flip `[data-theme]` attribute on `<html>` between `"light"` and `"dark"`.
- Persist to `localStorage["theme"]`. On page load, read it before paint to avoid flash.
- Update the SVG icon to match the new state.
- All token vars (paper, ink, accent, rule) flip via CSS — no JS color manipulation needed beyond the attribute.

**Inline pre-paint snippet** to prevent FOUC (put in `<head>`):

```html
<script>
  try {
    const t = localStorage.getItem('theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
</script>
```

## 2. Live UTC clock + active nav highlight

- A `<span id="clock">` in the sub-nav and `<span id="clock2">` in the dashboard foot.
- Update both every 1000ms with `HH:MM:SS UTC` (zero-padded).
- On scroll: for each `section[id]`, if `window.scrollY >= section.offsetTop - 200`, mark that section's nav link active.

## 3. Personal Ops Dashboard

Four cells of static + light dynamic content:

- **Cells 1 & 2** — plain text values, no JS needed.
- **Cell 3 (commit mini-bars)** — render 12 `<i>` bars inside `.mini-bars`. Heights scaled from data `[4, 7, 5, 9, 12, 6, 14, 11, 16, 9, 13, 18]` against the max → CSS `height: Npx`. Last bar gets `.hot` class (accent color). Max bar height: 28px, min: 2px.
- **Cell 4 (donut)** — SVG donut, three arcs:
  - Arc 1 (Python, 42%): `stroke: var(--ink); stroke-dasharray: 42 100`
  - Arc 2 (AI, 28%): `stroke: var(--accent); stroke-dasharray: 28 100; stroke-dashoffset: -42`
  - Arc 3 (BI, 18%): `stroke: #6b6760; stroke-dasharray: 18 100; stroke-dashoffset: -70`
  - Background ring: `stroke: var(--rule)`. All arcs `r="15.9"`, `cx=cy=18`, `stroke-width="3.2"`, `transform="rotate(-90 18 18)"`.

## 4. Ticker stripe (marquee)

- Build the items array from `content.json#ticker`.
- Render each as `<span class="stripe-item"><b>${k}</b> <span class="delta ${cls}">${v}</span></span>`.
- **Render the array twice** — concat to itself so the loop is seamless.
- CSS animates `transform: translateX(0)` → `translateX(-50%)` over 60s linear infinite.

## 5. Reveal-on-scroll

- Add class `.reveal` to any element you want to fade in.
- IntersectionObserver with `{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }`.
- On intersect, add class `.in`. CSS handles the transition (opacity 0→1, translateY 14px→0, 800ms).

## 6. **Monte Carlo simulator** ⭐ (the centerpiece)

The whole reason this portfolio is memorable. **Do not skip or simplify.**

### Layout
- Container `#mc` sits in the Work section, right after the project table.
- Two-column body: 320px controls panel (left) + canvas chart (right). Stacks at ≤900px.
- Background: `--paper-2` with a subtle 40×40 px grid (`repeating-linear-gradient` both axes, `--rule-2`).

### Controls
- Three `<input type="range" min="0" max="100">` sliders with custom thumbs (14px accent circle).
- Slider values displayed in mono next to each, formatted as `(value/100).toFixed(2)` (e.g. `0.50`).
- Default values: `w1=50`, `w2=70`, `w3=35`.

### Stats panel (right side of controls, below sliders)
A 2-column grid of 6 stat rows. Each row: mono uppercase key (left) + serif value (right). Stats:
- `μ mean` · default `—`
- `σ stdev` · default `—`
- `p5` · default `—`
- `p95` · default `—`
- `trials` · default `0`
- `verdict` · default `—`, gets colored class once n ≥ 1000 (GO/LEAN GO = pos green, HOLD = muted, PASS = accent red).

### Chart
- A `<canvas>` rendered at devicePixelRatio for crisp rendering.
- Header above: mono labels — `HISTOGRAM · decision score (0—100)` + `n = NN`.
- Axis below: 6 tick labels `0 20 40 60 80 100` along the bottom edge.

### Engine

```js
const BINS = 40;
let hist = new Array(BINS).fill(0);
let count = 0, sum = 0, sumSq = 0;
let samples = [];

function randn() {  // Box-Muller normal
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function clip(v) { return Math.max(0, Math.min(100, v)); }

function runOnce() {
  const w1 = +els.w1.value / 100;
  const w2 = +els.w2.value / 100;
  const w3 = +els.w3.value / 100;
  const wSum = w1 + w2 + w3 || 1;

  // Salary ~ N(70, 12), Growth ~ N(60, 18), Risk-tolerant ~ N(50, 22)
  const s1 = clip(70 + randn() * 12);
  const s2 = clip(60 + randn() * 18);
  const rRaw = clip(50 + randn() * 22);
  // low risk-tolerance penalizes risky outcomes
  const s3 = w3 < 0.4 ? rRaw * 0.6 : rRaw;

  return clip((s1*w1 + s2*w2 + s3*w3) / wSum);
}
```

### Run loop

On RUN button click:
1. Reset all state (hist, count, sum, sumSq, samples).
2. Disable button. Status changes to `RUNNING · 0%`.
3. requestAnimationFrame loop, **250 trials per frame** (so 10,000 trials = ~40 frames ≈ 0.67s).
4. After each batch: update hist bin counts, redraw histogram, update stats panel.
5. When `remaining <= 0`: re-enable button, status `COMPLETE · 10,000 trials` (green).

### Drawing the histogram

Each frame:
- Clear canvas.
- Draw 4 soft gridlines (rule-2).
- Draw 40 bars, heights = `(hist[i] / max) * (h - 10)`.
- **Bars whose bin-center is within ±5 of the running mean get colored `--accent`. Everything else `--ink`.**
- Draw a vertical dashed accent line at `x = (mean/100) * width`, labeled `μ 56.4` above it (mono 11px).

### Theme reactivity

Add a MutationObserver on `<html>` for attribute changes to `data-theme` and `style`. On change → `drawHistogram()`. This ensures the chart re-colors instantly when the user toggles dark mode mid-simulation.

### Verdict logic

After `count >= 1000`:
```js
function pickVerdict(mean) {
  if (mean >= 65) return { txt: 'GO',      cls: 'go' };
  if (mean >= 50) return { txt: 'LEAN GO', cls: 'go' };
  if (mean >= 40) return { txt: 'HOLD',    cls: 'hold' };
  return                  { txt: 'PASS',   cls: 'no' };
}
```

## 7. Gantt timeline

Static positioning — no JS needed at render time, but the bars use CSS `left` / `right` / `width` percentages.

- Year ruler: 5 flex-1 ticks (`2022 2023 2024 2025 2026`).
- "NOW" line: positioned absolutely at `right: -1px`, 1px wide, accent color, with a small label `NOW` above it.
- Bars use these calculated percentages (based on a 2022→2026 = 0%→100% scale):
  - 2025–Present: `left: 64%; right: 0%` · style: `accent`
  - 2023–24: `left: 28%; width: 16%` · style: `ink`
  - 2022–24: `left: 4%; width: 40%` · style: `outline`
  - Continuous: `left: 0; right: 0` · style: dashed gradient

## 8. Tweaks panel (optional — only if you want Anthropic-style live editing)

A floating bottom-right panel (`#tweaks`, 280px wide), hidden by default. **Skip this if you're deploying the site standalone** — it's only useful in our internal preview environment.

If you DO build it: register `window.message` listeners for `__activate_edit_mode` / `__deactivate_edit_mode`, then `postMessage` `__edit_mode_available` to the parent. The panel contains one accent-color swatch row (5 hue swatches that update `--accent` via `oklch(L C H)`).

---

## What NOT to build

- ❌ A blog. Not asked for, would dilute focus.
- ❌ A "Now" page. The hero already does this work.
- ❌ Filtering / search on projects. Five projects don't need it.
- ❌ Animated text scrambles. The Monte Carlo is the only live animation.
- ❌ Cursor effects. Editorial doesn't need them.
- ❌ Skill bars with arbitrary percentages. Use the stacked bar (time allocation) instead.
