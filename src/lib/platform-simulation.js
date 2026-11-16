export const MODULES = [
  { id:'clm', model:'CLM-01', name:'HVAC', location:'Roof · climate zone', icon:'climate', capabilities:'Monitor + simulated control', rssi:-48, firmware:'0.4.2', controls:true },
  { id:'htr', model:'HTR-01', name:'Cabin heater', location:'Under-seat service bay', icon:'heater', capabilities:'Monitor + simulated control', rssi:-53, firmware:'0.4.2', controls:true },
  { id:'lpg', model:'LPG-01', name:'LPG monitor', location:'External tank sensor', icon:'gas', capabilities:'Monitoring only', rssi:-57, firmware:'0.3.8', controls:false },
  { id:'wtr', model:'WTR-01', name:'Water & valves', location:'Rear utility cabinet', icon:'water', capabilities:'Monitor + simulated control', rssi:-50, firmware:'0.4.1', controls:true },
  { id:'env', model:'ENV-01', name:'Environment', location:'Living area', icon:'sensor', capabilities:'Monitoring only', rssi:-61, firmware:'0.4.2', controls:false },
  { id:'pwr', model:'PWR-01', name:'Energy monitor', location:'Electrical cabinet', icon:'energy', capabilities:'Monitoring only', rssi:-46, firmware:'0.3.9', controls:false },
  { id:'aux', model:'AUX-01', name:'Utility sensors', location:'Rear storage bay', icon:'layers', capabilities:'Monitoring only', rssi:-79, firmware:'0.3.5', controls:false }
];
export function createSimulation(now=Date.now()) {
  const state = { paused:false, startedAt:now, sequence:0, modules:Object.fromEntries(MODULES.map(m=>[m.id,{online:m.id!=='aux',lastSeen:now-(m.id==='aux'?194000:0)}])), readings:{cabin:72.4,humidity:43,air:18,battery:84,voltage:13.2,solar:240,fresh:72,grey:28,lpg:68,lpgPpm:0,lpgAlarm:false,leak:false,waterTemp:61,utilityTemp:64.8,door:'Closed'}, controls:{hvacMode:'Auto',hvacTarget:72,heater:false,heaterTarget:68,pump:false,inlet:false}, faults:{leak:false,gas:false}, alerts:[], events:[] };
  function event(message,kind='info'){state.events.unshift({id:++state.sequence,message,kind,time:Date.now()});state.events=state.events.slice(0,50);}
  function alert(key,title,detail,severity='warning'){if(!state.alerts.find(a=>a.key===key&&a.active)){state.alerts.unshift({id:++state.sequence,key,title,detail,severity,active:true,ack:false,time:Date.now()});event(title,severity);}}
  function resolve(key){state.alerts.filter(a=>a.key===key&&a.active).forEach(a=>{a.active=false;event(`Resolved: ${a.title}`,'success');});}
  alert('offline-aux','Utility sensors offline','AUX-01 has missed its heartbeat. Last readings are stale.');
  function command(id,key,value){
    const fail = message=>{event(message,'warning');return {ok:false,message};};
    if(!MODULES.find(m=>m.id===id)?.controls) return fail('This module is monitoring only.');
    if(!state.modules[id]?.online) return fail('Module offline. Command blocked; no requests are queued.');
    if(state.paused) return fail('Simulation paused. Resume the simulator before changing controls.');
    const keys={clm:['hvacMode','hvacTarget'],htr:['heater','heaterTarget'],wtr:['pump','inlet']};
    if(!keys[id]?.includes(key))return fail('Unsupported control.');
    if(key==='hvacMode'&&!['Off','Auto','Cool','Fan'].includes(value)) return fail('Unsupported climate mode.');
    if(key==='hvacTarget'&&(!Number.isFinite(value)||value<60||value>82)) return fail('HVAC setpoint must be 60–82°F.');
    if(key==='heaterTarget'&&(!Number.isFinite(value)||value<50||value>78))return fail('Heater setpoint must be 50–78°F.');
    if(['heater','pump','inlet'].includes(key)&&typeof value!=='boolean')return fail('Invalid switch value.');
    if(state.faults.leak&&id==='wtr'&&value===true)return fail('Leak interlock active. Clear the simulated leak before enabling water controls.');
    if(state.faults.gas&&id==='htr'&&value===true)return fail('LPG alert interlock active. Clear the simulated alert before enabling the heater.');
    state.controls[key]=value;event(`Simulation applied: ${key} → ${typeof value==='boolean'?(value?'on':'off'):value}`,'success');return {ok:true,message:'Applied in simulation. No hardware command sent.'};
  }
  function setOnline(id,online){
    if(!state.modules[id])return;
    state.modules[id].online=online;
    if(online){state.modules[id].lastSeen=Date.now();resolve(`offline-${id}`);event(`${MODULES.find(m=>m.id===id).model} reconnected`,'success');}
    else{state.modules[id].lastSeen=Date.now();alert(`offline-${id}`,`${MODULES.find(m=>m.id===id).name} offline`,'Wireless heartbeat lost. Values are stale; controls are blocked.');event('Pending commands discarded. No replay on reconnect.');}
  }
  function inject(type){
    if(type==='leak'){state.faults.leak=true;if(state.modules.wtr.online&&!state.paused)state.readings.leak=true;state.controls.pump=false;state.controls.inlet=false;alert('leak','Water leak detected','Simulated local interlock stopped the pump and closed the inlet valve.','critical');}
    if(type==='gas'){state.faults.gas=true;if(state.modules.lpg.online&&!state.paused){state.readings.lpgPpm=1200;state.readings.lpgAlarm=true;}state.controls.heater=false;alert('gas','LPG alarm input active','Simulated alarm input. Heater inhibited in the simulator. LPG remains monitoring only.','critical');}
    if(type==='hvac-offline')setOnline('clm',false);
    if(type==='lpg-offline')setOnline('lpg',false);
    if(type==='weak-signal') {setOnline('aux',true);state.modules.aux.weak=true;alert('weak-aux','Utility sensors signal weak','AUX-01 is connected at −79 dBm. Improve coverage before hardware commissioning.');}
  }
  function clearFaults(){state.faults={leak:false,gas:false};state.readings.lpgPpm=0;state.readings.lpgAlarm=false;state.readings.leak=false;for(const id of Object.keys(state.modules)){if(!state.modules[id].online)setOnline(id,true);delete state.modules[id].weak;}state.alerts.filter(a=>a.active).forEach(a=>{a.active=false;event(`Resolved: ${a.title}`,'success');});event('Nominal scenario restored. Outputs remain at their current safe settings.','success');}
  function acknowledge(id){const a=state.alerts.find(a=>a.id===id);if(a){a.ack=true;event(`Acknowledged: ${a.title}`);}}
  function pause(){state.paused=!state.paused;event(state.paused?'Simulator paused. Telemetry is frozen; controls are blocked.':'Simulator resumed.','info');if(!state.paused)tick();}
  function tick(now=Date.now()){if(state.paused)return;for(const m of Object.values(state.modules))if(m.online)m.lastSeen=now;if(state.modules.lpg.online){state.readings.lpgAlarm=state.faults.gas;state.readings.lpgPpm=state.faults.gas?1200:0;}if(state.modules.wtr.online)state.readings.leak=state.faults.leak;const p=(now-state.startedAt)/20000;if(state.modules.clm.online)state.readings.cabin=+(72.4+Math.sin(p)*0.3).toFixed(1);if(state.modules.env.online){state.readings.humidity=Math.round(43+Math.sin(p/2)*2);state.readings.air=Math.round(18+Math.sin(p/3)*2);}if(state.modules.pwr.online)state.readings.solar=Math.round(240+Math.sin(p)*12);}
  return {state,command,setOnline,inject,clearFaults,acknowledge,pause,tick};
}
