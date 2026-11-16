import test from 'node:test';
import assert from 'node:assert/strict';
import { moduleHealth, commandDecision, recordKey, bearingDistance, validatePin, levelingCommand, MODULE_CATALOG } from '../src/lib/platform-domain.js';

test('hardware commands are blocked even when a registry entry claims online and approved',()=>{
  const m={environment:'live',approved:true,connection_status:'online',last_seen:new Date().toISOString()};
  assert.equal(commandDecision(m,'firmware.simulate').result,'rejected');
  assert.match(commandDecision(m,'diagnostics').message,/Nothing was sent or queued/);
});
test('stale or disconnected simulation nodes cannot be confirmed',()=>{
  const now=Date.now(),m={environment:'simulation',approved:true,connection_status:'online',last_seen:new Date(now-61000).toISOString()};
  assert.equal(moduleHealth(m,now),'stale');
  assert.equal(commandDecision(m,'diagnostics',now).result,'rejected');
  m.last_seen=new Date(now).toISOString();m.connection_status='offline';
  assert.equal(commandDecision(m,'diagnostics',now).result,'rejected');
  m.connection_status='online';assert.equal(commandDecision(m,'diagnostics',now).result,'confirmed_simulated');
  m.approved=false;assert.equal(commandDecision(m,'diagnostics',now).result,'rejected');
});
test('equator and prime-meridian coordinates are valid, invalid bounds are rejected',()=>{
  assert.equal(validatePin({lat:0,lng:0}),true);
  assert.equal(validatePin({lat:91,lng:0}),false);
  assert.equal(validatePin({lat:0,lng:181}),false);
  assert.equal(validatePin({lat:NaN,lng:0}),false);
  assert.equal(bearingDistance(null,{lat:0,lng:0}),null);
});
test('bearing and distance use real coordinates and handle same-location pins',()=>{
  const east=bearingDistance({lat:0,lng:0},{lat:0,lng:1});
  assert.ok(east.meters>111000&&east.meters<112000);
  assert.ok(Math.abs(east.bearing-90)<0.001);
  assert.equal(bearingDistance({lat:0,lng:0},{lat:0,lng:0}).meters,0);
});
test('leveling requires every local interlock and emergency stop wins',()=>{
  const s={parked:true,brake:true,clear:true,emergency:false,jacks:'stowed'};
  for(const key of ['parked','brake','clear'])assert.equal(levelingCommand({...s,[key]:false},'extend').jacks,'stowed');
  assert.equal(levelingCommand({...s,emergency:true},'extend').jacks,'stowed');
  assert.equal(levelingCommand(s,'extend').jacks,'extended');
  assert.equal(levelingCommand({...s,moving:true},'stop').moving,false);
});
test('catalog identities are unique and record keys deduplicate normalized names',()=>{
  assert.equal(new Set(MODULE_CATALOG.map(m=>m.module_id)).size,MODULE_CATALOG.length);
  assert.equal(recordKey('tracker',' My Keys '),recordKey('tracker','my keys'));
});
