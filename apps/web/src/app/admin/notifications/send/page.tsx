'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Send, Users, Bell, CheckCircle, Loader2, Radio, Zap, Globe } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName?: string | null;
}

export default function AdminNotificationSendPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [wsConnected, setWsConnected] = useState(false);

  const [targetType, setTargetType] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('CUSTOM');
  const [broadcastViaWs, setBroadcastViaWs] = useState(true);
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    fetchUsers();
    checkWsConnection();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/v1/admin/stats');
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.recentUsers || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const checkWsConnection = async () => {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
      const res = await fetch(`${wsUrl}/health`);
      const data = await res.json();
      setWsConnected(data.status === 'ok');
    } catch {
      setWsConnected(false);
    }
  };

  const broadcastViaWebSocket = async (notification: any) => {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
      await fetch(`${wsUrl}/broadcast/notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          targetUserId: targetType === 'specific' ? selectedUserId : undefined,
        }),
      });
      return true;
    } catch {
      return false;
    }
  };

  const handleSend = async () => {
    if (!title || !message) {
      setError('Title and message are required');
      return;
    }

    setSending(true);
    setError('');
    setSent(false);

    try {
      const notificationPayload = {
        title,
        message,
        type,
        ...(targetType === 'specific' && { userId: selectedUserId }),
      };

      // Send via REST API
      const res = await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationPayload),
      });
      const data = await res.json();

      if (data.success) {
        // Also broadcast via WebSocket for real-time delivery
        if (broadcastViaWs && wsConnected) {
          await broadcastViaWebSocket(notificationPayload);
        }
        
        setSent(true);
        setTitle('');
        setMessage('');
        setTimeout(() => setSent(false), 5000);
      } else {
        setError(data.error || 'Failed to send notification');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const quickTemplates = [
    { title: 'Breaking News', message: 'Major breaking news in the sports world! Stay tuned for updates.', type: 'BREAKING_NEWS', icon: '📰' },
    { title: 'Match Starting', message: 'A match you follow is about to start! Tune in now.', type: 'MATCH_START', icon: '⚽' },
    { title: 'Match Ended', message: 'The match has ended! Check out the final scores.', type: 'MATCH_END', icon: '🏁' },
    { title: 'Goal Scored', message: 'Goal! A goal has been scored in a match you follow.', type: 'GOAL', icon: '⚽' },
    { title: 'Wicket Taken', message: 'Wicket! A wicket has fallen in a live cricket match.', type: 'WICKET', icon: '🏏' },
    { title: 'Transfer Alert', message: 'New transfer update! A player has moved to a new club.', type: 'TRANSFER', icon: '🔄' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Send className="h-6 w-6" />
            Send Notification
          </h2>
          <p className="text-muted-foreground">Send notifications to users via push, in-app, or WebSocket.</p>
        </div>
        <div className="flex items-center gap-3">
          {wsConnected ? (
            <Badge className="bg-green-500/10 text-green-700 gap-1">
              <Radio className="h-3 w-3" /> WebSocket Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <Radio className="h-3 w-3" /> WebSocket Offline
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recipient */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Send To</Label>
                <Select value={targetType} onValueChange={setTargetType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        All Users
                      </div>
                    </SelectItem>
                    <SelectItem value="specific">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Specific User
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {targetType === 'specific' && (
                <div className="space-y-2">
                  <Label>Select User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.displayName || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification message content..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                      <SelectItem value="BREAKING_NEWS">Breaking News</SelectItem>
                      <SelectItem value="MATCH_START">Match Start</SelectItem>
                      <SelectItem value="MATCH_END">Match End</SelectItem>
                      <SelectItem value="GOAL">Goal</SelectItem>
                      <SelectItem value="WICKET">Wicket</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="font-medium">Broadcast via WebSocket</p>
                    <p className="text-xs text-muted-foreground">Send instantly to connected clients</p>
                  </div>
                </div>
                <Switch
                  checked={broadcastViaWs}
                  onCheckedChange={setBroadcastViaWs}
                  disabled={!wsConnected}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <span className="text-red-500">⚠️</span> {error}
            </div>
          )}
          {sent && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Notification sent successfully!
              {broadcastViaWs && wsConnected && (
                <span className="text-green-600">(including WebSocket broadcast)</span>
              )}
            </div>
          )}

          <Button 
            onClick={handleSend} 
            disabled={sending || !title || !message || (targetType === 'specific' && !selectedUserId)} 
            size="lg" 
            className="w-full"
          >
            {sending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
            ) : (
              <><Send className="h-4 w-4 mr-2" />Send Notification</>
            )}
          </Button>
        </div>

        {/* Quick Templates */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
              <CardDescription>Use pre-built templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTemplates.map((template, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => {
                    setTitle(template.title);
                    setMessage(template.message);
                    setType(template.type);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{template.icon}</span>
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{template.message}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-2 text-sm p-2 rounded hover:bg-accent">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{user.displayName || user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connection Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>WebSocket Server</span>
                <Badge variant={wsConnected ? 'default' : 'secondary'}>
                  {wsConnected ? 'Connected' : 'Offline'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>REST API</span>
                <Badge variant="default">Online</Badge>
              </div>
              <Button variant="link" className="p-0 h-auto text-xs" onClick={checkWsConnection}>
                Refresh connection status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
