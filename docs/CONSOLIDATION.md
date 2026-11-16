# TransitOS preferred-app consolidation

Review date: 2026-11-16 (UTC)

## Canonical app

The preferred Base44 app is `6afa3d27af32e7eb7d4b7f76`. The home dashboard, navigation, styling and current vehicle configuration are retained. Independent changes made in the Base44 builder during this work are preserved. Additional tools use the existing ModuleShell and ModuleCard components, reached through Settings → Platform tools.

## Coverage

| Source capability | Consolidated location | Implementation status |
| --- | --- | --- |
| Existing preferred dashboard, cameras, climate, electrical, water, security, modes and rules | Original pages | Reused rather than copied |
| Module registry and diagnostics | Device hub | Persistent registry; commands confirm only in simulation |
| Firmware inventory and rollback | Module updates | Simulated version changes with retained rollback; physical OTA not connected |
| Site fault scenarios, offline blocking, interlocks and event history | Simulation lab | Original simulator engine reused; isolated from vehicle records |
| Leveling | Leveling | Local simulation with parked, brake, clearance and emergency-stop interlocks |
| Propane | LPG monitoring | Read-only view of existing records; unavailable values remain unknown |
| Parking and item tracking | Find my van & items | Phone/local parking pin, validation, real distance/bearing, breadcrumbs and item register; hardware tracker adapters remain planned |
| Plugin catalog | Apps & integrations | Working tool launcher preferences and manifest review; external integrations are plans |
| Alerts | Alert center | Reuses existing Alert entity; acknowledgement does not resolve a fault |
| Project phases, checklist and decisions | Project & consolidation | Persistent records and downloadable consolidation backup |
| Older multi-condition automation ideas | Existing Automation page → Imported rule plans | Read-only source plans, filtered against existing rule names; not silently activated |

## Record migration

The broader Base44 source app is `6afa37f6b08b002e832cd188`. It was inspected and read without editing it. The private Sites simulator was read without editing or publishing it.

- Imported 11 module identities and added one optional HTR simulation node: 12 current unique module IDs.
- 54 unique PlatformRecord keys: 15 source archives, 5 trackers, 2 parking records, 10 checklist items, 9 decisions, 7 roadmap phases and 6 integration/launcher preferences.
- The 15 source archives preserve source entity rows for review, including sample telemetry, control states, camera plans and automation runs. They are not active telemetry or physical devices.
- Existing preferred Camera, Automation, VanStatus, EnergyReading and other current records were retained. Sample records from the older app do not overwrite them.
- Source User records, credentials and authentication settings were not migrated.
- New private archive/registry records are restricted to their owner or an admin. Module mutation and command dispatch require an admin.
- Registry refresh and record saves reuse existing identities. Browser refresh checks added zero duplicate nodes; entity queries confirmed 12 distinct module IDs and 54 distinct record keys.

## Validation

- `npm run lint`: passed.
- `node --test tests/platform.test.mjs tests/simulation.test.mjs`: 14 passed.
- `npm run build`: passed.
- Browser review: Settings gateway, nine platform tools, imported modules/trackers, duplicate-free registry refresh, simulated diagnostic confirmation, update and rollback, leak pump inhibition, LPG heater inhibition, acknowledgement retention, leveling interlocks, invalid-coordinate handling, integration launcher preference, LPG, alerts, source coverage and imported automation plans.

## Remaining work and retirement rule

No source app has been deleted. Before retiring a source, review the consolidation backup and any private media or file references. Source camera slots and multi-condition rules remain explicit plans until their adapters and execution semantics are implemented and tested. Real MQTT/ESP32 transport, hardware commissioning, physical OTA, signed plugin execution, BLE/UWB/Apple/Google tracker integration and a genuine offline-map package are not claimed by this prototype.

The owner approved the reviewed consolidation with Yes on 2026-11-16 (UTC). Current Base44 state was rechecked before finalization. The approved source snapshot and synchronized document.md / TransitOS_Master_Project_Prompt.md are prepared for Austin-Texas/TransitOS, main. The repository is public; the export excludes entity rows, credentials, private media and generated output. A hard-coded sample VIN was removed from source defaults/placeholders without changing stored vehicle records. GitHub write verification is reported separately after the write. Future batches still require the owner's review; a No means continue working. Do not delete old apps without a separate instruction.
