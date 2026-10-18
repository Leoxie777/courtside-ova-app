import { Link, useLocation } from "@tanstack/react-router";
import { Home, CalendarDays, Radio, Users, MapPin, Shield, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { setsWon, teamById, type Announcement, type Match } from "@/lib/data";
import { useStore } from "@/lib/store";
import ovaLogo from "@/assets/ova-logo-white.png";


const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/results", label: "Live", icon: Radio },
  { to: "/teams", label: "Teams", icon: Users },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { error } = useStore();
  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="sticky top-0 z-20 bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative block h-8 w-9 shrink-0 overflow-hidden" aria-hidden="true">
              <img src={ovaLogo} alt="" className="absolute left-0 top-0 w-9 max-w-none" />
            </span>
            <span className="font-display text-2xl font-bold uppercase tracking-wide">Courtside</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {[...nav, { to: "/admin", label: "Admin", icon: Shield }, { to: "/import", label: "Import", icon: Upload }].map((n) => (
              <Link key={n.to} to={n.to} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${pathname === n.to ? "bg-primary text-primary-foreground" : "opacity-80 hover:opacity-100"}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex gap-3 md:hidden">
            <Link to="/admin" aria-label="Admin"><Shield className="h-5 w-5 opacity-80" /></Link>
            <Link to="/import" aria-label="Import data"><Upload className="h-5 w-5 opacity-80" /></Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-5">
        {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-card md:hidden">
        <div className="grid grid-cols-4">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold ${active ? "text-accent" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />{label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-4xl font-bold uppercase">{title}</h1>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export const teamName = (id: string) => teamById(id)?.name ?? id.replace(/^ext:/, "");

export function StatusBadge({ status }: { status: Match["status"] }) {
  if (status === "live")
    return <span className="inline-flex items-center gap-1 rounded-full bg-live px-2 py-0.5 text-xs font-bold uppercase text-accent-foreground"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent-foreground" />Live</span>;
  if (status === "final") return <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold uppercase text-secondary-foreground">Final</span>;
  return <span className="rounded-full border px-2 py-0.5 text-xs font-bold uppercase text-muted-foreground">Upcoming</span>;
}

export function MatchCard({ m }: { m: Match }) {
  const { followed } = useStore();
  const [h, a] = setsWon(m);
  const cur = m.sets[m.sets.length - 1];
  const row = (id: string, won: number, pts?: number, win?: boolean) => (
    <div className="flex items-center justify-between gap-3">
      <span className={`min-w-0 break-words ${win ? "font-bold" : ""} ${followed.includes(id) ? "text-accent" : ""}`}>{teamName(id)}</span>
      {m.status !== "scheduled" && (
        <span className="flex items-center gap-3 font-display text-xl font-bold tabular-nums">
          {m.status === "live" && <span className="text-sm text-muted-foreground">{pts}</span>}
          {won}
        </span>
      )}
    </div>
  );
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2 text-xs text-muted-foreground">
        <span>{fmtDate(m.date)} · {m.time} · {m.court}{m.source ? ` · via ${m.source}` : ""}</span>
        <StatusBadge status={m.status} />
      </div>
      <div className="space-y-1">
        {row(m.homeId, h, cur?.[0], m.status === "final" && h > a)}
        {row(m.awayId, a, cur?.[1], m.status === "final" && a > h)}
      </div>
      <div className="mt-3 border-t pt-2 text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />Venue & address: awaiting confirmation</p>
        <p>Parking address & court map: not yet provided</p>
      </div>
      {m.sets.length > 0 && (
        <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
          {m.sets.map((s, i) => <span key={i} className="rounded bg-muted px-1.5 py-0.5 tabular-nums">S{i + 1} {s[0]}-{s[1]}</span>)}
        </div>
      )}
    </div>
  );
}

export function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <div className={`rounded-lg border p-3 ${a.priority === "urgent" ? "border-live bg-card" : "bg-card"}`}>
      <div className="flex items-center gap-2">
        {a.priority === "urgent" && <span className="rounded bg-live px-1.5 text-xs font-bold uppercase text-accent-foreground">Urgent</span>}
        <h3 className="text-lg font-bold">{a.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{a.body}</p>
      <p className="mt-1 text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })}</p>
    </div>
  );
}

export const fmtDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });

export const inputCls = "w-full rounded-lg border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
export const btnCls = "rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90";
export const btnGhost = "rounded-lg border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted";
