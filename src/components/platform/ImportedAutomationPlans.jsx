import { Link } from '@tanstack/react-router';
import { Workflow } from 'lucide-react';
import ModuleCard from '@/components/dash/ModuleCard';
import { ErrorNote, useRecords } from '@/components/platform/shared';

const normalized = value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');

export default function ImportedAutomationPlans({ activeRules = [] }) {
  const store = useRecords('PlatformRecord');
  const archive = store.records.find(record => record.kind === 'archive' && record.properties?.entity === 'Automation');
  const plans = (archive?.properties?.records || []).filter(plan =>
    !activeRules.some(rule => normalized(rule.name || rule.title) === normalized(plan.name))
  );
  if (!plans.length && !store.error) return null;
  return (
    <ModuleCard title="Imported rule plans" icon={Workflow}>
      <ErrorNote error={store.error} />
      <p className="mb-3 text-[11.5px] leading-relaxed text-white/50">
        Preserved from the other prototype. These multi-condition plans are inactive here and need compatible sensors,
        actions and controller confirmation before activation. Existing rules with the same name are reused.
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {plans.map(plan => (
          <details key={plan.id || plan.name} className="rounded-xl border border-line/80 bg-surface-raised p-3">
            <summary className="cursor-pointer text-[12px] font-semibold text-white/75">{plan.name}</summary>
            <p className="mt-3 text-[11px] text-white/50">{plan.description}</p>
            <p className="mt-2 font-mono text-[10px] text-sys-blue">{plan.trigger}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[11px] text-white/50">
              {(plan.actions || []).map((action, index) => <li key={index}>{action}</li>)}
            </ul>
            {plan.requires_confirmation && <p className="mt-2 text-[10px] text-amber-300">Controller confirmation required.</p>}
          </details>
        ))}
      </div>
      <Link to="/simulation" className="mt-3 inline-flex rounded-xl border border-sys-blue/40 bg-sys-blue/10 px-3 py-2 text-[11px] text-sys-blue">
        Test leak and LPG interlocks in Simulation lab
      </Link>
    </ModuleCard>
  );
}
