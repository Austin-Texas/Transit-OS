import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireUser } from '@/lib/auth-middleware';
import { commandDecision, MODULE_CATALOG } from '@/lib/platform-domain';

const rows=value=>Array.isArray(value)?value:(value?.items??[]);
const admin=context=>{if(context.user.role!=='admin')throw new Error('Owner/admin permission is required for module changes.');};

export const prepareSimulationModules=createServerFn({method:'POST'}).middleware([requireUser]).handler(async({context})=>{
  admin(context);
  const e=context.getBase44().entities;
  const existing=rows(await e.Module.list({limit:500}));
  let created=0;
  for(const sample of MODULE_CATALOG){
    const found=existing.find(m=>m.module_id===sample.module_id);
    if(found){if(found.environment==='simulation')await e.Module.update(found.id,{last_seen:new Date().toISOString()});continue;}
    const saved=await e.Module.create({...sample,environment:'simulation',connection_status:sample.module_id==='aux-01'?'offline':'online',last_seen:new Date().toISOString(),firmware:'0.1.0-sim',approved:true,rssi:-55,notes:'Simulated registry node. No physical hardware is connected.'});
    existing.push(saved);created++;
  }
  return {created,message:`${created} simulated nodes added. Existing identities were preserved.`};
});

export const dispatchPlatformCommand=createServerFn({method:'POST'}).middleware([requireUser])
  .validator(z.object({moduleId:z.string().min(1).max(64),action:z.enum(['diagnostics','firmware.simulate','firmware.rollback']),version:z.string().max(40).optional(),correlationId:z.string().uuid(),expiresAt:z.string().datetime()}))
  .handler(async({data,context})=>{
    admin(context);
    const e=context.getBase44().entities;
    const previous=rows(await e.Command.filter({correlation_id:data.correlationId},{limit:1}))[0];
    if(previous)return previous;
    const module=rows(await e.Module.filter({module_id:data.moduleId},{limit:1}))[0];
    const expired=Date.parse(data.expiresAt)<=Date.now()||Date.parse(data.expiresAt)>Date.now()+65000;
    let decision=expired?{result:'expired',message:'Request expired or invalid. Nothing was queued.'}:commandDecision(module,data.action);
    if(decision.result==='confirmed_simulated'){
      if(data.action==='firmware.simulate'){
        if(!/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(data.version??''))decision={result:'rejected',message:'Enter a version such as 0.2.0-sim.'};
        else await e.Module.update(module.id,{previous_firmware:module.firmware??'unknown',firmware:data.version,last_seen:new Date().toISOString()});
      }else if(data.action==='firmware.rollback'){
        if(!module.previous_firmware)decision={result:'rejected',message:'No simulated rollback version is retained.'};
        else await e.Module.update(module.id,{firmware:module.previous_firmware,previous_firmware:module.firmware,last_seen:new Date().toISOString()});
      }
    }
    return e.Command.create({correlation_id:data.correlationId,module_id:data.moduleId,action:data.action,...decision,actor:context.user.id,environment:module?.environment??'unknown',requested_at:new Date().toISOString(),expires_at:data.expiresAt});
  });
