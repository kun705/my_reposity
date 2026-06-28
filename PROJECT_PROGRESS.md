# Project Progress

## 2026-06-28 - portfolio repackaging v1

### Completed

- Created a standalone project copy at `D:\job-hunting\retail-insight-agent`.
- Renamed the portfolio-facing project from `shopkeeper-agent` to `RetailInsight Agent`.
- Rewrote the root `README.md` from a tutorial-style document into a portfolio-style project brief.
- Updated backend and frontend package metadata.
- Updated frontend display text and browser title.
- Renamed README display image files from `shopkeeper-agent-*` to `retail-insight-*`.
- Replaced default Docker container names with `retail_*` names to reduce local conflicts.
- Replaced demo MySQL user from `didilili` to `retail_user` in Docker and app configuration.
- Added frontend static demo mode for GitHub Pages or other static hosting.
- Added GitHub Actions workflow to deploy the frontend demo to GitHub Pages.
- Verified the frontend production build with `npm run build`.
- Pushed the project to `https://github.com/kun705/my_reposity`.
- Enabled GitHub Pages in workflow mode.
- Verified the live Pages demo at `https://kun705.github.io/my_reposity/`.
- Kept the original MIT license and added source attribution in the README.

### Modified Files

- `README.md`
- `PROJECT_PROGRESS.md`
- `pyproject.toml`
- `uv.lock`
- `conf/app_config.yaml`
- `docker/docker-compose.yaml`
- `docker/mysql/dw.sql`
- `docker/mysql/meta.sql`
- `frontend/README.md`
- `frontend/package.json`
- `frontend/index.html`
- `frontend/src/App.tsx`
- `frontend/src/components/EmptyState.tsx`
- `frontend/src/components/StepRail.tsx`
- `frontend/src/lib/agentApi.ts`
- `frontend/src/lib/demoAgent.ts`
- `frontend/vite.config.ts`
- `frontend/.env.example`
- `frontend/pnpm-workspace.yaml`
- `.github/workflows/deploy-pages.yml`
- `docs/images/retail-insight-home.jpg`
- `docs/images/retail-insight-query-result.jpg`
- `docs/images/retail-insight-system-architecture.svg`

### Generated Outputs

- New standalone repository-ready directory: `D:\job-hunting\retail-insight-agent`
- New progress tracking file: `PROJECT_PROGRESS.md`
- Local frontend build output: `frontend/dist` (generated for verification; ignored by Git)

### Reproducibility

- Source copy: `D:\job-hunting\Agent_project\E_commerce_Data_Request\项目代码\shopkeeper-agent-main`
- Destination copy: `D:\job-hunting\retail-insight-agent`
- Main packaging actions: project metadata rename, README rewrite, frontend display rename, Docker/MySQL default user rename.
- Date: 2026-06-28

### GitHub Readiness Notes

- Do not commit `.env`.
- Do not commit `docker/embedding/`; it is already ignored by `.gitignore`.
- Keep `LICENSE` because the upstream project is MIT licensed.
- Use README wording that presents this as a personal learning and portfolio adaptation, not as an undisclosed original-from-scratch project.

### TODO

- Run backend dependency sync and static checks after local Python/uv environment is ready.
- Run frontend install/build after Node/pnpm environment is ready.
- Add personal enhancement commits beyond packaging, such as SQL safety guard, evaluation cases, result charting, or multi-turn query refinement.
- Add screenshots from a successful local run.
- Initialize a clean Git repository and push to the user's GitHub repository.
- Consider renaming the GitHub repository from `my_reposity` to `retail-insight-agent` for a more professional portfolio URL.

### Risks

- Current work is packaging and naming only; core business logic is still inherited from the upstream project.
- The project depends on Docker services, a local embedding model, and an external LLM API key.
- The SQL correction path currently corrects once and then executes; it does not loop through repeated validation.
