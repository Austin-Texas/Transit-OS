# TransitOS temporary Base44 backend deployment

Decision: retain the Base44 authentication, entities and functions during frontend development. The selfhost/ backend is experimental and must not be deployed to production. The main branch is the Base44-synced source; do not merge the experimental self-hosted authentication branch.

## Required GitHub repository variables

Set these in Settings → Secrets and variables → Actions → Variables for Austin-Texas/Transit-OS:

- `TRANSITOS_BASE44_APP_ID` = `6afa3d27af32e7eb7d4b7f76`
- `TRANSITOS_BASE44_APP_BASE_URL` = the **verified** HTTPS Base44 API base URL for this exact app (not the frontend domain). Verify Base44 allows this independent origin and that login-info and actual sign-in work from transit.hastenload.com.

The workflow fails closed when variables are absent or the public login-info endpoint is unreachable. Never put credentials or access tokens in VITE_* variables. The public app ID and backend URL are build-time public metadata.

## Automatic deployment

Every code push to main (including a Base44 GitHub sync) triggers build/test and candidate-container smoke testing on app-host-01. Documentation-only changes do not deploy. Candidate is built before the old production container is stopped. A failed production HTTP health check triggers rollback. The current health checks prove only page availability, not successful authentication, Base44 entity permissions or complete E2E behavior.

Before enabling production updates, independently test sign-in, registration, protected pages and entity reads/writes from the production domain; ensure Base44 custom-domain/CORS/auth policy supports the deployment. If the external Base44 runtime is not compatible with independent hosting, keep the current production container and use Base44 hosting for authenticated flows until a supported bridge or full migration is implemented.

Never alter Cloudflare tunnel routes or other applications in this workflow. Hardware control remains simulation-only.
