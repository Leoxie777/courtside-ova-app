import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export function AccountPanel() {
  const { userId } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const act = async (kind: 'signin' | 'signup' | 'reset') => {
    setBusy(true); setMessage('');
    try {
      const result = kind === 'signin' ? await supabase.auth.signInWithPassword({ email, password }) : kind === 'signup' ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/admin' } }) : await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/admin' });
      setMessage(result.error?.message ?? (kind === 'signin' ? 'Signed in.' : 'Check your email to continue.'));
    } catch { setMessage('Could not connect. Please try again.'); }
    setBusy(false);
  };
  if (userId) return <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>;
  return <div className="space-y-3 max-w-md">
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); void act('signin'); }}>
      <label className="block text-sm">Email<input required type="email" autoComplete="email" className="mt-1 w-full rounded-md border bg-card p-2" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label className="block text-sm">Password<input required minLength={8} type="password" autoComplete="current-password" className="mt-1 w-full rounded-md border bg-card p-2" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <div className="flex flex-wrap gap-2"><Button disabled={busy}>Sign in</Button><Button type="button" variant="outline" disabled={busy || !email || password.length < 8} onClick={() => act('signup')}>Create account</Button><Button type="button" variant="ghost" disabled={busy || !email} onClick={() => act('reset')}>Reset password</Button></div>
    </form>
    {message && <p role="status" className="text-sm">{message}</p>}
  </div>;
}
