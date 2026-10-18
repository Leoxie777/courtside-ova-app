import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import type { Announcement } from "@/lib/data";
import { teams } from "@/lib/data";
import { useStore } from "@/lib/store";
import { similarAnnouncement } from "@/lib/events";
import { volleyballCategories, categoryFor, categoryOverrides, setCategoryOverride, type VolleyballCategory } from "@/lib/categories";
import { isAdminUnlocked, unlockAdmin, lockAdmin } from "@/lib/admin-gate";
import { AnnouncementCard, PageTitle, Section, inputCls } from "@/components/ui-kit";
import { AccountPanel } from '@/components/account-panel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export const Route = createFileRoute("/admin")({head:()=>({meta:[{title:'Organizer Admin — Courtside'},{name:'description',content:'Publish, edit and deactivate selected tournament announcements.'},{property:'og:title',content:'Organizer Admin — Courtside'},{property:'og:description',content:'Publish, edit and deactivate selected tournament announcements.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:Admin});
const blank = {title:'',body:'',priority:'normal' as 'normal'|'urgent',active:true};
function Admin(){
 const navigate=useNavigate();
 const {announcements,saveAnnouncement,deleteAnnouncement,isOrganizer,userId,eventId}=useStore();
 const [unlocked,setUnlocked]=useState(isAdminUnlocked());
 const [password,setPassword]=useState('');
 const [pwError,setPwError]=useState(false);
 const [editing,setEditing]=useState<Announcement|null>(null);
 const [form,setForm]=useState(blank);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [formEvent,setFormEvent]=useState(eventId);
 const [duplicate,setDuplicate]=useState<Announcement|null>(null);
 const [overrides,setOverrides]=useState(categoryOverrides());
 if(formEvent!==eventId){setFormEvent(eventId);setEditing(null);setForm(blank);setMessage('');setDuplicate(null);}
 const run=async(action:()=>Promise<void>)=>{setBusy(true);setMessage('');try{await action();setMessage('Announcement saved.');}catch(err){setMessage(err instanceof Error?err.message:'Could not save announcement.');}finally{setBusy(false);}};
 const persist=async()=>{await saveAnnouncement({...editing,...form,id:editing?.id??crypto.randomUUID(),createdAt:editing?.createdAt??new Date().toISOString()});setEditing(null);setForm(blank);setDuplicate(null);};
 const submit=(e:React.FormEvent)=>{e.preventDefault();const dup=similarAnnouncement({id:editing?.id??'',title:form.title,body:form.body},announcements);if(dup){setDuplicate(dup);return;}void run(persist);};
 const tryUnlock=(e:React.FormEvent)=>{e.preventDefault();if(unlockAdmin(password)){setUnlocked(true);setPwError(false);setPassword('');}else setPwError(true);};
 const lock=()=>{lockAdmin();setUnlocked(false);setEditing(null);setForm(blank);};
 if(!unlocked)return <><PageTitle title="Admin" sub="Organizer announcements"/><Section title="Organizer unlock"><form onSubmit={tryUnlock} className="max-w-sm space-y-3"><p className="text-sm text-muted-foreground">Enter the organizer password to manage announcements and team categories. Demo-only protection for this prototype.</p><label className="block text-sm">Password<input type="password" autoComplete="current-password" required className={inputCls} value={password} onChange={e=>{setPassword(e.target.value);setPwError(false);}}/></label>{pwError&&<p role="alert" className="text-sm text-destructive">Incorrect password. Action denied.</p>}<Button>Unlock dashboard</Button></form></Section></>;
 return <><PageTitle title="Admin" sub="Organizer announcements"/><div className="mb-4"><Button variant="outline" size="sm" onClick={lock}><Lock/>Lock Dashboard</Button></div><Section title="Account"><AccountPanel/></Section>{!isOrganizer?<p className="text-sm text-muted-foreground">{userId?'Organizer access is required to manage announcements.':'Sign in with an organizer account to manage announcements.'}</p>:<>
 <Section title={editing?'Edit announcement':'New announcement'}><form onSubmit={submit} className="space-y-3 max-w-xl"><label className="block text-sm">Title<input required maxLength={160} className={inputCls} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label className="block text-sm">Short description<textarea required maxLength={2000} rows={3} className={inputCls} value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.priority==='urgent'} onChange={e=>setForm({...form,priority:e.target.checked?'urgent':'normal'})}/>Urgent announcement</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/>Published / active</label><div className="flex gap-2"><Button disabled={busy}>{editing?'Save changes':form.active?'Publish':'Save inactive'}</Button>{editing&&<Button type="button" variant="outline" onClick={()=>{setEditing(null);setForm(blank);}}>Cancel</Button>}</div></form></Section>
 <Section title="Announcements"><div className="space-y-4">{announcements.map(a=><div key={a.id}><AnnouncementCard a={a}/><div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground">{a.active===false?'Inactive':'Published'}</span><Button variant="outline" size="sm" disabled={busy} onClick={()=>{setEditing(a);setForm({title:a.title,body:a.body,priority:a.priority,active:a.active!==false});}}>Edit</Button><Button variant="outline" size="sm" disabled={busy} onClick={()=>void run(()=>saveAnnouncement({...a,active:a.active===false,createdAt:a.active===false?new Date().toISOString():a.createdAt}))}>{a.active===false?'Publish':'Deactivate'}</Button><Button variant="ghost" size="sm" disabled={busy} onClick={()=>void run(()=>a.id==='a1'||a.id==='a2'||a.id==='00000000-0000-4000-8000-000000000004'?saveAnnouncement({...a,active:false}):deleteAnnouncement(a.id))}>Delete</Button></div></div>)}</div></Section></>}
 <Section title="Team categories"><p className="mb-3 text-xs text-muted-foreground">Fictional demonstration assignments — not verified OVA classifications. Changes are saved on this device.</p><div className="space-y-2">{teams.map(t=><div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3"><span className="text-sm font-semibold">{t.name}<span className="block text-xs font-normal text-muted-foreground">{t.division}</span></span><select aria-label={`Category for ${t.name}`} className={`${inputCls} max-w-52`} value={categoryFor(t.id,overrides)} onChange={e=>setOverrides(setCategoryOverride(t.id,e.target.value as VolleyballCategory))}>{volleyballCategories.map(c=><option key={c} value={c}>{c}</option>)}</select></div>)}</div></Section>
 <Dialog open={!!duplicate} onOpenChange={open=>{if(!open)setDuplicate(null);}}><DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg border-live bg-card"><DialogTitle>Potential Duplicate Detected</DialogTitle><DialogDescription>A similar announcement or event record already exists. Please review it before publishing.</DialogDescription>{duplicate&&<div className="rounded-lg border p-3"><p className="font-semibold">{duplicate.title}</p><p className="text-sm text-muted-foreground">{duplicate.body}</p></div>}<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={()=>{if(duplicate)void navigate({to:'/announcements/$id',params:{id:duplicate.id}});}}>View Existing</Button><Button variant="outline" onClick={()=>{if(duplicate){setEditing(duplicate);setForm({title:duplicate.title,body:duplicate.body,priority:duplicate.priority,active:duplicate.active!==false});}setDuplicate(null);}}>Edit Existing</Button><Button variant="ghost" onClick={()=>setDuplicate(null)}>Cancel</Button><Button disabled={busy} onClick={()=>void run(persist)}>Publish Anyway</Button></div></DialogContent></Dialog>
 {message&&<p role="status" className="mt-3 text-sm">{message}</p>}</>;
}
