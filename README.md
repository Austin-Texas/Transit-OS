# TransitOS — Smart camper platform

A full-stack Base44 app: [TanStack Start](https://tanstack.com/start) (React 19, plain JavaScript) with file-based routes, server functions and server routes, server-rendered and hosted by Base44.

## Current application

The preferred app is Base44 `6afa3d27af32e7eb7d4b7f76`. Its existing dashboard layout is retained; additional tools are reached through **Settings → Platform tools**. The repository is a reviewed source snapshot and does not automatically synchronize with the Base44 builder.

| Area | Location |
| --- | --- |
| Existing dashboard and systems | `src/routes/_authed/` and `src/components/dash/` |
| Consolidated tools | `/platform`: devices, tracking, LPG, leveling, integrations, updates, project records, alerts and simulation |
| Complete project context and owner workflow | [document.md](document.md) and [TransitOS_Master_Project_Prompt.md](TransitOS_Master_Project_Prompt.md) |
| Coverage, migration and validation | [docs/CONSOLIDATION.md](docs/CONSOLIDATION.md) |
| Meaningful behavior checks | `node --test tests/platform.test.mjs tests/simulation.test.mjs` |

The current tools include simulations and explicit integration plans. Real device transport, physical OTA, tracker adapters and hardware commissioning remain future work. Live entity data, credentials and private media are not part of this repository. Read AGENTS.md and recheck current Base44 before making changes.

## Run locally

```bash
npm ci
base44 login   # one-time per machine
base44 link    # one-time per clone
base44 dev     # local backend + app together
```

## Build and publish

```bash
npm run build         # -> dist/client (assets) + dist/server (the Worker)
base44 deploy         # or publish from the Base44 builder
```

There is no `index.html`: the HTML document is rendered on the server from `src/routes/__root.jsx`. The build runs through the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/), so dev and build both execute server code in `workerd`.

## How the pieces fit

- **Pages** are files in `src/routes/`. A route's `loader` runs on the server for a document request and in the browser for a client navigation; `Route.useLoaderData()` gives the component the resolved data.
- **Server functions** (in `src/lib/server-fns.js`, created with the first one) are RPCs created with `createServerFn`. `src/start.js` runs every one of them through `authMiddleware`, which sends the visitor's token along, so `context.getBase44()` returns a client acting as that visitor and entity access rules apply. `context.getBase44().asServiceRole` bypasses them, so use it only after authenticating the caller (`.middleware([requireUser])`) and checking they may access the records involved: server functions and server routes are public endpoints anyone can call with any input. See **Server Security** in `AGENTS.md`. Call it only in handlers that need Base44: it reads the platform headers, and a handler that never calls it works without them.
- **Secrets** are read in server code with `import { secrets } from "base44:runtime"` → `secrets.get("NAME")`, inside a handler. Never `process.env`.
- **Server routes** (`src/routes/api/*.js`) are raw HTTP endpoints for URLs something other than the app's own code requests (webhooks, downloads, feeds); the app's pages call server functions. `src/start.js` runs every request through `base44RequestMiddleware`, so their `server.handlers` receive the same `context.getBase44()` (`({ request, params, context }) => …`).
- **Server-only code** lives in `*.server.js` files (TanStack refuses to bundle them for the browser).
- **Auth** is resolved client-side after hydration (`useAuth()`); the server is anonymous on a document request, so give per-user pages `ssr: false`.
- **Sign-in and gated pages** are wired through the app's auth routes and the gate for `src/routes/_authed/`. New platform records also have entity access rules; module changes and simulated command dispatch require an authenticated admin. See **Adding Authentication** and **Server Security** in `AGENTS.md`.
- **AI**: TanStack AI is installed and runs on the Base44 AI gateway, with no API key and usage billed to the app's AI credits. `gatewayModel(context.getBase44())` in `src/lib/ai.server.js` builds the adapter; `AGENTS.md` has a streaming chat example (a server function plus `useChat`).
- **Caching**: the platform caches only what a route opts into via `headers()` (`Cache-Control: public, s-maxage=…`). Everything else is served fresh.


## TPMCS branded startup (self-hosted public demo)

The reusable `src/components/startup/TransitStartup.jsx` overlay is mounted once by `src/routes/__root.jsx`. It appears on a fresh document load or browser refresh, lasts **at least five seconds**, then reveals the existing routed dashboard. Client-side navigation does not remount the root and does not replay the animation. If the browser has not completed its initial document load, the overlay remains visible. This is a visual website initialization sequence, **not** a check of vehicle controller readiness.

Brand assets: `public/branding/tpmcs-logo.svg` is copied verbatim from `Austin-Texas/tpmcs-website/public/favicon.svg`; `public/branding/transit-van.svg` is a custom unbranded vehicle illustration. The animation uses CSS and React only, with no new dependency. Reduced-motion preferences disable decorative animation without disabling the timed transition.

For a future Raspberry Pi/Linux kiosk, launch Chromium or Edge in kiosk mode after the local web service is reachable. A Plymouth splash may be configured separately for Linux boot, but the website animation starts only after the browser loads; it does not cover the kernel boot period. Real hardware readiness must come from authenticated local controller/service health checks before reporting a connected state.

Production validation checklist: build with `VITE_PUBLIC_DEMO=true`; check a new Edge tab and hard refresh, minimum five-second duration, no login, existing dashboard unchanged, internal navigation without replay, reduced motion, mobile layout, and a real HTTP health check. Deployment must use the existing workflow and must not remove other Docker containers or volumes.
