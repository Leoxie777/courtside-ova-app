import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Section } from './ui-kit';
import { useStore } from '@/lib/store';
import { nextUrgent } from '@/lib/home-features';
import { products, sponsors } from '@/lib/promotions';
import merchandise from '@/assets/merchandise.jpg';
import raffle from '@/assets/raffle.png';

// Closed for this app visit only; reopening/reloading the app shows the pop-up again.
let closedThisVisit = false;
export function UrgentAnnouncement() {
  const { announcements } = useStore();
  const [closed, setClosed] = useState(closedThisVisit);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const current = ready && !closed ? nextUrgent(announcements, []) : undefined;
  const dismiss = () => { closedThisVisit = true; setClosed(true); };
  return <Dialog open={!!current} onOpenChange={open => { if (!open) dismiss(); }}><DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg border-live bg-card">
    <span className="flex items-center gap-2 text-sm font-bold uppercase text-destructive"><AlertTriangle className="h-5 w-5" />Urgent announcement</span>
    <DialogTitle className="pr-5 text-3xl">{current?.title}</DialogTitle>
    <DialogDescription className="whitespace-pre-wrap break-words">{current?.body}</DialogDescription>
    <time className="text-xs text-muted-foreground">{current && new Date(current.createdAt).toLocaleString('en-CA', {dateStyle:'medium',timeStyle:'short'})}</time>
    <Button asChild onClick={dismiss}><Link to="/announcements/$id" params={{id:current?.id ?? ''}}>View Details<ArrowUpRight /></Link></Button>
  </DialogContent></Dialog>;
}
export function MerchandiseSection() {
  return <Section title="Official Merchandise" action={<span className="text-xs text-muted-foreground">Demo collection · CAD</span>}><div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{products.map(p => <article key={p.id} className="overflow-hidden rounded-lg border bg-card">
    <div className="aspect-[4/3] overflow-hidden"><img src={merchandise} width={1536} height={768} loading="lazy" alt={p.name} className={`merch-image ${p.imageClass}`} /></div>
    <div className="space-y-3 p-3"><h3 className="text-xl font-bold">{p.name}</h3><p className="font-semibold">CA${p.price.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">Mock price</span></p><Button asChild className="w-full"><Link to="/merchandise/$productId" params={{productId:p.id}}><ShoppingBag />Shop Now</Link></Button></div>
  </article>)}</div></Section>;
}
export function SponsorsSection() {
  return <div className="mt-8 border-t pt-6"><Section title="Official Merchandise"><Link to="/merchandise" className="flex flex-col gap-4 overflow-hidden rounded-lg border bg-card sm:flex-row sm:items-center"><img src={merchandise} width={1536} height={768} alt="Official Courtside merchandise" loading="lazy" className="aspect-[1.75] w-full object-cover sm:w-56" /><div className="px-4 pb-4 sm:p-0"><p className="text-xs uppercase text-primary">Courtside collection</p><h3 className="text-2xl font-bold">Official Merchandise</h3><p className="mt-1 text-sm text-muted-foreground">Browse apparel and tournament accessories.</p><span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">Visit the store<ArrowUpRight className="h-4 w-4" /></span></div></Link></Section>
    <Section title="50/50 Draw"><Link to="/promotions/$kind" params={{kind:'raffle'}} className="flex flex-col gap-4 overflow-hidden rounded-lg border bg-card sm:flex-row sm:items-center"><img src={raffle} width={1306} height={744} alt="Ontario Volleyball Association 50/50 raffle promotion" loading="lazy" className="aspect-[1.75] w-full object-cover sm:w-56" /><div className="px-4 pb-4 sm:p-0"><p className="text-xs uppercase text-primary">Demonstration promotion</p><h3 className="text-2xl font-bold">50/50 Draw</h3><p className="mt-1 text-sm text-muted-foreground">Draw information pending confirmation.</p><span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">View promotion<ArrowUpRight className="h-4 w-4" /></span></div></Link></Section>
    <Section title="Our Sponsors" action={<span className="text-xs text-muted-foreground">Placeholder partners & links</span>}><div className="grid grid-cols-3 gap-2">{sponsors.map(s => <Link key={s.id} to="/promotions/$kind" params={{kind:s.id}} className="flex min-w-0 flex-col items-center gap-2 rounded-lg border bg-card px-2 py-4 text-center"><span className="grid h-12 w-12 place-items-center rounded-full border text-xl font-bold text-muted-foreground">{s.mark}</span><span className="text-xs font-semibold">{s.name}</span><span className="text-xs text-muted-foreground">Placeholder</span></Link>)}</div></Section>
    <footer className="border-t py-4 text-xs text-muted-foreground">Courtside · Ontario Volleyball tournament companion</footer>
  </div>;
}
