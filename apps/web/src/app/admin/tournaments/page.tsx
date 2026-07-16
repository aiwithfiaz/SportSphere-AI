'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Loader2, Trophy } from 'lucide-react';

interface Sport { id: string; name: string; slug: string; }
interface Tournament { id: string; name: string; slug: string; sportId: string; sport: Sport; startDate?: string; endDate?: string; status?: string; }

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', sportId: '' });

  useEffect(() => { fetchTournaments(); fetchSports(); }, []);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/v1/tournaments');
      const data = await res.json();
      if (data.success) setTournaments(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchSports = async () => {
    try {
      const res = await fetch('/api/v1/sports');
      const data = await res.json();
      if (data.success) setSports(data.data);
    } catch (e) { console.error(e); }
  };

  const openDialog = (t?: Tournament) => {
    setEditing(t || null);
    setForm({ name: t?.name || '', sportId: t?.sportId || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.sportId) return;
    setSaving(true);
    try {
      const url = editing ? `/api/v1/tournaments/${editing.id}` : '/api/v1/tournaments';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setDialogOpen(false); fetchTournaments(); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tournament?')) return;
    try { await fetch(`/api/v1/tournaments/${id}`, { method: 'DELETE' }); fetchTournaments(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tournament Management</h1>
          <p className="text-muted-foreground mt-1">Manage leagues, cups, and tournaments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}><Plus className="h-4 w-4 mr-2" /> Add Tournament</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Tournament' : 'Add New Tournament'}</DialogTitle>
              <DialogDescription>{editing ? 'Update tournament details' : 'Add a new tournament'}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Indian Premier League" /></div>
              <div>
                <Label>Sport *</Label>
                <Select value={form.sportId} onValueChange={v => setForm({ ...form, sportId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                  <SelectContent>
                    {sports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name || !form.sportId}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map(t => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" /> {t.name}
                  </CardTitle>
                  <Badge variant="outline">{t.sport.name}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Slug: {t.slug}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDialog(t)}><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
