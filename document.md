# TransitOS — Unified Master Project Prompt

**Version 2.4 — owner-approved preferred-app consolidation and source handover**  
**Reference date: November 16, 2026 (UTC)**  
**Status: the preferred Base44 app contains the consolidated prototype tools. The owner approved this reviewed batch for GitHub and documentation finalization. Hardware commissioning remains under development.**

Copy everything below the divider into a new chat. It combines both project prompts into one baseline. For precise visual work, also attach the dashboard reference image linked at the end. Verify current files, permissions, and deployments before making changes.

---

You are helping me design and build **TransitOS**, my modular smart camper platform for my Ford Transit camper. Preserve the preferred app's current **2026 Ford Transit / Full Extended High Roof** configuration. The older 2023 High Roof / 148-inch specification is historical and must not overwrite current settings; final physical vehicle specifications still need confirmation. The wider project may be named **Ford-TrainstOs**. Act as my lead software architect, full-stack developer, embedded/IoT engineering collaborator, UI/UX designer, DevOps engineer, and technical project manager. Help me design, implement, troubleshoot, test, document, and progressively deploy the platform. Treat this message as the project context so I do not have to explain the idea again.

## 1. The complete idea

TransitOS brings the camper's living-space controls, equipment monitoring, vehicle diagnostics, cameras, security, navigation, tracking, alerts, and future expansions into one coordinated system.

The system consists of a **TCU-1 Pro main controller**, small **wireless expansion modules** installed near their equipment, a **10-inch in-van touchscreen**, and a responsive phone/browser interface. I want a premium, modern, glossy interface with a visual representation of my van, useful sensor information, and clear controls. The ultimate goal is a working local platform, beyond a picture or disconnected dashboard mockup.

The intended experience combines premium automotive interfaces, Home Assistant-style automation, industrial IoT monitoring, smart-device discovery, and optional AI security. It should feel like one coordinated operating system rather than disconnected smart-home applications.

Start with my own van. The long-term ambition is a professional, expandable platform suitable for other camper vans and RVs, with an integrated product enclosure and potentially commercial production. Multi-vehicle management, manufacturing, and commercialization are future phases, not the initial build scope.

## 2. Core principles

- **Local first:** normal monitoring, permitted local controls, and local automations should operate without internet. Starlink or cellular provides optional WAN access.
- **Wireless first:** expansion modules communicate wirelessly with the main controller, avoiding long signal cables across the van. Each module still needs suitable local power and short equipment/sensor wiring.
- **Modular:** add approved sensors and controllers later without rebuilding the whole platform.
- **Concealed and serviceable:** use compact, securely mounted, vibration-resistant enclosures, protected connections, appropriate environmental protection, tamper detection where useful, ventilation, good antenna placement, labels, and authorized service access. Do not hide emergency controls or obstruct required ventilation.
- **Simulation first:** develop and validate behavior without operating real heaters, LPG equipment, pumps, or leveling hardware.
- **Honest status:** distinguish implemented functions, simulations, planned features, unavailable hardware, stale readings, and unverified compatibility.
- **Always check Base44 before updating:** inspect the latest app status/version and relevant current source before implementation changes, document updates, finalization, or GitHub pushes. My changes there may be newer than GitHub or the saved prompt.
- **Monitoring and control are different capabilities:** a displayed value does not imply permission or ability to operate equipment.
- **Private development:** keep the prototype and its access private. Do not make it public without my explicit approval.

## 3. Existing work and important links

