# Design Spec — Portfolio

A single-page portfolio site styled as a **"personal data brief"** — editorial newspaper meets Bloomberg terminal. Cream paper, ink black, a single editorial accent. Heavy use of rules, mono labels, indexed sections, and real data viz.

Page order (top to bottom):

1. Masthead
2. Sub-nav bar
3. Hero (with personal-stats dashboard)
4. Ticker stripe
5. Work (project table + Monte Carlo demo)
6. Experience (Gantt + detail cards)
7. Capabilities (stacked bar + 8 detail cards)
8. Pull-quote
9. Contact
10. Footer

All content/copy is in `04-content.json`. All tokens are in `02-design-tokens.json` and `03-design-tokens.css`.

---

## 1. Masthead

Sticky header at the top. Three columns: `auto 1fr auto`.

- **Left** — `Shivam Bhosale` in Instrument Serif 22px, with a small 8px accent-colored dot before the name. Links to `#top`. **Must be `white-space: nowrap`** — never wraps.
- **Middle** — mono meta strip (uppercase 10.5px, letter-spacing .08em). Items separated by gap: `VOL. 03  ED. 2026  TORONTO · ON  STATUS · OPEN`. The status word "OPEN" is colored with `--pos` (green). **Hide this strip at ≤1100px.**
- **Right** — circular theme toggle (32px, sun ↔ moon SVG icon) + a "Contact ↗" pill button (`.cta` style).

Bottom border: `1px solid var(--rule)`. Background: `var(--paper)` with `backdrop-filter: blur(8px)`. Z-index 50.

## 2. Sub-nav bar

Below the masthead. Mono uppercase 11px links separated by `/` characters.

Links: `00 Brief`, `01 Work`, `02 Experience`, `03 Stack`, `04 Contact`. The index number is colored `--muted-2` (lighter) by default; active link gets accent-colored index.

On the right: live **UTC clock** updating every second + `LAT 43.65°N  LON 79.38°W` static.

Bottom border: `1px solid var(--rule)`. On scroll, the link matching the current section gets `.active` (color: ink, index goes accent).

## 3. Hero

Padding: `64px 0 80px`. Two-column grid (`1.35fr 1fr`), aligned to end. **Stacks to one column at ≤1100px.**

### Left column

1. **Eyebrow** — mono uppercase 11px, gap-separated: pulsing green pip · "Data Analyst · AI Engineer" · separator · "3+ YRS BUILDING"
2. **Headline** — Instrument Serif, `clamp(54px, 8.8vw, 132px)`, line-height .92, three lines:
   - "Turning *raw data*"
   - "into *decisions*,"
   - "decisions into *systems*↗"

   Italic words are wrapped in `<em>` and colored with `--accent`. The arrow uses `.arr` class with `transform: translateY(.04em)`.

3. **Description** — Inter 16px, max-width 580px, color `--ink-2`. Three full sentences about end-to-end stack + current role. Bold key terms (SQL, Python, Power BI, etc.) using `<strong>`.

4. **Pull-quote** — Instrument Serif italic 17px, padded-left 14px, `border-left: 2px solid var(--accent)`. Text: `"Good decisions start with clean data."`

### Right column — Personal Ops Dashboard

A bordered card titled "SB / OPS REPORT · personal analytics" with a "LIVE" indicator (pulsing dot).

2×2 grid of cells (each: 18px 16px padding, min-height 116px). Cells:

1. **Experience** — value `3+ YRS` (Instrument Serif 38px), sub: "Since Sep 2022 · grad school onward"
2. **Public Repos** — value `124`, sub: "▲ 18 last 90 days" (▲ in `--pos`)
3. **Commit Activity · 12 wks** — a flex row of 12 mini bars (data: `[4, 7, 5, 9, 12, 6, 14, 11, 16, 9, 13, 18]`). Last bar gets `.hot` class (accent color). Bars are 28px max-height, scaled proportionally.
4. **Stack Mix** — a 56px SVG donut with 4 arcs: 42% ink, 28% accent, 18% muted, remainder transparent. Sub: "Python 42% · AI 28% · BI 18%"

Foot strip: 3 cells separated by vertical rules — `MODELS · shipped`, `CCY · CAD`, `UTC · [live clock]`.

## 4. Ticker stripe

Full-width strip between hero and Work. Background `--paper-2`, top/bottom borders.

