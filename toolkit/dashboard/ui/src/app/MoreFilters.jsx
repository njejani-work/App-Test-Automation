// The "Filters" popover: environment, platform and "Only mine" (and, on small screens, build / suite / run too).
// The button says how many filters are set.
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FilterSelect } from './FilterSelect.jsx';
import { store } from '@/lib/store.js';

export function MoreFilters({ S, go, opts }) {
  const [me, setMe] = useState(() => store.get('egDashMe', ''));
  const n = ['build', 'suite', 'run', 'env', 'platform', 'q'].filter((k) => S[k]).length + (S.mine ? 1 : 0);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="bg-card/60" aria-label={n ? `Filters, ${n} set` : 'Filters'}>
          <SlidersHorizontal /> Filters{n ? <span className="font-mono text-primary">· {n}</span> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-80 flex-col gap-3">
        <div className="flex flex-col gap-3 xl:hidden">
          <FilterSelect wide label="Build" value={S.build} options={opts.build} allLabel="All builds" onChange={(v) => go({ build: v, run: '' })} />
          <FilterSelect wide label="Suite" value={S.suite} options={opts.suite} allLabel="All suites" onChange={(v) => go({ suite: v, run: '' })} />
          <FilterSelect wide label="Run" value={S.run} options={opts.run} allLabel="Latest run" onChange={(v) => go({ run: v })} />
        </div>
        <FilterSelect wide label="Env" value={S.env} options={opts.env} allLabel="All envs" onChange={(v) => go({ env: v, run: '' })} />
        <FilterSelect wide label="Platform" value={S.platform} options={opts.platform} allLabel="All platforms" onChange={(v) => go({ platform: v, run: '' })} />
        <div className="flex flex-col gap-1.5 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="size-4 accent-[var(--primary)]" checked={S.mine} disabled={!me} onChange={(e) => go({ mine: e.target.checked })} />
            Only issues owned by or assigned to me
          </label>
          <Input value={me} placeholder="Your name, as in test/triage.json" aria-label="Your name"
            onChange={(e) => { setMe(e.target.value); store.set('egDashMe', e.target.value.trim()); }} />
        </div>
        {n > 0 && <Button variant="ghost" size="sm" onClick={() => go({ build: '', suite: '', run: '', env: '', platform: '', q: '', mine: false })}>Clear all filters</Button>}
      </PopoverContent>
    </Popover>
  );
}
