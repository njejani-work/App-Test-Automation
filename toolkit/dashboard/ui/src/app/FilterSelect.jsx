// One labelled filter: a shadcn Select whose first choice means "no filter" (Radix needs a non-empty value for it).
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = '__all';

/** `wide`: fill the width (in the Filters popover) instead of the compact header size. */
export function FilterSelect({ label, value, options, allLabel, onChange, className, wide = false }) {
  return (
    <div className={cn('min-w-0', !wide && 'max-w-52 flex-1 basis-36', className)}>
      <Select value={value || ALL} onValueChange={(v) => onChange(v === ALL ? '' : v)}>
        <SelectTrigger size="sm" aria-label={label} className={cn('w-full min-w-0 bg-card/60 [&_[data-slot=select-value]]:truncate', value && 'border-primary/60 text-foreground')}>
          <span className={cn('text-muted-foreground', !wide && 'hidden 2xl:inline')}>{label}:</span><SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((o) => <SelectItem key={o.value} value={o.value}><span className="font-mono text-xs">{o.label}</span></SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