Marquee animation (60s loop) of stat pills. Each pill: mono 11px uppercase, `<b>` key + colored value. Items include:
- `PYTHON 42%` (pos)
- `SQL +9%` (pos)
- `CLAUDE API live` (pos)
- `REPOS 124`
- `MODELS / PROD 4` (pos)
- `AAFC 95%` (pos)
- `DASHBOARDS · MJR ∞`
- `STONKS.CA shipped` (pos)
- `HONEY BADGER local`
- `RAG · FAISS on` (pos)
- `LODESTAR WIP` (neg / accent)
- `LOCATION TORONTO · ON`
- `STATUS OPEN` (pos)

Duplicate the array to make the loop seamless.

## 5. Work section

Standard section head: `SECTION · 01 / 04` · serif title `Selected work.` (italic accent on "work") · meta `Indexed · 5 projects · 2023–26`.

Below: **project table** — list of 5 rows. Each row is a 5-column grid: `56px 1.3fr 1.4fr 220px 90px` (index, main, description, stats, arrow).

On hover: row gets `--paper-2` background + 12px left padding shift; arrow translates up-right and turns accent.

### Project rows (in order)

1. **PRJ-01 Lodestar** (featured) — Decision Engineering. Tags: AHP, TOPSIS, Monte Carlo, Python. Stats: Methods 3 / Status WIP / Simulations 10k+ / Live demo ↓. **Arrow is ↓ not ↗** and href is `#mc` (jumps to Monte Carlo demo below).
2. **PRJ-02 Stonks.ca** — Financial Data · CLI. Tags: Python, yfinance, Pandas, Rich. Stats: Tickers/run 20+ / Signal rules 10 / API key none / Export CSV.
3. **PRJ-03 Honey Badger AI** — GenAI · Reliability. Tags: GenAI, Ollama, Streamlit, Local. Stats: Stages 6 / Inference local / Cost/query $0.00 / Guardrails ✓.
4. **PRJ-04 Bloomberg Replica** — LLM · Market Intel. Tags: Claude API, Yahoo Finance, ECB FX, Python. Stats: Subscription $0 / Sources 3+ / Daily brief auto / Tool-use ✓.
5. **PRJ-05 Agri-Optima** — Deep Learning · CV. Tags: TensorFlow, Keras, Django, CNN. Stats: Images 35k / Accuracy 95% / Δ baseline +15% / Partner AAFC.

### Monte Carlo demo (`#mc`)

Sits right after the project table inside the same Work section. See `05-components.md` for full behavior. Visually: a bordered card with a subtle 40×40 grid background, accent "LIVE · INTERACTIVE" tag, serif title `Run a *Monte Carlo*. Right now.`, descriptive paragraph, and a big black "▶ RUN 10 000 TRIALS" button. Body splits into a 320px left controls panel and a right canvas chart.

## 6. Experience

Section head: `02 / 04` · title `Career timeline.` · meta `Range · 2022 — present`.

### Gantt timeline

- Axis row: left column "Role / Organization" label, right is the year ruler (5 ticks: 2022–2026) with a vertical accent line marking "NOW" at the right edge, labeled `NOW` in mono 9px above.
- 4 bar rows:
  1. **MJR Capital · 2025–Present** — accent solid bar, positioned `left: 64%; right: 0%`.
  2. **U. Windsor × AAFC · 2023–24** — ink solid bar, `left: 28%; width: 16%`.
  3. **M.Applied Computing · 2022–24** — outline (transparent fill, ink border), `left: 4%; width: 40%`.
  4. **Open-source · continuous** — accent dashed-pattern bar spanning full width: `background: repeating-linear-gradient(90deg, var(--accent) 0 4px, transparent 4px 7px)`.

### Detail summary cards

Two 3-column cards (`200px 1fr 1fr`) for MJR and Windsor. Each: date column on left, role + paragraph in middle, 2×2 metric grid on right.

**MJR metrics:** Reporting time −40% (accent), ML models PROD, Pipelines ETL, Stack AWS.
**Windsor metrics:** Accuracy 95% (accent), Δ baseline +15%, Images 35k, Deploy Django.

## 7. Capabilities

Section head: `03 / 04` · title `Where the hours go.` · meta `Self-reported · past 12 months`.

### Stacked bar

