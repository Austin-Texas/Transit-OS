# Transit-OS on app-host-01 — TPMCS deployment pattern

## Status: infrastructure scaffold, NOT a proven functional release
Source deployment reference: `Austin-Texas/tpmcs-website/.github/workflows/tpmcs-deploy.yml`, `tpmcs-validate.yml`, `Dockerfile`, `README.md`, `AGENTS.md`.

The project remains a Base44/TanStack Start (React 19) application. Dockerizing its Cloudflare/workerd-oriented Vite build does **not** remove Base44 dependencies. Existing sign-in, protected routes, entity access, simulations that persist via Base44, AI gateways, and server functions must be demonstrated to work on the self-hosted origin before it is promoted as fully operational.

## Intended isolated target
- GitHub: `Austin-Texas/Transit-OS`, main after review.
- Host: `app-host-01`, the runner registered as `Transit-OS`.
- Application: `transit-os-web`, state directory `/home/trad/apps/transit-os`.
- Proposed HTTP origin: `127.0.0.1:8091` (confirm the port is free on host).
- External URL: `transi.hastenload.com` via existing Cloudflare Tunnel; DNS/tunnel mapping not created or verified by these repository files.
- No changes to TPMCS, GymPilot, ASVAB, other containers, or Cloudflare tunnel rules.

## Process matching TPMCS
1. Read the root `AGENTS.md`, full `document.md`, `TransitOS_Master_Project_Prompt.md`, and related consolidation notes; preserve newer dashboard and simulation work.
2. Validate repository build and existing unit tests on the self-hosted runner.
3. Build an isolated Docker image. Verify the same Node 22/Vite preview procedure used for TPMCS in a real container; never equate an HTTP 200 with full application functionality.
4. Test sign-in, per-user data, server functions, edit/save/refresh, existing dashboard navigation, controls and simulator safety interlocks. Do not claim hardware operations unless physically commissioned.
5. When all production integration checks are evidenced, the maintainer may add `docs/SELF_HOSTED_RUNTIME_READY.md` documenting reproducible test results to lift the guarded manual deployment workflow. Until then, the workflow intentionally fails closed.
6. Confirm local port availability, Cloudflare ingress mapping, SSL, domain and browser end-to-end functionality after deployment.
7. Preserve previous working container on a failed HTTP health check. Document test results, review with owner, and only then merge the deployment changes to `main`.

## Important limits
This staging branch has a **manual-only** deploy workflow and a CI validation workflow for `main` / PRs. The deploy workflow does not run on every push until the standalone runtime is tested and expressly approved. Its current readiness file is purposely absent.

Current `runs-on: [self-hosted, Linux, X64]` matches TPMCS but does not select the `Transit-OS` runner uniquely. Add a dedicated `transit-os` runner label and update YAML before approving production deployment.

Build-and-deploy shell commands on a self-hosted runner are privileged. Review external PRs carefully; never let untrusted PR code run on the production runner. Pin action versions and harden access permissions as part of the release review. Avoid committing credentials or live entity rows.

The repository does not currently provide a verified standalone database/backend migration. Do not describe one as implemented.
