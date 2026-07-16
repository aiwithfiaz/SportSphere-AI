'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, Trophy, Calendar } from 'lucide-react';

interface Match {
  id: string; status: string; format: string; scheduledAt: string;
  homeScore: number | null; awayScore: number | null; result: string | null;
  sport: { name: string }; tournament: { name: string } | null;
  homeTeam: { name: string } | null; awayTeam: { name: string } | null;
}
interface Team { id: string; name: string; sportId: string; }
interface Sport { id: string; name: string; }
interface Tournament { id: string; name: string; sportId: string; }

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Match | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    sportId: '', tournamentId: '', homeTeamId: '', awayTeamId: '',
    scheduledAt: '', format: 'ODI', status: 'SCHEDULED',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [mRes, tRes, sRes, trRes] = await Promise.all([
        fetch('/api/v1/matches?limit=50'), fetch('/api/v1/teams?limit=100'),
        fetch('/api/v1/sports'), fetch('/api/v1/tournaments'),
      ]);
      const [mData, tData, sData, trData] = await Promise.all([
        mRes.json(), tRes.json(), sRes.json(), trRes.json(),
      ]);
      if (mData.success) setMatches(mData.data);
      if (tData.success) setTeams(tData.data);
      if (sData.success) setSports(sData.data);
      if (trData.success) setTournaments(trData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredTeams = teams.filter(t => form.sportId ? t.sportId === form.sportId : true);
  const filteredTournaments = tournaments.filter(t => form.sportId ? t.sportId === form.sportId : true);

  const openDialog = (match?: Match) => {
    setEditing(match || null);
    setForm({
      sportId: '', tournamentId: '', homeTeamId: '', awayTeamId: '',
      scheduledAt: '', format: 'ODI', status: 'SCHEDULED',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.sportId || !form.homeTeamId || !form.awayTeamId || !form.scheduledAt) return;
    setSaving(true);
    try {
      const url = editing ? `/api/v1/matches/${editing.id}` : '/api/v1/matches';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setDialogOpen(false); fetchAll(); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this match?')) return;
    try { await fetch(`/api/v1/matches/${id}`, { method: 'DELETE' }); fetchAll(); } catch (e) { console.error(e); }
  };

  const statusColor = (s: string) => {
    if (s === 'LIVE' || s === 'IN_PROGRESS') return 'bg-red-500';
    if (s === 'COMPLETED') return 'bg-green-500';
    return 'bg-secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Match Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage matches</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}><Plus className="h-4 w-4 mr-2" /> Add Match</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Match' : 'Create Match'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sport *</Label>
                  <Select value={form.sportId} onValueChange={v => setForm({ ...form, sportId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                    <SelectContent>
                      {sports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tournament</Label>
                  <Select value={form.tournamentId} onValueChange={v => setForm({ ...form, tournamentId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select tournament" /></SelectTrigger>
                    <SelectContent>
                      {filteredTournaments.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Home Team *</Label>
                  <Select value={form.homeTeamId} onValueChange={v => setForm({ ...form, homeTeamId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select home team" /></SelectTrigger>
                    <SelectContent>
                      {filteredTeams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Away Team *</Label>
                  <Select value={form.awayTeamId} onValueChange={v => setForm({ ...form, awayTeamId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select away team" /></SelectTrigger>
                    <SelectContent>
                      {filteredTeams.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Scheduled At *</Label>
                  <Input type="datetime-local" value={form.scheduledAt}
                    onChange={e => setForm({ ...form, scheduledAt: e.target.value })} />
                </div>
                <div>
                  <Label>Format</Label>
                  <Select value={form.format} onValueChange={v => setForm({ ...form, format: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEST">Test</SelectItem>
                      <SelectItem value="ODI">ODI</SelectItem>
                      <SelectItem value="T20">T20</SelectItem>
                      <SelectItem value="T20I">T20I</SelectItem>
                      <SelectItem value="FOOTBALL">Football</SelectItem>
                      <SelectItem value="BASKETBALL">Basketball</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.sportId || !form.homeTeamId || !form.awayTeamId}>
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
        <div className="space-y-3">
          {matches.map(match => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${statusColor(match.status)}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{match.sport.name}</Badge>
                      {match.tournament && <Badge variant="secondary" className="text-xs">{match.tournament.name}</Badge>}
                      <Badge className="text-xs">{match.status}</Badge>
                    </div>
                    <p className="font-medium mt-1">
                      {match.homeTeam?.name || 'TBD'} vs {match.awayTeam?.name || 'TBD'}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(match.scheduledAt).toLocaleString()} · {match.format}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {match.homeScore != null && match.awayScore != null && (
                    <p className="text-lg font-bold">{match.homeScore} - {match.awayScore}</p>
                  )}
                  {match.result && <p className="text-sm text-green-600 max-w-xs truncate">{match.result}</p>}
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => openDialog(match)}><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(match.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
