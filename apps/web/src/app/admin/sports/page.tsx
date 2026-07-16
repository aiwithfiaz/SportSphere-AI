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

interface Sport { id: string; name: string; slug: string; icon: string | null; isActive: boolean; }

export default function AdminSportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Sport | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '' });

  useEffect(() => { fetchSports(); }, []);

  const fetchSports = async () => {
    try {
      const res = await fetch('/api/v1/sports');
      const data = await res.json();
      if (data.success) setSports(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openDialog = (sport?: Sport) => {
    setEditing(sport || null);
    setForm({ name: sport?.name || '', icon: sport?.icon || '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const url = editing ? `/api/v1/sports/${editing.id}` : '/api/v1/sports';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setDialogOpen(false); fetchSports(); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sport?')) return;
    try { await fetch(`/api/v1/sports/${id}`, { method: 'DELETE' }); fetchSports(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sports Management</h1>
          <p className="text-muted-foreground mt-1">Manage sports categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}><Plus className="h-4 w-4 mr-2" /> Add Sport</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Sport' : 'Add New Sport'}</DialogTitle>
              <DialogDescription>{editing ? 'Update sport details' : 'Add a new sport category'}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Cricket" /></div>
              <div><Label>Icon</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="e.g., cricket-icon" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.name}>
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
          {sports.map(sport => (
            <Card key={sport.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" /> {sport.name}
                  </CardTitle>
                  <Badge variant={sport.isActive ? 'default' : 'secondary'}>{sport.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Slug: {sport.slug}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDialog(sport)}><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(sport.id)}><Trash2 className="h-3 w-3 mr-1" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
