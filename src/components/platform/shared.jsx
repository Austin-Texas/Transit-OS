import { useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Layers } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ModuleShell from '@/components/dash/ModuleShell';
import ModuleCard from '@/components/dash/ModuleCard';
import useVanDashboard from '@/hooks/useVanDashboard';

export { ModuleCard as Card };
export const fieldClass='w-full rounded-xl border border-line/80 bg-surface-raised px-3 py-2 text-[12px] text-white outline-none focus:border-sys-blue/60';
export const panelText='text-[11.5px] leading-relaxed text-white/50';
export const rowsOf=value=>Array.isArray(value)?value:(value?.items??[]);

export function Button({children,onClick,disabled,type='button',tone='normal',...props}) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${tone==='danger'?'border-alert/40 bg-alert/10 text-alert':'border-sys-blue/35 bg-sys-blue/10 text-sys-blue hover:bg-sys-blue/20'}`} {...props}>{children}</button>;
}
export function Field({label,children,...props}) {return <label className='block space-y-1'><span className='text-[10px] uppercase tracking-wider text-white/45'>{label}</span>{children??<input className={fieldClass} {...props}/>}</label>;}
export function Note({children}) {return <p className='rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[11px] leading-relaxed text-white/50'>{children}</p>;}
export function ErrorNote({error}) {return error?<p role='alert' className='rounded-xl border border-alert/35 bg-alert/10 p-3 text-[12px] text-alert'>{error}</p>:null;}
export function Badge({children,tone='normal'}) {return <span className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-widest ${tone==='warning'?'border-alert/40 text-alert':'border-sys-blue/35 text-sys-blue'}`}>{children}</span>;}
export function Empty({children}) {return <p className='rounded-xl border border-dashed border-line/80 p-6 text-center text-[12px] text-white/40'>{children}</p>;}

export function PlatformPage({title,subtitle,children}) {
  const {status}=useVanDashboard();
  return <ModuleShell title={title} subtitle={subtitle} status={status} meta={title==='Platform tools'?null:<Link to='/platform' className='inline-flex items-center gap-1 rounded-xl border border-line px-3 py-2 text-[11px] text-sys-blue'><ArrowLeft className='h-3 w-3'/>Platform tools</Link>}>{children}</ModuleShell>;
}

export function PlatformAccess() {return <ModuleCard title='Platform tools' icon={Layers}><p className={`${panelText} mb-3`}>Devices, tracking, LPG, leveling, integrations, updates and simulation in the same TransitOS app.</p><Link to='/platform' className='inline-flex rounded-xl border border-sys-blue/40 bg-sys-blue/10 px-4 py-2 text-[12px] font-semibold text-sys-blue'>Open platform tools</Link></ModuleCard>;}

export function useRecords(entity) {
  const [records,setRecords]=useState([]),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const refresh=useCallback(async()=>{try{const page=await base44.entities[entity].list({sort:'-created_date',limit:500});setRecords(rowsOf(page));setError('');}catch(e){setError(e?.message||'Unable to load records.');}finally{setLoading(false);}},[entity]);
  useEffect(()=>{refresh();const off=base44.entities[entity].subscribe(()=>refresh());return ()=>off();},[entity,refresh]);
  const run=useCallback(async work=>{setBusy(true);setError('');try{const value=await work();await refresh();return value;}catch(e){setError(e?.message||'Unable to save this change.');return null;}finally{setBusy(false);}},[refresh]);
  const save=useCallback((data,id)=>run(async()=>{
    let existing=id;
    const unique=data.key?{key:data.key}:data.module_id?{module_id:data.module_id}:null;
    if(!existing&&unique){const found=rowsOf(await base44.entities[entity].filter(unique,{limit:1}));existing=found[0]?.id;}
    return existing?base44.entities[entity].update(existing,data):base44.entities[entity].create(data);
  }),[entity,run]);
  const remove=useCallback(id=>run(()=>base44.entities[entity].delete(id)),[entity,run]);
  return {records,loading,busy,error,refresh,save,remove,run};
}

export function useBrowserStore(key,initial) {
  const [value,setValue]=useState(initial),[ready,setReady]=useState(false),[error,setError]=useState('');
  useEffect(()=>{try{const saved=localStorage.getItem(key);if(saved)setValue(JSON.parse(saved));}catch{setError('Browser storage could not be read.');}setReady(true);},[key]);
  useEffect(()=>{if(!ready)return;try{localStorage.setItem(key,JSON.stringify(value));}catch{setError('Browser storage is unavailable; changes will last only for this session.');}},[key,value,ready]);
  return [value,setValue,{ready,error}];
}
