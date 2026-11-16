export const MODULE_CATALOG = [
  ['tcu-1-pro','TCU-1 Pro','Main controller','Central service bay',['registry','telemetry','diagnostics']],
  ['clm-01','CLM-01','Climate','Roof climate zone',['temperature','humidity','supported thermostat']],
  ['htr-01','HTR-01','Heater','Under-seat service bay',['heater status','supported setpoint']],
  ['wtr-01','WTR-01','Water & valves','Utility cabinet',['tank levels','leak','pump','water valves']],
  ['lpg-01','LPG-01','Propane monitor','Approved external sensor',['tank level','alarm input','monitoring only']],
  ['pwr-01','PWR-01','Energy','Electrical cabinet',['voltage','charge','solar','load']],
  ['lvl-01','LVL-01','Leveling','Approved leveling controller',['pitch','roll','supervised status']],
  ['sec-01','SEC-01','Security','Living space',['door contacts','tamper','accessory locks']],
  ['env-01','ENV-01','Environment','Living space',['air quality','occupancy','humidity']],
  ['aux-01','AUX-IO','Extra sensors','Rear service bay',['isolated I/O','additional sensors']],
].map(([module_id,model,name,location,capabilities])=>({module_id,model,name,location,capabilities}));

export const TOOLS = [
  {to:'/devices',title:'Device hub',detail:'One controller and expansion registry. Identity, capabilities and last seen.',icon:'Cpu'},
  {to:'/tracking',title:'Find my van & items',detail:'Phone parking pin, bearing, breadcrumbs and your item register.',icon:'MapPin'},
  {to:'/lpg',title:'LPG monitoring',detail:'Propane readings and sensor status. Monitoring only.',icon:'Flame'},
  {to:'/leveling',title:'Leveling',detail:'Pitch, roll and a supervised, isolated leveling simulator.',icon:'MoveVertical'},
  {to:'/apps',title:'Apps & integrations',detail:'Built-in tools and an integration planning catalog.',icon:'LayoutGrid'},
  {to:'/updates',title:'Module updates',detail:'Firmware inventory, simulated update and rollback checks.',icon:'DownloadCloud'},
  {to:'/project',title:'Project & consolidation',detail:'Roadmap, checklist, decisions, backup and coverage.',icon:'ClipboardList'},
  {to:'/alerts',title:'Alert center',detail:'Existing alerts with acknowledgement and history.',icon:'Bell'},
  {to:'/simulation',title:'Simulation lab',detail:'Wireless map, faults, safe controls and an activity log.',icon:'FlaskConical'},
];

export function moduleHealth(module,now=Date.now()) {
  if(module.connection_status==='offline') return 'offline';
  if(module.environment!=='simulation' && module.environment!=='live') return 'planned';
  const stamp=new Date(module.last_seen).getTime();
  if(!Number.isFinite(stamp)||now-stamp>60000) return 'stale';
  if(module.connection_status==='degraded') return 'degraded';
  return 'online';
}

export function commandDecision(module,action,now=Date.now()) {
  if(!module) return {result:'rejected',message:'Module not registered. Nothing was queued.'};
  if(module.environment!=='simulation') return {result:'rejected',message:'No physical command bridge is commissioned. Nothing was sent or queued.'};
  if(!module.approved) return {result:'rejected',message:'Approve this simulated module first.'};
  if(moduleHealth(module,now)!=='online') return {result:'rejected',message:'Module is offline, degraded or stale. Nothing was queued.'};
  if(!['diagnostics','firmware.simulate','firmware.rollback'].includes(action)) return {result:'rejected',message:'Unsupported command.'};
  return {result:'confirmed_simulated',message:'Confirmed in simulation only. No equipment command was sent.'};
}

export const recordKey=(kind,value)=>`${kind}:${String(value).trim().toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-|-$/g,'')}`;

export function validatePin(pin) {
  return pin && Number.isFinite(pin.lat)&&Number.isFinite(pin.lng)&&Math.abs(pin.lat)<=90&&Math.abs(pin.lng)<=180;
}

export function bearingDistance(from,to) {
  if(!validatePin(from)||!validatePin(to)) return null;
  const rad=n=>n*Math.PI/180, a=rad(from.lat), b=rad(to.lat), dlat=b-a, dlon=rad(to.lng-from.lng);
  const h=Math.sin(dlat/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(dlon/2)**2;
  const meters=6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
  const bearing=(Math.atan2(Math.sin(dlon)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(dlon))*180/Math.PI+360)%360;
  return {meters,bearing};
}

export function levelingCommand(state,action) {
  if(!['extend','retract','stop'].includes(action)) return {...state,message:'Unsupported action.'};
  if(action==='stop') return {...state,moving:false,message:'Simulated emergency stop applied.'};
  if(!state.parked||!state.brake||!state.clear||state.emergency) return {...state,moving:false,message:'Blocked: park, brake, clearance and emergency-stop checks must pass.'};
  return {...state,moving:false,jacks:action==='extend'?'extended':'stowed',message:'Applied in simulation. No real jacks moved.'};
}

export const PHASES = [
  ['interface','Preferred dashboard','Preserve the existing layout and integrate secondary tools.'],
  ['contracts','Device contracts & simulator','Identity, stale data, command feedback and isolated fault tests.'],
  ['hardware','Protected sensor bench','One read-only ESP32 node, power and RF checks.'],
  ['controller','Local controller','MQTT, local services, offline behavior and recovery.'],
  ['mobile','Mobile & navigation','Phone permissions, local parking pin and compatible trackers.'],
  ['video','Cameras & recording','Verify actual streams, recording, retention and compute.'],
  ['integration','Approved appliance integration','Commission supported interfaces and independent safeguards.'],
  ['release','Release & installation','OTA recovery, backups, installation guide and acceptance tests.'],
];

export const INTEGRATIONS = [
  {key:'module-tools',title:'Module tools',route:'/devices',builtIn:true,permissions:['registry read','simulated diagnostics']},
  {key:'parking',title:'Find my van',route:'/tracking',builtIn:true,permissions:['phone location on request','browser-local storage']},
  {key:'simulator',title:'Fault simulator',route:'/simulation',builtIn:true,permissions:['isolated browser simulation']},
  {key:'hvac',title:'Appliance adapter',builtIn:false,permissions:['manufacturer-supported interface']},
  {key:'mqtt',title:'Local MQTT bridge',builtIn:false,permissions:['per-device credentials','local network']},
  {key:'frigate',title:'Frigate / NVR',builtIn:false,permissions:['approved camera streams','recording storage']},
  {key:'tracker',title:'BLE / GPS tracker adapter',builtIn:false,permissions:['compatible hardware','location consent']},
  {key:'matter',title:'Matter / Zigbee devices',builtIn:false,permissions:['compatible radio','approved device access']},
];
