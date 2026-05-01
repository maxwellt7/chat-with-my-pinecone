# Advertorial Production Pipeline

Automated end-to-end pipeline that takes a markdown copy brief + a reference URL and produces a fully-designed, image-populated advertorial HTML page deployed live to Vercel.

## What It Does

1. **Design Forensics** — Scrapes the reference URL and extracts its complete design system (colors, typography, spacing, components, section structure) using Claude.
2. **Copy Mapping** — Parses your markdown brief and maps every content block to the reference page's sections. Identifies all image placement needs.
3. **HTML Generation** — Claude generates a complete single-file HTML page using Tailwind CDN that replicates the reference design with your copy. Image slots are left as `GENERATE:` placeholders.
4. **Image Prompt Generation** — Claude writes a precise, brand-matched image generation prompt for every photo slot. Inline SVG is generated directly for icon/badge slots.
5. **Image Generation** — Calls Google Imagen 4 for each photo slot (with Nano Banana Pro as fallback). Saves all images to `advertorial_images/`.
6. **Assembly** — Replaces all `GENERATE:` placeholders with the generated image paths and inline SVGs.
7. **Deployment** — Deploys the assembled page to Vercel via CLI and returns the live URL.

Every step is resumable — re-running the same command picks up from where it left off.

## Requirements

- Node.js 20+
- Vercel CLI installed globally and authenticated (`vercel whoami` should work)
- `ANTHROPIC_API_KEY` — for Claude (design analysis, copy mapping, HTML generation, image prompts)
- `GEMINI_API_KEY` — for Google Imagen image generation

No npm packages are installed in this project. Only Node.js built-ins are used.

## Setup

```bash
# Set your API keys (add these to your shell profile or .env)
export ANTHROPIC_API_KEY=sk-ant-...
export GEMINI_API_KEY=AIza...

# Verify Vercel is authenticated
vercel whoami
```

## Usage

```bash
node run.js --copy <path-to-brief.md> --reference <url>
```

**Example:**
```bash
node run.js --copy test-brief.md --reference https://example.com/some-advertorial
```

**Flags:**
| Flag | Description |
|---|---|
| `--copy` | Path to your markdown copy brief |
| `--reference` | URL of the advertorial/landing page to replicate the design of |
| `--force` | Ignore all cached state and re-run all 7 steps from scratch |

## The Copy Brief Format

Write your brief as a standard markdown file. Include:

- Headlines (`#`, `##`, `###`)
- Body paragraphs
- Bullet lists for ingredients, benefits, etc.
- Testimonials with author attribution
- CTA button text in brackets: `[Order Now — 50% Off]`
- Legal disclaimer in italics at the bottom

See `test-brief.md` for a complete example.

## Output

Each run creates a deterministic output directory based on a hash of your inputs:

```
output/<run-id>/
├── state.json              # Pipeline progress — used for resume
├── design-spec.json        # Extracted design tokens from reference URL
├── copy-map.json           # Content mapped to design sections
├── advertorial.html        # Final assembled page (also served as index.html)
├── image-prompts.json      # Generated prompts for each image slot
└── advertorial_images/
    ├── hero-image.jpg
    ├── testimonial-photo.jpg
    └── ...
```

The same inputs always produce the same run ID, so re-running the same brief + reference URL automatically resumes the existing run rather than starting over.

## Resume Behavior

The pipeline saves progress after each step. If a run is interrupted (e.g., during image generation), just re-run the same command:

```bash
# Will skip steps 1-4 and resume from step 5
node run.js --copy test-brief.md --reference https://example.com/advertorial
```

To force a full re-run:
```bash
node run.js --copy test-brief.md --reference https://example.com/advertorial --force
```

## Console Output

A successful run looks like:

```
🚀 Advertorial Pipeline
   Run ID:     a3f2b19c
   Output dir: /path/to/output/a3f2b19c
   Reference:  https://example.com/advertorial

  [1] Design forensics: fetching reference URL...
  [1] Design forensics: analyzing with Claude...
  [1] Design forensics: done ✓
  [2] Copy mapping: analyzing with Claude...
  [2] Copy mapping: done ✓
  [3] HTML generation: generating with Claude (this may take 60s)...
  [3] HTML generation: done ✓
  [4] Image prompts: generating with Claude...
  [4] Image prompts: done ✓
  [5] Image generation: 3 photo slots to generate...
    Generating hero-image (16:9)...
    Generating testimonial-photo (1:1)...
    ...
  [5] Image generation: 3/3 succeeded ✓
  [6] Assembly: replacing image placeholders...
  [6] Assembly: done ✓
  [7] Deployment: preparing Vercel project...
  [7] Deployment: deploying to Vercel (vercel --yes)...
  [7] Deployment: live at https://advertorial-a3f2b19c.vercel.app ✓

✅ Done!
   Live URL: https://advertorial-a3f2b19c.vercel.app
   Output:   /path/to/output/a3f2b19c
```

## Project Structure

```
├── run.js                       # CLI entry point + 7-step orchestrator
├── lib/
│   ├── claude.js                # Anthropic API wrapper (raw fetch)
│   ├── imagen.js                # Google Imagen API wrapper (primary + fallback)
│   ├── scraper.js               # URL fetcher with UA spoofing + HTML truncation
│   └── state.js                 # Pipeline state persistence (state.json)
├── steps/
│   ├── 01-design-forensics.js
│   ├── 02-copy-mapping.js
│   ├── 03-html-generation.js
│   ├── 04-image-prompts.js
│   ├── 05-image-generation.js
│   ├── 06-assembly.js
│   └── 07-deployment.js
├── tests/                       # Node built-in test runner (node:test)
│   ├── lib/
│   └── steps/
├── test-brief.md                # Example copy brief
└── output/                      # Generated output (git-ignored)
```

## Running Tests

```bash
node --test tests/lib/state.test.js tests/lib/claude.test.js tests/lib/scraper.test.js tests/lib/imagen.test.js tests/steps/01-design-forensics.test.js tests/steps/02-copy-mapping.test.js tests/steps/03-html-generation.test.js tests/steps/04-image-prompts.test.js tests/steps/05-image-generation.test.js tests/steps/06-assembly.test.js tests/steps/07-deployment.test.js
```

All tests use `node:test` and `node:assert` — no test framework required.

## Troubleshooting

**Reference URL returns 403 or times out**
Some sites block scrapers. The pipeline will exit with a clear error. Try a different page on the same domain, or check if the site requires JavaScript rendering.

**Image generation fails for some slots**
Imagen 4 has rate limits. Failed slots are logged with a warning and the `GENERATE:slot-id` placeholder remains in the HTML source. Re-run the command — it will skip all previously generated images and only retry the failed ones.

**Vercel deploy prompts for input**
Make sure `vercel whoami` works before running the pipeline. The deploy step injects a `vercel.json` with a project name to suppress interactive prompts.

**Step 3 HTML generation takes a long time**
Claude is generating a full production HTML file (up to 16,000 output tokens). Typical time is 30–90 seconds. This is normal.
