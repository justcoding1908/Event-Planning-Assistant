## Purpose
This file tells an AI code assistant how to be immediately productive in this repository.

## High-level view (what the repo is about)
- The repository currently contains only `README.md`. The README describes a planned "Event Planning Assistant with Budget Tracker" built from three major concerns: an LLM-based chatbot (recommendations), a budget-tracking + visualization module, and a cloud-hosted UI/infra layer.
- There are no source files, CI, or build scripts present yet. Use the README as the single source of project intent.

## What the AI assistant should do first
1. Preserve the existing `README.md` content as the project statement of intent.
2. Create a minimal, well-documented scaffold so humans can review and iterate. Suggested top-level layout:
   - `src/chatbot/` — code that wraps LLM prompts, prompt templates, and conversation flow
   - `src/budget/` — expense models, persistence adapters (CSV/JSON/DB), and visualization glue
   - `src/ui/` — simple frontend skeleton (React/Vue/Flask templates depending on chosen stack)
   - `prompts/` — canonical prompt templates and examples (one file per scenario)
   - `infra/` — IaC/provisioning notes or deployment manifests
   - `tests/` — minimal unit tests for each module
   Add a short README in each folder describing the intended responsibilities.

## Project-specific cues & examples
- Use the README's planned technologies as the design contract. For example, implement a `src/chatbot/prompt_templates.md` that contains templates for "venue suggestions", "timeline planning", and "menu recommendations" matching the README's examples.
- When creating a budget model, mirror the README's categories (event expenses, categories for venue/menu/etc.). Put the domain model in `src/budget/models.py` (or equivalent) and a small CSV importer `src/budget/importer.py`.
- Keep prompts isolated in `prompts/` and refer to them from code; do not inline long prompt text in business logic.

## Coding and commit conventions for this repo
- No existing conventions were found. Use these defaults until the team specifies otherwise:
  - Branches: `feature/<short-description>`, `fix/<short-desc>`
  - Commits: imperative, short header and optional body (e.g., "add initial scaffold for chatbot and budget modules")
  - PR description: One-line summary, what changed, how to test locally, any open questions for reviewers.

## Build / test / debug notes (discoverable facts)
- There are currently no build scripts, package manifests, or test runners in the repo. Before adding language-specific tooling, confirm with the maintainers which stack they prefer. If not specified, create minimal, language-idiomatic manifests (e.g., `package.json` for JS/React, `requirements.txt`/`pyproject.toml` for Python).

## What good pull requests look like here
- Small, focused changes that include:
  - A short README under the modified/created folder describing intent
  - One small example or smoke test proving the component runs (a simple script or test)
  - If adding prompts, include an example prompt file under `prompts/` and a small test that runs the prompt against a mock LLM

## Integration & external dependencies
- The README mentions LLMs and cloud hosting, but no provider is pinned. When you add integrations, document the provider and SDK used (OpenAI, Anthropic, AWS, GCP, etc.) and centralize credentials access patterns (do not hardcode secrets).

## When to ask the human maintainers
- If you need to choose a language, framework, or cloud provider. The README lists candidate technologies but does not commit to any.
- If you plan to add production-grade infra (CI/CD, secrets), ask about security and deployment policies.

## Quick actionable tasks for the next iteration
1. Add the repository scaffold described above with READMEs for each folder.
2. Add `prompts/` with 3 initial prompt templates derived from the README's examples (venue, timeline, budget suggestion).
3. Add a minimal smoke test for one module (e.g., a prompt render + mock LLM response).

## Files to reference
- `README.md` — project intent and planned components (single authoritative doc present in repo)

---
If anything here is unclear or you want this guidance tuned to a specific language or cloud provider, say which one and I will update the instructions accordingly.
