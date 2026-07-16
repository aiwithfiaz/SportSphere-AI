'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, Newspaper, Eye } from 'lucide-react';

interface Article {
  id: string; title: string; slug: string; status: string; viewCount: number;
  publishedAt: string | null; createdAt: string;
  author: { displayName: string } | null;
  categories: { name: string }[];
}

export default function AdminContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', status: 'DRAFT',
  });

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/v1/news?limit=50');
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openDialog = (article?: Article) => {
    setEditing(article || null);
    setForm({
      title: article?.title || '',
      excerpt: '',
      content: '',
      status: article?.status || 'DRAFT',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    try {
      const url = editing ? `/api/v1/news/${editing.slug}` : '/api/v1/news';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setDialogOpen(false); fetchArticles(); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this article?')) return;
    try { await fetch(`/api/v1/news/${slug}`, { method: 'DELETE' }); fetchArticles(); } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground mt-1">Manage articles, news, and media</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}><Plus className="h-4 w-4 mr-2" /> New Article</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Article' : 'New Article'}</DialogTitle>
              <DialogDescription>{editing ? 'Update article details' : 'Create a new article'}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article title" />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary" />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Article content (HTML supported)" />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !form.title || !form.content}>
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
          {articles.map(article => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>{article.status}</Badge>
                    {article.categories.map(c => <Badge key={c.name} variant="outline" className="text-xs">{c.name}</Badge>)}
                  </div>
                  <p className="font-medium">{article.title}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    {article.author && <span>By {article.author.displayName}</span>}
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => openDialog(article)}><Edit className="h-3 w-3" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(article.slug)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
