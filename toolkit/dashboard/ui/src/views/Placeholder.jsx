// A view not built yet: what it will show, in which step, and a link to the same view in the current dashboard.
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/magic/blur-fade';
import { viewOf } from '@/app/views.js';

export function Placeholder({ tab, children }) {
  const v = viewOf(tab);
  const legacy = 'index.html' + location.hash.replace(/^#\/overview/, '#/triage');
  return (
    <BlurFade key={tab} delay={0.05} className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display"><v.icon className="size-5 text-link" />{v.label}</CardTitle>
          <CardDescription>{v.about}. This view is built in step {v.step} of the redesign.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" size="sm"><a href={legacy}><ExternalLink />Open it in the current dashboard</a></Button>
        </CardContent>
      </Card>
      {children}
    </BlurFade>
  );
}
