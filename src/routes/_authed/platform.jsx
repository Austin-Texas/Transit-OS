import { createFileRoute, Link } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import { PlatformPage, Card, Note } from '@/components/platform/shared';
import { TOOLS } from '@/lib/platform-domain';

export const Route=createFileRoute('/_authed/platform')({head:()=>({meta:[{title:'TransitOS — Platform tools'}]}),component:Platform});
function Platform(){return <PlatformPage title='Platform tools' subtitle='The rest of TransitOS, within your preferred dashboard'><Note>Your existing climate, water, electrical, security, cameras and automation screens remain the single controls for those systems. New tools share this app and its visual style. Hardware-dependent features stay explicit.</Note><div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>{TOOLS.map(tool=>{const Icon=Icons[tool.icon];return <Link key={tool.to} to={tool.to} aria-label={tool.title} className='block rounded-2xl outline-none transition hover:ring-1 hover:ring-sys-blue/50 focus-visible:ring-2 focus-visible:ring-sys-blue'><Card title={tool.title} icon={Icon}><p className='text-[11.5px] leading-relaxed text-white/50'>{tool.detail}</p><span className='mt-3 inline-block text-[11px] font-semibold text-sys-blue'>Open →</span></Card></Link>;})}</div></PlatformPage>;}
