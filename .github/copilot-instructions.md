## Purpose
This file tells an AI code assistant how to be immediately productive in this repository.

## High-level view (what the repo is about)
- Event Planning Assistant with Budget Tracker — combines an LLM-based chatbot for recommendations, a budget-tracking + visualization module, and a React frontend.
- **Backend (Python/Flask):** Chatbot API with prompt templates for different event types (birthday, wedding, corporate). Integrates with LLM services.
- **Frontend (React/TypeScript):** Modern Vite + Tailwind UI with chatbot and budget tracker sections.
- **Budget Module:** Models, expense tracking, and chart visualization.
- Refer to `README.md` as the authoritative project statement.

## What the AI assistant should do first
1. Review the project structure. Code is organized as:
   - `chatbot/` — LLM prompts, chatbot flow, LLM service integration
   - `budget/` — expense models, expense tracking, chart generation
   - `frontend/ai-event-genie/` — React/TypeScript UI (Vite, Tailwind, shadcn/ui components)
   - `app.py` — Flask API entry point
   - `ui-old/` — legacy/previous UI attempts (reference only)

2. When assigned a task:
   - Check existing files (don't duplicate prompts or models).
   - Update or extend existing modules rather than creating parallel implementations.
   - Keep code DRY: reuse `chatbot.prompts` for prompt templates, `budget.models` for expense structures.
   - Test changes locally before suggesting PR merge.

3. For both new features and bug fixes:
   - Ensure changes align with the existing stack (Python for backend logic, React/TS for frontend).
   - Document changes in module READMEs or docstrings if they're non-obvious.
   - Run available tests (`frontend/ai-event-genie/` has vitest config for unit tests).

## Project-specific cues & examples
- **Chatbot prompts:** See `chatbot/prompts.py` for existing templates (BIRTHDAY_PROMPT, WEDDING_PROMPT, CORPORATE_PROMPT). Before adding more, understand the format and ensure they follow the same structure.
- **LLM integration:** `chatbot/llm_service.py` handles the LLM API calls. Check this before integrating new LLM providers.
- **Budget models:** `budget/budget_model.py`, `budget/expenses.py` contain the expense model. When tracking and visualizing, use these models.
- **Chart generation:** `budget/charts.py` handles visualization. Extend it if adding new chart types (bar, pie, line, etc.).
- **Frontend API calls:** `frontend/ai-event-genie/src/services/api.ts` is the HTTP client. Ensure all backend endpoints are called through this file, not directly from components.
- **UI components:** The frontend uses shadcn/ui components located in `frontend/ai-event-genie/src/components/ui/`. Import from there, don't create duplicates.

## Coding and commit conventions for this repo
- No existing conventions were found. Use these defaults until the team specifies otherwise:
  - Branches: `feature/<short-description>`, `fix/<short-desc>`
  - Commits: imperative, short header and optional body (e.g., "add initial scaffold for chatbot and budget modules")
  - PR description: One-line summary, what changed, how to test locally, any open questions for reviewers.

## Build / test / debug notes (discoverable facts)
- **Backend:** Python/Flask. Dependencies in `requirements.txt`. Run with `python app.py`.
- **Frontend:** Node.js/npm-based. Located in `frontend/ai-event-genie/`. Install with `npm install` or `bun install` (bun.lockb present). Run dev server with `npm run dev`. Tests with vitest: `npm run test`.
- **Environment setup:** See `requirements.txt` for backend dependencies (flask, flask-cors, and any LLM SDKs). Frontend uses Vite, Tailwind, shadcn/ui.
- **Current dependencies:**
  - Backend: flask, flask-cors (+ LLM provider SDK — check `llm_service.py` for specifics)
  - Frontend: vite, react, typescript, tailwind, shadcn/ui

## What good pull requests look like here
- **Focused scope:** One feature, one bug fix, or one refactoring per PR. Do not mix unrelated changes.
- **Testing:** Include a manual test case or automated test (Python/pytest for backend, vitest for frontend). Show evidence the feature works.
- **Documentation:** If adding a new chatbot event type or budget category, update the in-code docstring or comments. If the change is non-obvious, add a brief note in the PR description (e.g., "Added corporate event template following the same pattern as birthday/wedding templates in prompts.py").
- **Code style:** Follow existing patterns in the codebase. Use type hints in Python, ensure TypeScript strict mode compliance in React components.
- **Commit message:** Imperative tense, short header, optional body explaining *why* (not just what). Example: "Add corporate event prompt template" or "Fix LLM service timeout handling with retry logic".

## Integration & external dependencies
- The README mentions LLMs and cloud hosting, but no provider is pinned. When you add integrations, document the provider and SDK used (OpenAI, Anthropic, AWS, GCP, etc.) and centralize credentials access patterns (do not hardcode secrets).

## When to ask the human maintainers
- If you need to choose a language, framework, or cloud provider. The README lists candidate technologies but does not commit to any.
- If you plan to add production-grade infra (CI/CD, secrets), ask about security and deployment policies.

## Quick actionable tasks for the next iteration
1. **Integrate a real LLM provider:** Choose OpenAI, Anthropic, or another provider. Update `chatbot/llm_service.py` to call the chosen API. Document credentials/environment setup in a `.env.example` file.
2. **Add expense persistence:** Extend `budget/expenses.py` to save/load expenses from a simple CSV or JSON file (or connect to a database). Create a `/expenses` endpoint in `app.py`.
3. **Connect frontend to budget endpoints:** Update `frontend/ai-event-genie/src/services/api.ts` to call the budget API endpoints and wire the BudgetTrackerSection component to display real data.
4. **Add unit tests:** Write pytest tests for `chatbot/chatbot.py` and `budget/budget_model.py`. Add vitest tests for key React components (BudgetTrackerSection, ChatbotSection).
5. **Error handling & validation:** Add try-catch blocks and meaningful error messages in both backend and frontend.
6. **Deployment script:** Create a simple deployment guide or `docker-compose.yml` / Procfile for cloud hosting (Heroku, AWS, GCP, etc.).

## Files to reference
- `README.md` — project intent and planned components (single authoritative doc present in repo)

---
If anything here is unclear or you want this guidance tuned to a specific language or cloud provider, say which one and I will update the instructions accordingly.