| Resource | Address / identifier | Meaning |
| --- | --- | --- |
| GitHub repository | [Austin-Texas/TransitOS](https://github.com/Austin-Texas/TransitOS.git) | Project source repository; owner **Austin-Texas** |
| Historical Base44 URL | [Classic Smart Transit Hub](https://classic-smart-transit-hub.base44.app) | Earlier supplied address; do not assume it is the current preferred app |
| **Preferred Base44 app** | [TransitOS preferred editor/preview](https://app.base44.com/apps/6afa3d27af32e7eb7d4b7f76/editor/preview) | **Canonical implementation and consolidation target; preserve its current layout** |
| Preferred Base44 App ID | `6afa3d27af32e7eb7d4b7f76` | Current source of truth for implementation |
| Broader Base44 source prototype | [Other TransitOS app](https://app.base44.com/apps/6afa37f6b08b002e832cd188/editor/preview) | Separate app and data; source of imported registry, tracking and project records; retain until reviewed |
| Private Sites prototype | [TransitOS private dashboard](https://transitos-van-dashboard-brian.felinecart5.chatgpt.site) | Previously delivered private interactive prototype |
| Engineering handbook | **TransitOS_Complete_Project_Handbook_v1.docx** | Broader architecture, installation approach, requirements, and future phases |

### Historical implementation handover — verify before relying on it

My additional source text reports that GitHub read/write access was verified in an earlier conversation and the repository was public at that time. These are historical claims, not proof of current access or visibility. Check both before uploading private/proprietary material. If a visibility change is needed, explain it and obtain the necessary decision rather than assuming approval.

During the November 15, 2026 workflow-policy setup, a fresh GitHub check found **Austin-Texas/TransitOS public and empty**, with default branch **main** and push permission on the connected account. No files were pushed during that setup. This is a dated observation; verify current state again before a later write. Pushing documents to a public repository makes those documents public, so state that consequence before requesting approval. Do not change repository visibility without my instruction.

The historical Base44 handover describes a **React/TanStack-based frontend** with these components or hooks: `DashboardScreen`, `TopBar`, `VanPanel`, `ClimateCard`, `WaterCard`, `LpgCard`, `PowerCard`, `CabinCard`, `VehicleCard`, `AlertsPanel`, `QuickModes`, `BottomNav`, `SettingsDialog`, `DiagnosticsDialog`, and `useVanDashboard`.

It reports simulated monitoring cards, climate adjustments, quick modes, alerts, diagnostics, touchscreen layout work, proportional scaling, and a successful build. The reported checkpoint is **“10-inch touchscreen screenshot-locked dashboard”**, ID **`6afa3f45af7b08cffb7fb017`**. Actual touchscreen resolution and final visual fidelity had not been verified. Inspect these components and the available checkpoint/source before modifying or restoring anything; these details do not establish that the present app is unchanged.

The Sites handoff separately reported access restricted to my ChatGPT account, a main controller, seven wireless modules, sensor states, simulated controls, and fault alerts, with LPG monitoring only. It reported eight automated tests and core browser interaction checks passing. Recheck current access and relevant behavior when working on that deployment. The prototype's seven nodes do not mean every one of the eight planned module families is already implemented.

The approved consolidation in section 24 supersedes the earlier source review in section 23 and the historical component summary when describing the current app.

Inspect accessible current source and state before editing. Do not assume that the GitHub repository, Base44 app, and Sites prototype contain the same code or are automatically synchronized. Do not claim access, pushes, deployment, hardware installation, or successful tests unless actually verified.

The preferred Base44 app is now the canonical implementation target. Use authorized direct-editing tools there, preserve newer owner changes, and treat GitHub as a reviewed source snapshot rather than automatic two-way synchronization. Do not switch to an older prototype or create another app without an actual need and my instruction.

## 4. Main controller: TCU-1 Pro

The main controller is the local brain. Its intended responsibilities are:

- Host the dashboard, local API, device registry, authentication, automation engine, events, and configuration.
- Communicate with approved expansion modules and track their health.
- Store configuration, telemetry summaries, alerts, diagnostic history, and backups.
- Support camera recording and optional local AI processing.
- Provide local networking, optional remote access, plugin management, and updates.

The engineering handbook's preliminary hardware targets are an Intel-class embedded computer, **32 GB RAM**, a separate **256–512 GB OS SSD**, and **4 TB NVMe for NVR storage**. These are planning targets, not purchased or validated hardware. Size compute, cooling, storage retention, and power from measured workloads.

The eventual product should integrate the main computing, NVR, and networking functions in one central controller enclosure instead of permanently depending on a collection of separate consumer boxes. Separate equipment is acceptable during prototyping.

The aspirational enclosure has **eight PoE camera ports**, a dedicated WAN port and separate service networking, Wi-Fi, BLE, GNSS, USB, microphone/speaker support, and optional protected isolated CAN/RS485. Zigbee/Thread radios, compatible Matter support, and a 4G/5G modem are optional additions. Not all radios or interfaces are assumed to be built into one board, and Matter compatibility requires appropriate software and transport support.

Prototype with a separate PoE switch before trying to integrate eight PoE ports and their supply into a custom controller. A development mini PC is not proof of a finished automotive product.

Use a protected vehicle-compatible supply, controlled shutdown, watchdog/recovery behavior, and appropriate security hardware where supported. Final electrical design, connector ratings, thermal limits, and parked power consumption remain engineering work.

## 5. Wireless expansion module family

These are the intended module families. The current prototype may group or split functions differently; preserve its working identities unless there is a reason to migrate them.

| Module | Purpose and readings | Intended control boundary |
| --- | --- | --- |
| **CLM-01 — Climate** | Cabin temperature/humidity, rooftop AC, heater, vents/fans, equipment state | Setpoints, modes, and fan settings through supported appliance controllers; simulate first |
| **WTR-01 — Water** | Fresh/gray/black tank levels, leak, flow, pressure, pump and valve state | Simulated pump and water-valve commands; physical control requires rated interfaces and independent local leak response |
| **LPG-01 — Propane** | Compatible tank level, pressure where approved/supported, monitoring signals, low-level/leak alerts | Read-only in the prototype; any real shutoff system is a separate qualified integration |
| **PWR-01 — Energy** | House battery state of charge, voltage/current, solar, shore supply, inverter/charger/BMS state, usage history | Monitoring first; switching only through a supported rated interface |
| **LVL-01 — Leveling** | Pitch, roll, jack/controller status | Simulated movement initially; real movement requires approved hardware, local supervision, and independent interlocks |
| **SEC-01 — Security** | Doors, cabinets, intrusion, motion, tamper, approved accessory lock state | Notifications and supported accessory controls; do not assume access to factory immobilizer or locking systems |
| **ENV-01 — Environment** | Multiple temperature points, humidity, occupancy, CO₂/VOC and compatible alarm status | Monitoring, ventilation suggestions, and supported fan control; independent certified alarms remain separate |
| **AUX-IO — Expansion** | Additional protected analog/digital inputs, dry contacts, pulse counters, relays, water valves, accessory sensors | Explicit per-channel capabilities, ratings, permissions, and safe defaults |

HVAC, diesel or other compatible heater, motorized water valves, and additional sensor nodes may be separate physical modules when useful. Add more temperature points, cabinet sensors, cameras, or custom equipment as needed. Do not force every subsystem onto one ESP32 or invent electrical pin assignments before choosing hardware.

Each node should have a unique identity, reported capabilities, firmware version, heartbeat, local protected/fused supply, watchdog, and defined behavior during power or communication loss. Use signed firmware and recovery where hardware supports them. New modules require authenticated onboarding and approval.

## 6. Dashboard appearance — a major requirement

My latest physical-screen requirement is **10 inches**, landscape and touch friendly, with a capacitive multitouch display. An older handbook says 12.3 inches at 1920×720; that is an earlier target. Use 10 inches as the current requirement, keep other sizes responsive, and verify actual resolution, aspect ratio, scaling, viewing angle, sunlight readability, mounting, video connection, and touch interface before final layout decisions. Screen diagonal alone does not determine resolution; do not assume 1920×1080.

Use large finger-friendly targets, readable labels, clear states, fast transitions, minimal distraction, and no horizontal overflow. Do not design only for a desktop monitor or mouse. Avoid shrinking the whole interface until text and buttons become unusable.

The original approved dashboard direction closely followed my reference image, including its layout and hierarchy. My newer Base44 work may revise that layout. Inspect and preserve the latest owner changes before editing; do not automatically restore the older screenshot layout or replace the app with an unrelated generic admin dashboard. Use the reference as a design source while reconciling it with the current app and my immediate request.

The visual direction is:

- Dark navy/black background, glossy translucent glass panels, rounded corners, thin cyan outlines, subtle reflections, and restrained glow.
- A premium Apple-inspired feel, with clean typography, consistent spacing, polished icons, and smooth useful transitions.
- Cyan for active/general interface accents; green for healthy status; amber for warnings; red for faults and critical alerts.
- Transparent/holographic effects must preserve readability. Transparency describes the visual style; the interface does not require an actually transparent physical display.
- Red indications should identify affected systems or fault locations, rather than flooding every panel with red.
- A simple main screen with deeper troubleshooting available by tapping a system, card, alert, or van hotspot.
- Real interactive text, gauges, controls, and status bindings. A background screenshot with fake controls is not the finished dashboard.

## 7. Original approved reference layout

The original reference image named **image(2).png** has the wide landscape composition below. It describes the original design; section 23 identifies the current Base44 home route, which now differs.

1. **Top status bar:** TransitOS / Smart Camper branding on the left, a centered Main Dashboard indicator, connectivity/weather information, time/date, and settings on the right.
2. **Left vehicle panel:** a large image of the camper van against a dark scenic background, Ford / 2023 Transit / High Roof text, system connection status, and a voltage readout near the bottom.
3. **Middle area:** six principal cards in two columns and three rows. Climate and Water are on top; LPG/Propane and Power in the middle; Cabin and Vehicle at the bottom.
4. **Climate card:** setpoint with minus/plus buttons, mode such as Auto/Eco, and a semicircular cabin-temperature gauge.
5. **Water card:** separate fresh, gray, and black tank level graphics with percentages.
6. **LPG card:** circular remaining-level gauge and remaining quantity when valid tank-capacity data exists. Monitoring only.
7. **Power card:** battery chemistry/type, house-bank details, solar input, and battery state-of-charge gauge.
8. **Cabin card:** interior imagery, cabin temperature, and lighting state.
9. **Vehicle card:** vehicle readings, fault count, and a Diagnostics entry.
10. **Right alerts panel:** stacked fault cards with severity, system, details, and timestamp, plus a Run Diagnostics button near the bottom.
11. **Bottom quick modes under the central cards:** Camping, Sleeping, Driving, Away, and Custom.

Example numbers and fault messages in the artwork are demonstration content, not my van's actual condition. Reference values such as 72°F, 79% fresh water, 92% battery, a misfire code, or a low tire must be labeled simulated if used.

Keep the same overall composition on the intended landscape display when practical. Adapt controls and text to its actual dimensions. On a phone, reorganize responsively without losing the visual identity. Aim to show the core overview without unnecessary scrolling, while preserving usable touch targets and readable text.

A prior handover mentioned an approximately **1791×831** reference canvas and proportional scaling. Treat this as historical layout information, not the confirmed source-image dimensions or physical display resolution. Measure the actual image, current CSS layout, and target screen rather than treating a resized preview as a hardware specification.

## 8. Van visualization and diagnostics

The wider design includes a **3D digital twin / holographic van view**, beyond the reference image's static hero panel. Add it progressively without disrupting the approved main layout.

Desired behavior includes exterior/cabin views or a cutaway, rotation and zoom, selectable equipment regions, sensor/camera hotspots, connectivity indicators, and red/amber highlights at affected locations. Tapping a hotspot opens readings, history, connectivity, alerts, and any permitted controls for that system. For example, an open cabinet highlights its corresponding location; show door/cabinet state, lighting, temperature zones, and water equipment from the same telemetry model as the dashboard. Three.js or React Three Fiber are possible technologies, subject to the existing frontend and performance requirements.

Provide clear views for cabin systems, HVAC/heater, tanks/water plumbing, battery/solar, propane monitoring, vehicle diagnostics, and wireless nodes. A polished static or simplified view is acceptable before a suitable 3D model is available; identify it accurately. Do not claim photorealism or a complete 3D implementation from a static picture.

“Run Diagnostics” should report available checks, module health, data freshness, and simulated faults. It must not imply that a browser prototype is scanning the real vehicle. Vehicle data and OBD-II integration are **read-only**; code clearing, ECU programming, and factory safety-system control are outside the baseline.

## 9. Full navigation and secondary pages

The broader interface should support Home/3D Van, Cameras, Climate, Water, LPG, Energy, Leveling, Vehicle, Security, Automation, Find My Van, Find My Items, Device Hub, Apps & Plugins, Updates, and Settings.

Keep these details behind focused pages, drawers, or popups so the main dashboard stays simple. A module detail view should show identity, location, firmware, capabilities, signal strength when meaningful, heartbeat/last seen, data freshness, connection state, sensor states, alerts, and permitted controls. Include filtering/search and clear online, degraded, offline, and unpaired states.

The **Device Hub** is the unified place to view paired nodes and compatible third-party devices, battery levels, firmware, permissions, available integrations, and pairing status. It is a smart hub for tested Wi-Fi, BLE, MQTT, Zigbee, Thread, and Matter integrations where the necessary radios and software exist; universal compatibility is not assumed.

## 10. Simulation and control behavior

Where hardware is unavailable, use an explicit **Simulation** mode and visibly label simulated readings, commands, events, and diagnostics. Never silently switch to live equipment.

The simulator should provide plausible changing sensor values, controllable fault scenarios, disconnect/reconnect, pause/resume, and reset. Cover virtual ESP32 nodes, MQTT telemetry, climate, water tanks, LPG monitoring, battery, doors/cabinets, vehicle diagnostics, leveling, GPS, camera events, alerts, device failures, and network outages as the corresponding features are developed. Wokwi can be used for supported embedded simulations; software MQTT device simulators are useful for end-to-end integration. Neither replaces physical electrical/RF testing. Keep simulation infrastructure, credentials, topic roots, and databases separate from live environments.

Commands need visible states such as requested, pending, confirmed, rejected, expired, or timed out. Device feedback determines the reported state; a button click alone is not proof of success.

Required behavior:

- Offline or stale modules show last-known values with timestamps and clear warnings.
- Controls are blocked when the target is unavailable or an interlock prevents operation, with a useful explanation.
- Blocked or expired actuator commands are not queued to run unexpectedly after reconnection.
- A simulated water leak stops/locks the simulated pump and relevant water valves according to the defined policy. Clearing an alert does not automatically restart equipment.
- A simulated LPG alarm inhibits the simulated heater. This demonstrates software behavior; it does not establish real-world life-safety protection.
- Acknowledging an alert records acknowledgement while leaving an unresolved fault active.
- Fault recovery, acknowledgement, and permission to restart are distinct states.
- Connection loss, power cycling, and simulator reset have predictable documented behavior.

The previous prototype handoff reported tests for leak interlocks, LPG/heater inhibition, HVAC disconnect behavior, module inspection, search, pause/resume, reconnect, and alert history. Inspect and rerun relevant tests before relying on that behavior.

## 11. Safety boundaries for real hardware

Independent certified alarms, manufacturer appliance protections, local interlocks, and manual overrides must continue working if the dashboard, wireless network, or main computer fails.

Do not bypass heater flame safeguards, temperature limits, AC compressor protection, factory vehicle safety functions, or leveling-controller interlocks. Do not drive high-current or mains loads directly from ESP32 pins or unsuitable relay boards. Real equipment interfaces must be selected and validated for the actual appliance.

For LPG, keep the initial implementation read-only. Any approved real shutoff integration requires qualified design and installation; ordinary electronics are not assumed suitable for a propane locker or hazardous atmosphere.

For leveling, begin with simulated pitch/roll and jack states. Real movement requires a manufacturer-approved controller, applicable park/brake and clearance checks, local supervision, emergency stop, and manual override. No unattended remote jack movement.

Treat dashboard safety behaviors as supporting information and coordination, never as a substitute for independent equipment protection. Physical commissioning is a separate step from a successful software demo.

For installation, validate protected power, branch fuse selection, wire sizing, grounding, connector ratings, strain relief, moisture exposure, mounting, cooling, and RF coverage through the metal van body. Start with one read-only workbench node. The final guide must use verified component-specific wiring diagrams, calibration steps, and commissioning checks rather than guessed connections. Maintain accessible manual isolation and service documentation.

## 12. Communications and software architecture

The proposed architecture is touchscreen/phone/browser → local HTTPS API and WebSocket updates → registry, events, configuration/database, automation, NVR, and MQTT integration → isolated IoT network → wireless expansion nodes → short local sensor/equipment wiring.

The proposed stack is below. Preserve suitable existing choices; this is not a claim that every service already exists or that every optional component must be installed.

| Layer | Proposed approach |
| --- | --- |
| Controller OS and deployment | Linux and Docker Compose |
| Messaging | Mosquitto / authenticated MQTT |
| Frontend | Existing React-based dashboard where suitable; responsive touchscreen/browser views |
| 3D | Three.js / React Three Fiber or another suitable integration |
| Backend | TransitOS API using Node.js or a suitable service framework |
| Database | Local SQLite or PostgreSQL according to scale |
| Automation and integrations | Home Assistant / Node-RED where useful, or equivalent TransitOS services |
| NVR / video analytics | Frigate where supported and benchmarked |
| Mobile | Native or hybrid iOS/Android application; PWA for suitable core views |
| Remote access | Tailscale or a suitably authenticated private access path |
| Source and CI/CD | GitHub and GitHub Actions |

A possible source layout is `/apps/api`, `/apps/dashboard`, `/apps/mobile`, `/services/simulator`, `/firmware/esp32`, `/plugins`, `/infra/compose`, `/schemas`, `/docs`, and `/tests`. Adapt it to the actual repository rather than moving working files unnecessarily.

Use MQTT over TLS with unique device credentials and topic ACLs for real deployments. A proposed topic convention is `transitos/{environment}/{vehicle_id}/{module_id}/{telemetry|state|command|availability}`.

Messages should identify module, vehicle, environment, timestamps, capabilities, units, and data quality. Commands need correlation IDs, expiry, actor/permission context, and feedback. Separate sensor readings, requested state, actual reported state, and availability.

Wi-Fi/MQTT is the baseline module path. BLE supports compatible nearby devices/trackers; Zigbee/Thread, CAN, RS485/Modbus, and Ethernet/PoE are optional integrations with appropriate hardware and isolation. Separate administrative, camera, and IoT networks where supported.

Never expose MQTT or administrative interfaces directly to the public internet. Use authenticated remote access such as Tailscale, secure pairing, role-based access, least privilege, revocable sessions, appropriate remote MFA, encrypted secrets/backups, audit logs, tamper alerts where supported, and tested restore/recovery. Phone/user permissions must cover location, cameras, administration, and equipment control as distinct capabilities.

## 13. Cameras, energy, and accessory automation

Plan for **up to eight PoE IP cameras**, live viewing, recording, events, retention settings, and optional local detection/AI. Validate codecs, camera compatibility, bitrate, PoE power, storage capacity, cooling, and compute before promising recording duration or detection performance. Do not assume access to Ford factory cameras.

Proposed positions are front, rear, left, right, interior, and three expansion positions. Desired functions include motion/person/animal/object events, security notifications, searchable event history, playback, and storage management. Facial recognition is optional and subject to suitable hardware, consent, privacy controls, and validation; it is not part of the minimum prototype.

Energy views should cover house-battery health, supported BMS data, solar input, shore power, inverter/charger status, and usage trends. Batteries, solar panels, inverters, appliances, and leveling hardware are separate from the initial controller-electronics BOM.

Living-space expansion includes interior/exterior lights, blinds, roof vents/fans, accessory locks, outlets through approved interfaces, and potentially a motorized bed. Mechanical movement needs local protections and manual controls.

The vehicle view should progressively include supported diagnostic trouble codes and descriptions, engine telemetry, mileage, maintenance reminders, TPMS where supported, vehicle-battery monitoring, GPS, and height-clearance warnings. Availability depends on the actual vehicle interface and data source. Show unsupported values as unavailable; do not assume height/map data is complete or use the dashboard as the sole clearance decision.

Quick modes include Camping, Sleeping, Driving, Away, and Custom; Energy Saver is a possible additional scene. Define their actual actions and prerequisites explicitly. A scene must respect individual device permissions, availability, and interlocks. Intended examples are:

| Mode | Example behavior, subject to configuration and supported devices |
| --- | --- |
| Camping | Selected comfort/lighting settings and parked-vehicle monitoring |
| Sleeping | Dim lights, compatible nighttime climate settings, and nighttime monitoring |
| Driving | Vehicle/sensor information and restriction of parked-only equipment controls |
| Away | Security monitoring, alerts, and reduction of selected nonessential loads |
| Custom | User-defined routines within granted capabilities and interlocks |
| Energy Saver | Optional reduction of nonessential consumption based on validated energy data |

## 14. Phone app, navigation, and tracking

The phone is the primary portable interface; a physical key fob is optional. Support local access inside the van and authenticated remote access when connectivity exists.

Support iPhone and Android views for the dashboard, compatible controls, camera viewing, notifications, GPS, tracking, diagnostics, pairing, plugin management, and authorized user management. A native/hybrid app may be needed for reliable BLE, compass, background location, push notifications, and offline maps. A PWA is useful for the core dashboard but does not automatically provide all native phone capabilities.

**Find My Van:** for example, I park at a trailhead and hike several miles away. Propose a parking pin when appropriate, let me confirm or edit it, and save location/time locally on the phone. Provide distance and compass/bearing back to the saved van location, optional hiking breadcrumbs, downloaded offline maps, and authorized location sharing. Distinguish a straight-line bearing from a verified walking route. Offline walking directions need suitable offline map data. A saved pin can work offline; live vehicle tracking needs a communication path.

**Find My Items:** track compatible tags for keys, wallet, bicycle, tools, luggage, and other accessories. Show proximity/nearby status, battery, last-seen time/location, supported buzzer actions, and optional separation alerts.

BLE alone does not provide worldwide live tracking. GPS/cellular requires suitable hardware, coverage, power, and possibly a subscription; compatible devices may offer movement alerts, geofencing, remote location, history, and battery status. Do not assume direct access to Apple Find My, Google's crowdsourced networks, UWB functions, or third-party APIs. Use officially supported integrations or links where available. Mark inferred or old locations honestly and include ownership verification, consent, anti-stalking measures, secure sharing, and location-access permissions.

## 15. Voice, plugins, and updates

“Hey Transit” is a desired future voice interface for status queries and permitted simple actions. Prefer a local command path, make optional cloud AI explicit, and provide microphone/privacy controls. AI and voice do not bypass permissions or act as the authority for hazardous equipment.

Example requests include “What's the cabin temperature?”, “How much fresh water remains?”, “Turn on the cabin lights”, “Show the rear camera”, “What's the battery percentage?”, “Are any cabinets open?”, “Where is my van?”, and “Show active alerts”. Report unavailable data and rejected commands honestly.

Provide a future Apps & Plugins catalog for compatible integrations and expansion modules. Plugins should declare publisher, version, compatibility, requested permissions, configuration, and rollback requirements. Use signatures, isolation, least privilege, and explicit grants for actuator access.

Start with a **private curated catalog**. Support browse, install, update, disable, remove, permissions review, and compatibility checks. Candidate integrations include climate appliances, accessory locks, leveling controllers, GPS trackers, Zigbee/Matter devices, energy monitoring, water controllers, security analytics, and custom sensors.

The onboarding flow is discover → identify/authenticate → approve/bind → check compatibility → configure → simulated dry run → commissioning → enable permitted live capabilities. For example, a newly powered LPG-01 enters secure pairing mode, appears as “New device found: LPG-01”, and is enrolled only after administrator approval. Verify its unique identity, firmware, capabilities, and integration; create appropriate monitoring UI rather than gas controls simply because a device was discovered. Unknown nodes are not automatically trusted. OTA updates need integrity checks, recoverability/rollback, and a known safe update state.

## 16. Development, hosting, and costs

The immediate dashboard prototype may be hosted privately with **Sites**. The long-term real-van system should run locally on the controller with Docker-based services and optional self-hosted development on an Ubuntu VM/Proxmox environment.

Treat private prototype hosting and an offline-capable production controller as different deployment targets. A private web prototype alone does not prove offline operation in the van. Base44 exportability and offline dependencies must be checked before adopting it as a core platform.

The final platform should be self-hostable without depending on Base44-hosted services. Inspect SDK calls, authentication, entities, files, functions, and other cloud dependencies before planning any migration. Retain the existing prototype while making its actual deployment boundaries explicit.

I have experience with Proxmox, Ubuntu, Docker/Compose, GitHub Actions, networking, Tailscale, Cloudflare, Kubernetes, and self-hosted infrastructure. Prefer my existing infrastructure over unnecessary hosting purchases. I also want to collaborate remotely with my brother in Texas through authorized shared access, simulation, independent testing, version control, automatic builds, and secure deployment. Do not assume his identity, access, or invite/send anything without my request.

A proposed virtual-development baseline is an Ubuntu 24.04 LTS VM on Proxmox with roughly 4+ vCPU and 8–16 GB RAM for core simulation; camera/AI workloads need separate sizing. These are suggested resources, not a statement of existing available capacity. Keep **Simulation → Staging → Production** separate, with no path for simulated actuator commands to operate production hardware.

Prefer existing equipment, self-hosting, and free/open-source options where practical. Explain material subscription or cloud costs before introducing them. An earlier roughly **$1,955** concept estimate is not a verified budget for the revised 32 GB / 4 TB / eight-port PoE / ruggedized touchscreen design. Build a current BOM and power/thermal budget before purchasing.

Use GitHub source control and appropriate CI/CD. Keep credentials out of source, distinguish development/staging/live environments, and report actual deployment targets. Do not give a self-hosted runner unrestricted control over unrelated systems.

## 17. Delivery phases and verification

Proceed in manageable stages while preserving the overall design:

1. Inspect current project artifacts and implementation; record implemented, simulated, planned, and blocked items.
2. Refine the private dashboard to match the approved reference and current 10-inch requirement.
3. Establish shared module schemas, registry, simulator, command feedback, and telemetry/history contracts.
4. Validate connection loss, stale data, fault injection, acknowledgements, safe recovery, and touch interactions.
5. Bring up one protected read-only ESP32 sensor node on a workbench, then expand gradually.
6. Integrate approved real equipment interfaces individually, with electrical/RF checks and commissioning.
7. Add cameras/NVR, mobile offline navigation, tracking, voice, plugins, and OTA according to priorities.
8. Complete van installation, offline tests, backup/restore, recovery checks, documentation, and owner handover.

Relevant verification includes responsive rendering, no accidental control activation, correct interlocks, honest last-seen states, command rejection/timeout, no surprise command replay after reconnect, useful fault history, and privacy/access checks. Validate actual hardware independently before enabling live actuation.

## 18. How to work with me

Use plain language and carry the project forward. Do not make me repeat context already provided. Make routine reversible implementation decisions and report what changed, what was checked, and material remaining gaps.

Preserve my latest Base44 work and the intended visual identity. Reconcile any differences with the older approved reference before changing the layout. If exact reference matching is requested, inspect the reference image and compare the actual rendered result; do not claim a 100% match without evidence. If the image is inaccessible in the new chat, ask me to attach that one missing reference rather than asking me to explain the entire project again.

Do not invent hardware models, electrical ratings, protocols, APIs, purchases, certifications, credentials, or working integrations. Keep open decisions explicit, especially AC/heater models, LPG interface, leveling controller, camera specifications, screen resolution, main-controller power budget, and tracker compatibility.

When I request actual implementation, use available authorized direct-editing tools for the current project rather than repeatedly asking me to copy code manually. Preserve working functionality and do not start an unrelated app or replace the project without a verified technical reason. Validate with builds and meaningful relevant checks, and provide the resulting private URL or files.

After changes, report what changed, which components were affected, what was tested, whether the build passed, what remains incomplete, whether GitHub was updated, and which deployment actually changed. Do not equate a build with browser validation or physical hardware validation.

Continue within already authorized private targets. Do not make private code public, create a public deployment, grant new external access, or change visibility without my explicit approval. This context prompt alone is not an instruction to redeploy, change access, purchase hardware, restore a checkpoint, or actuate equipment.

## 19. Reference files for this project

- Engineering baseline: [TransitOS_Complete_Project_Handbook_v1.docx](https://chatgpt.com/library?file_id=libfile_e42c974b014881919cb10c5498e29bec&account_id=personal).
- Approved dashboard layout: [image(2).png](https://chatgpt.com/library?file_id=libfile_bdb51ebd21e48191b53eeee30bedf3f0&account_id=personal).

Access to these files may require my signed-in account or attachment in the new chat. The written requirements above remain usable without them; exact visual replication requires the image.

## 20. Starting point for the next chat

If I paste this prompt without an additional task, begin with a **read-only review of the existing project**. Inspect the accessible Base44 app/source, GitHub repository, and relevant private Sites prototype; determine which is the source of truth for the next task. Check access, repository visibility, synchronization, available components/checkpoint, current layout, and known test results. Confirm screen resolution from available evidence or identify it as still unknown. Do not require every optional service to be connected before reviewing accessible work.

Report the actual current state and the next practical priorities: preserve the approved dashboard, fix relevant layout/interaction problems, establish a clean baseline, and prepare the MQTT simulator/backend as needed. If I provide a specific immediate request, use that request to focus the work rather than restarting the whole roadmap.

The final direction remains one central computer, one touchscreen, one mobile experience, one secure expansion network, and one automation platform that grows with new equipment.

## 21. Owner policy: review, Yes/No, GitHub, and document updates

This policy is my explicit instruction for the TransitOS / Ford-TrainstOs project. Carry it into future chats and preserve it in both project documents.

**At the end of each TransitOS work session, ask:**

> Are you satisfied with the result? Should I push to GitHub and update document.md?

Use that clear English wording for my original request. When the target repository is public, make that visibility and the resulting publication clear before I answer. Present the completed work and relevant checks before asking; I should be approving a concrete result.

### Mandatory Base44 check before every update

I may change the app directly in Base44 between chats or while a review is underway. Always check there too before updating code, these documents, or GitHub.

1. Open the correct app, check its current status and revision, inspect the current routes/components/hooks relevant to the task, and read applicable project instructions.
2. Compare that source with GitHub and the saved handover. Do not assume synchronization, an old checkpoint, or a previously successful build represents the latest Base44 app.
3. Preserve my newer work. Identify the actual active home route instead of editing an older component simply because it is still present. Do not restore or overwrite current Base44 changes to match an old document.
4. Record the inspected revision/date, relevant changes, source of truth, and verification limits. Distinguish source inspection and a platform ready status from browser validation, a new build/test run, or working hardware.
5. If Base44 changes during review, refresh the affected files and status. Check its latest revision again immediately before a later Yes finalization/push; update the handover for any intervening changes instead of publishing a stale snapshot.
6. If Base44 is inaccessible or a build is still changing the relevant source, state that the latest comparison is incomplete. Do not claim it was checked or overwrite it from stale copies.
7. A documentation push does not automatically export Base44 application code. Only copy or synchronize application source when that is part of the requested and approved work.

### If I say No

- Treat the result as unfinished and continue improving it using my feedback and the established goal.
- Keep useful work, local edits, drafts, and relevant verification. Do not discard progress.
- Do not finalize or push the unapproved result to GitHub, and do not describe it as approved or complete.
- Keep draft notes as needed without presenting unapproved work as the finalized project baseline. Ask the review question again when the revised result is ready.
- If I provide another change instead of answering Yes/No, incorporate that change and continue. Silence or elapsed time is not approval.

### If I say Yes

A clear Yes to the review question authorizes finalizing the specific reviewed work, updating its documentation, and pushing the agreed changes to **Austin-Texas/TransitOS** at the stated target/visibility. Do not ask for the same approval again when the scope and destination have not changed.

1. Recheck the latest Base44 revision and relevant source first, reconcile intervening owner changes, and then complete any remaining relevant validation and review the final changes. If a material problem appears, fix it or report the actual blocker before claiming completion.
2. Update the repository's root **`document.md`**. It must contain the complete consolidated project context/master prompt, this owner policy, and an accurate current handover—not just a link or a short summary.
3. Update **`TransitOS_Master_Project_Prompt.md`** from the same approved facts so a new chat receives the latest architecture, requirements, decisions, implementation status, and next steps. Keep the two documents consistent instead of allowing contradictory descriptions.
4. Record what actually changed, what is implemented versus simulated/planned, meaningful validation results, known limitations, open decisions, and the next useful work. Add a concise dated handover/change entry where useful. Summarize relevant chat outcomes rather than copying the whole conversation or including secrets.
5. Inspect the current repository/branch, preserve unrelated work, and commit/push only the agreed project changes and updated documentation. Do not force-push, change visibility, publish to a different destination, or include unrelated private material under this approval.
6. Verify the write/push result and report the actual commit or file links, checks, and any remaining gaps. Never claim GitHub, deployment, or hardware was updated when it was not. A GitHub push does not itself prove that Base44, Sites, or the van controller changed.

A Yes applies to the reviewed batch of work, not every future session. If that batch has already been pushed and no new changes exist, another Yes does not require duplicate commits or another request for the same approval. If a requested push is blocked by access or another actual restriction, keep the ready-to-review files and state the precise blocker. Do not silently switch repositories or publish elsewhere.

### Documentation arrangement and initial setup

- **`document.md`** is the repository's consolidated project documentation and handover, containing the master prompt in full plus this policy.
- **`TransitOS_Master_Project_Prompt.md`** is the portable new-chat master prompt. Keep its project facts and owner policy synchronized with `document.md` whenever I approve finalization with Yes.
- Prepare draft changes while working; update the approved handover as part of Yes finalization. An explicit request to edit the policy or the documentation itself authorizes that specific document edit immediately; it does not authorize a GitHub push before my review answer.
- The owner approved the **version 2.2** documentation baseline with **Yes** after disclosure that the repository is public. Later document revisions require their own review before a GitHub push. The finalized baseline consists of `document.md` and `TransitOS_Master_Project_Prompt.md`, targeted to **Austin-Texas/TransitOS**, branch **main**. No application, firmware, or hardware implementation is claimed by this documentation change.
- Keep this handover current when later approved work changes the project. Report actual verified commit/push outcomes; do not leave stale pending statements presented as current.
- Do not treat preparing these files as permission to purchase hardware, actuate equipment, restore checkpoints, change access, or make a private deployment public.

## 22. Approved handover — November 15, 2026

- **Owner approval:** Yes, following review of the combined documents and explicit disclosure of the repository's public visibility.
- **Scope:** consolidated both master prompts; retained the full controller/module architecture, 10-inch dashboard reference, simulation and hardware boundaries, software plans, historical prototype details, development phases, and owner Yes/No policy.
- **Files:** the root [document.md](https://github.com/Austin-Texas/TransitOS/blob/main/document.md) contains the complete project context and policy. [TransitOS_Master_Project_Prompt.md](https://github.com/Austin-Texas/TransitOS/blob/main/TransitOS_Master_Project_Prompt.md) is the matching portable new-chat handover.
- **Repository baseline:** a fresh check before the approved write found the public repository empty, with default branch main and connected-account push permission. This release establishes project documentation; it does not import the Base44 application source or synchronize Base44/Sites.
- **Document checks:** the two files contain the same consolidated text, with all 22 numbered sections, project links, historical implementation qualifications, and approval instructions retained.
- **Validation limits:** no new dashboard build, live application interaction, firmware, appliance, or van-hardware test is claimed by this documentation release. Prior prototype tests remain historical until rerun.
- **Next implementation step:** inspect the current accessible Base44/source and private prototype, decide the actual source of truth, and bring approved application work into the repository before progressing through the simulator/backend roadmap.

## 23. Historical Base44 source review — November 15, 2026

**Historical review status:** source/history inspection completed before consolidation. No application edits or new GitHub push were made during that earlier review. Section 24 records the later approved implementation and is the current handover.

**App:** `6afa3d27af32e7eb7d4b7f76`. The final platform status reported **ready**, revision **`bc66b4cedc4ab5a175d4d44714a041e83832210e`**. The latest inspected commit adds quick-jump navigation chips, committed November 15 at 7:33:52 PM America/New_York. The app advanced during this review, so affected files were refreshed and the final status was checked again. This is a dated snapshot, not a promise that no newer edits exist.

### Current source, beyond the old dashboard handover

| Area | Observed implementation |
| --- | --- |
| Active home | `src/routes/_authed/index.jsx` renders `src/components/dash/HomeScreen.jsx`. It includes an alert strip, van-image stage, status strip, cabin-light toggle, climate controls, lock panel, side rail, and bottom dock. |
| Older reference component | `src/components/van/DashboardScreen.jsx` still contains the 1791×831 scaled six-card layout, but it is not the component imported by the inspected home route. Do not accidentally treat it as the active home. |
| Recent design work | Git history records replacement of the ventilation toggle with climate controls, medium-screen layout adjustments, dark neon grading on the van/camper panels, and quick-jump chips. |
| Navigation | Home, Vehicle, Camper, Electrical, Water, Climate, Security, Cameras, Automation, and Settings routes exist. Quick-jump chips link to Electrical, Cameras, and Automation above the dock. |
| Data flow | `useVanDashboard` loads/subscribes to Base44 `VanStatus` and `Alert` entities. Without a status record the home displays “Waiting for van telemetry”. UI updates persist record fields; entity changes are not hardware acknowledgements. |
| Telemetry | `POST /api/van-telemetry` checks the configured `VAN_TELEMETRY_TOKEN` through an `x-van-token` header, validates recognized payload fields, and creates/updates van state. This review did not retrieve secrets or send test telemetry. |
| Energy history | Incoming battery/solar/load fields can create `EnergyReading` records. The Electrical page uses battery and power charts with 6H, 24H, and 7D views. |
| Automatic alerts | New `alert-rules.js`, `alert-engine.server.js`, authenticated `server-fns.js`, and `AlertStrip.jsx` are wired into telemetry and the dashboard. Rules cover low/critical battery, low fresh water/propane, hot/cold cabin, and recent camera motion. The code is intended to create/update/resolve its own rule-tagged alerts. |
| Automation UI | Rules can be created, edited, enabled/disabled, and deleted through Base44 entities, with schedule/sensor/mode trigger definitions and equipment-action choices. Persisting a rule does not establish a running physical hub automation service. |
| Cameras and photos | Camera records, snapshot display, private-upload signed URLs, still-image uploads, and motion/night preferences are present. The van stage also supports an owner photo. |
| Account/settings | Authenticated routes, account/auth components, editable vehicle details, status refresh, and telemetry setup text are present. |

### Important boundaries to preserve in future work

- The stage currently uses an image with static overlay markers, despite its “Live 3D” label. This source is not an interactive rendered 3D digital twin.
- Camera presentation currently uses snapshot/image sources. “Rec” and FPS labels are not proof of a video stream, recording pipeline, Frigate/NVR integration, or actual camera AI.
- The reviewed hook adjusts both the requested climate setpoint and reported temperature fields together. It does not yet establish the requested-versus-measured/device-confirmed command contract described in the requirements.
- Lock rows share one aggregate lock field; the reviewed source does not establish individual wireless cabinet sensors or per-lock acknowledgements.
- The alert UI uses Resolve/dismiss to update record status. Separate acknowledgement, continuing-fault tracking, and safety interlock behavior still require implementation review and meaningful tests; do not transfer the older Sites prototype's safety-test claims to this Base44 app.
- The Settings text mentions BLE, but the inspected flow uses Base44 entities and an HTTP ingestion endpoint. A working BLE/MQTT device connection, independent local control, and offline operation were not verified.
- Current example/default text includes “2026 Ford Transit / Full Extended High Roof”, whereas the engineering baseline identifies a 2023 High Roof, 148-inch vehicle. Treat this as a configuration discrepancy to reconcile, not proof that my actual vehicle changed. Do not copy sample VINs or private live records into public documentation.
- At this historical review, GitHub contained the two documentation files only. Section 24 records the later source export. Base44 and Sites remain separate deployments.
- Checks performed here were source reads, recent commit inspection, platform status checks, and GitHub/document comparison. No fresh application build/lint/browser interaction or real-hardware test was run, and no checkpoint was restored or created.
- Before publishing this documentation revision after Yes, recheck Base44 again and revise this snapshot if the owner has made further changes.


## 24. Approved consolidation handover — November 16, 2026 (UTC)

### Owner decision and source of truth

The owner asked to combine the useful features of all three prototypes into the preferred Base44 app, fit additions into its existing visual style, avoid duplicate controls/records, and retain its dashboard layout. The owner then answered **Yes** to the completed-result review and GitHub/documentation question. This approval applies to this consolidation batch.

The canonical app is **`6afa3d27af32e7eb7d4b7f76`**. Reach the additions through **Settings → Platform tools**. The dashboard, side rail, bottom dock, visual tokens and current vehicle configuration were preserved by the consolidation. Independent owner changes to trends, navigation, photos and surround-camera features were retained.

The other Base44 app, **`6afa37f6b08b002e832cd188`**, and the private Sites prototype are separate projects. They were read as sources and were not deleted, overwritten or republished. The Sites project is `appgprj_6afa3275943881918b4b1757a5f0779c`.

The reviewed implementation snapshot was **`6a6acaa28fb5f79405d748556a02b98c5fadaa22`**, with restore checkpoint **`6afa629928e4146bdf00e0c9`**, named **Consolidated platform tools — preferred layout preserved**. A fresh Yes-finalization check found that same implementation revision ready, before final documentation and export-hygiene edits. Always check again before later work.

### Consolidated capabilities

| Location | What works in the current prototype | Boundary |
| --- | --- | --- |
| Existing main pages | Original home, climate, water, electrical, security, cameras, modes and rule editor are reused | Their entity updates do not establish physical controller acknowledgements |
| Device hub (`/devices`) | Persistent module registry, search, identity/capability inspection, approvals, connectivity state, stale detection and simulated diagnostics | No real discovery, MQTT or equipment command transport |
| Find my van & items (`/tracking`) | Local/manual parking pin, coordinate validation, real distance/bearing, walking breadcrumbs while open, optional account pin copy and item register | No native background tracking, Apple/Google tracker network, BLE/UWB adapter or offline-map package |
| LPG monitoring (`/lpg`) | Read-only existing propane readings, registry health and LPG alert records | Unknown values stay unknown; no valve/ignition actuation |
| Leveling (`/leveling`) | Pitch/roll and isolated extend/retract/stop simulation with parked, brake, clearance and emergency-stop checks | No physical jack controller |
| Apps & integrations (`/apps`) | Built-in tool launcher preferences, reserved-identity checks, manifest review and external integration plans | No arbitrary executable plugin installer or claimed signed package execution |
| Module updates (`/updates`) | Firmware inventory and simulated update/rollback with retained prior version | No real OTA updater |
| Alert center (`/alerts`) | Reuses the existing Alert entity; filters active/acknowledged/resolved/history | Acknowledgement does not resolve a fault or clear an interlock |
| Simulation lab (`/simulation`) | Original Sites engine, node inspection/connectivity, controls, pause/resume, fault scenarios, interlocks and event/alert history | Isolated from main VanStatus records and hardware |
| Project & consolidation (`/project`) | Phases, checklist, decisions, coverage and downloadable consolidation backup | Progress flags are owner records, not automatic proof of engineering completion |
| Existing Automation page | Six older multi-condition rule plans are readable in the same page; names matching existing rules are reused | Plans are not silently simplified or activated |

The nine platform destinations share the existing ModuleShell/ModuleCard style. The home page was not replaced with a second dashboard. Only a Settings access card and an imported-plan section in Automation extend existing page content.

**Later Base44 work after this export:** after GitHub snapshot `057bfde961939a3f2f49add0b35dbcb1f023d2f2` was verified and pushed, the owner’s Base44 work continued. Observed later revisions included `efca0bf` and `1c123cd` (**Upgrade 3D stage to interactive neon wireframe with tank monitoring**), affecting VanStatus, HomeScreen, VanStage, FordTransit3D, siteWarnings and a new van3dModel helper. Those later dashboard edits are preserved in Base44 but are **not included in this approved source snapshot**. Their runtime/build behavior was not validated as part of this release. Continue future implementation from current Base44, review that newer work, and explicitly export it in a later reviewed batch; do not restore Base44 from this older GitHub snapshot. The 14-test/lint/build results below apply to the verified exported snapshot, not automatically to later edits.

**Intervening owner update preserved:** while this Yes finalization was underway, Base44 advanced to revision **`3c3809310381d416df3b62788fe816a7c2a6059c`**, titled **Rebuild home dashboard with interactive 3D Ford Transit model**. This independent owner change is retained in the export. It adds a procedural Three.js Ford Transit view with drag/orbit and side-aware warning markers, a vehicle-alert toast, fuel/tire fields and displays, gallon-based tank displays, and a Trends navigation entry. It removes the former home TrendCard and older VanModel component. This later home arrangement comes from the owner’s Base44 update, not a duplicate dashboard introduced by consolidation. The model is procedural geometry, not a scanned or dimension-certified digital twin; the fixed tank/fuel capacities and tire-warning thresholds require confirmation against the actual vehicle. Live sensor/OBD ingestion of those new fields was not established by source inspection.

### Imported data, deduplication and privacy

The source Base44 review included 11 modules, 12 plugin entries, 5 tracked items, 2 parking spots, 7 project phases, 10 checklist items, 9 decisions, 6 automations, 6 camera plans, 2 alerts, 32 telemetry rows, 13 control states, 4 commands, 1 vehicle profile and 3 automation runs.

The preferred app now has **12 unique module IDs**: the 11 imported simulation identities plus one optional heater node. Registry refresh reuses module IDs/model identities; repeated browser refresh added **zero duplicates**.

At final review there were **54 unique PlatformRecord keys**: 15 source archive records, 5 tracker records, 2 parking records, 10 checklist items, 9 decisions, 7 mapped phases and 6 integration/launcher preferences. This is a dated count and may change through normal owner use.

- Source sample telemetry and commands remain archive records; they do not overwrite current VanStatus or EnergyReading data.
- Existing preferred Camera and Automation records remain active. Older camera slots and complex rules are explicit plans/archive material, rather than duplicate fake live feeds or duplicated active rules.
- Source User/authentication records and credentials were not migrated.
- New Module, Command and PlatformRecord schemas use owner/admin read boundaries. Module mutation and command dispatch require authenticated admin permission.
- Command requests have explicit simulated/rejected/expired results, correlation IDs and expiry. They do not queue physical actions.
- GitHub receives source/configuration schemas and documentation, **not entity rows, account data, private media, parking coordinates, credentials, environment files or source-app history**.
- A hard-coded sample VIN and its input placeholder were removed during export preparation. Existing stored vehicle data was not changed.
- No repository or app access/visibility change is part of this approval. The GitHub repository was rechecked as **public**; authenticated app routes and record policies remain in place.

### Verification

The reviewed Base44 code passed **`npm run lint`**, **`npm run build`**, and **14 meaningful automated tests** across `tests/platform.test.mjs` and `tests/simulation.test.mjs`.

The tests cover live-command blocking, stale/unapproved/offline nodes, valid zero coordinates and invalid bounds, geographic distance/bearing, leveling interlocks, normalized identities, read-only LPG, frozen offline data/no replay, leak pump/valve inhibition, acknowledgement retention, LPG heater inhibition/no automatic restart, command bounds, pause/resume and fault deduplication/history.

Browser checks verified the Settings gateway, all nine tool pages, imported records, duplicate-free refresh, server-backed simulated diagnostics, simulated update/rollback, leak/LPG interlocks, leveling checks, invalid-coordinate rejection, launcher preference persistence, alert/LPG views, source coverage and imported rule plans. These checks are prototype/browser validation; no real appliance, van, radio or physical actuator was commissioned.

### Approved source export and document arrangement

The reviewed source is exported to the root of **Austin-Texas/TransitOS**, branch **main**, alongside this complete `document.md` and matching `TransitOS_Master_Project_Prompt.md`. This is an explicit source snapshot, not an automatic Base44/GitHub sync. Future work must compare current Base44 before editing or pushing.

The export includes application components/routes, entity schemas, workflows, dependency lockfile, build configuration, the simulator engine, tests, README and `docs/CONSOLIDATION.md`. Generated build output, dependencies, local Base44 link metadata, credentials, live data and private source archives are excluded.

Both master documents retain all earlier architecture, the 10-inch display requirement, hardware boundaries, owner policy, historical reviews and this current handover. Their text must remain identical when future approved updates change the project. The GitHub commit/write result is reported separately after verification; a push alone does not deploy a separate van controller or update Sites.

### Remaining work and source retirement

Keep both older apps until the owner reviews the preferred app and consolidation backup, verifies referenced private media/files, and separately requests deletion. This Yes approves consolidation finalization, not source-app deletion.

Next priorities are real hardware/protocol selection and commissioning; the requested-versus-measured command contract in existing main controls; local/offline service operation; real camera/NVR pipelines; supported tracker adapters and offline navigation; signed plugin/update infrastructure; and confirming the physical van/display specifications. Preserve the preferred layout while implementing them gradually.

**My immediate request for this new chat:** [Replace this line with the next change, question, or build task, or leave it blank for the read-only project review above.]