A 56px-tall horizontal stacked bar showing time allocation. Five segments with flex weights, colored in this exact order:
- s1 (ink) — `Analytics & SQL 32%`
- s2 (#3a3a3a) — `ML & Deep Learning 24%`
- s3 (accent) — `LLMs / Agentic AI 20%`
- s4 (#6b6760) — `BI & Reporting 14%`
- s5 (#95918a) — `Infra · Cloud 10%`

Each segment shows its name (left) and `%` (right, opacity .7). Below the bar: 5-cell legend with colored dots, mono label `A · 32%` etc, serif domain name.

### Capability cards

8 cards in a 4×2 grid (1px gap, ink-rule between). Each card: serif name + mono index, dashed-bottom header, then bullet list (4–5 items). First 2 items are `.lead` (ink color, accent square bullet, slightly heavier).

Cards in order:
1. **Analytics & SQL** (A.01) — Pandas/NumPy *, SQL advanced *, PySpark, EDA, R
2. **ML & Deep Learning** (B.02) — Scikit-learn *, TF/PyTorch/Keras *, CNNs, Hyperparameter tuning, Eval metrics
3. **LLMs & Agentic AI** (C.03) — Claude/OpenAI/Gemini *, RAG/FAISS/LangChain *, LangGraph/CrewAI, MCP/A2A, Ollama
4. **BI & Reporting** (D.04) — Power BI/DAX *, Dashboards *, Power Automate, Tableau, Excel
5. **Databases** (E.05) — Postgres/SQL Server *, MySQL, MongoDB, Optimization, Schema
6. **Cloud & MLOps** (F.06) — AWS S3/EC2 *, Docker/CI-CD *, Azure/GCP, Lifecycle, Pipelines
7. **AI App Dev** (G.07) — Django/FastAPI/Flask *, Inference endpoints *, Streamlit, REST, RBAC
8. **Currently exploring** (H.08) — Multi-agent orchestration *, Long-context RAG / eval harnesses *, dbt, Decision engineering, LLM-as-judge

(Items marked `*` get the `.lead` class.)

## 8. Pull-quote

Background `--paper-2`, full-width section.

3-column grid: huge italic accent `"` mark (Instrument Serif 96px) — quote (clamp 28–44px) — attribution.

Text: `Good *decisions* start with clean *data*.` (italic words in accent.)
Attribution: `Personal axiom · SB · 2026`

## 9. Contact

Section head: `04 / 04` · title `Get in touch.` · meta `Reply time · same day`.

Huge serif headline (clamp 46–96px):
> Hiring an analyst who thinks like an *engineer*? Let's talk.

Below: 4-column grid of channel cells (1px ink-rule gaps, border):
- **CH-01 · Email** → `shivambhosale909@gmail.com` · sub "primary · always read"
- **CH-02 · LinkedIn** → `/in/shivambhosale` · sub "recruiter DMs open"
- **CH-03 · GitHub** → `@ShivamBhosale` · sub "124 public repos"
- **CH-04 · Location** → `Toronto, Ontario, CA` · sub "hybrid · remote"

Each cell hover: background `--paper-2`.

## 10. Footer

Single mono line: `© 2026 Shivam Bhosale · All data self-reported`. Border-top, padding 24px 0.

---

## Responsive breakpoints

- **≤1100px** — masthead meta hides, sub-nav becomes horizontally scrollable, hero stacks (1 col), capabilities go 2×4, project rows compact to 4 columns.
- **≤900px** — Monte Carlo body stacks (controls above chart).
- **≤760px** — section heads stack, Gantt rows stack (label above bar), pull-quote stacks, contact goes 2×2, capabilities 1-col, stacked bar becomes vertical, hero headline shrinks (clamp 40–72px).

---

## Aesthetic principles (don't violate these)

- **No emoji.** Use SVG glyphs or unicode arrows (↗ ↘ ↓ ↑ ◆ ◇) only.
- **No drop shadows.** The masthead doesn't even cast one. The Tweaks panel is the one exception (small subtle shadow).
- **No gradients** other than: the masthead accent dot, the experience timeline track (`repeating-linear-gradient` for the continuous bar), and the paper grain SVG noise.
- **Rules, not boxes.** Use 1px hairlines (`--rule`) for separation. Most "cards" are actually grids of cells separated by 1px gaps with a single outer border.
- **Mono for data, serif for identity, sans for argument.** Numbers and labels in JetBrains Mono. Names and titles in Instrument Serif. Reading prose in Inter.
- **Italic is the accent device.** Words in `<em>` get the accent color and italic style. Use sparingly — only "load-bearing" words.
- **Paper grain matters.** The subtle SVG noise overlay is non-negotiable in light mode. It softens the digital feel.
