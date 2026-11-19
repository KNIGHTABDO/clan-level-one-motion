# Clan Level One (كلان لفل ون) — Official Motion Graphics Video Suite

> **"نفس الاسماء .. بس الهدف أكبر ☝🏼🧡"**  
> **Official Foundation Milestone: April 22, 2026** // [#StayOne ☝️](https://x.com/level_one/status/2047027920430846446)

This repository contains the complete motion graphics production codebase, creative direction, and dual rendering engines for **Clan Level One**:

1. **HyperFrames Engine (`/hyperframes`):**
   - High-performance, agent-native HTML5 + CSS + GSAP 3 animation pipeline.
   - Deterministic 60 fps rendering via headless browser and FFmpeg.
   - Synchronized with *21 Savage — redrum* acoustic architecture.

2. **Remotion Engine (`/remotion`):**
   - React + TypeScript componentized architecture.
   - Custom spring physics (`LevelOneLogo`, `LevelOneTelemetry`, `LevelOneStayOne`, `LevelOneBackground`).
   - Cloud Matrix 20-worker parallel rendering workflow (`.github/workflows/remotion-render.yml`).

3. **Master Creative & Lore Documentation (`/docs`):**
   - [`docs/level_one_direction.md`](docs/level_one_direction.md): Master Creative Direction & Anti-Slop Bible.
   - [`docs/clan_level_one_dossier.md`](docs/clan_level_one_dossier.md): Clan history, April 2026 founding, 46-member roster, Riyadh Villa lore.
   - [`docs/music_selection.md`](docs/music_selection.md): Soundtrack analysis and acoustic cues.

---

## Cloud Rendering on GitHub Actions

Both engines render remotely via GitHub Actions:

- **HyperFrames Pipeline:** Triggered automatically on push or via `workflow_dispatch` in [Actions](../../actions/workflows/hyperframes-render.yml). Produces `clan_level_one_hyperframes.mp4` with verification snapshots.
- **Remotion Matrix Pipeline:** Splits the composition across 20 concurrent cloud runners, then stitches the chunks and muxes the master audio into `clan_level_one_remotion_master.mp4`.
