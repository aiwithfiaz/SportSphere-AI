export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { Bell, Plus, MoreHorizontal, Send, Users, Settings, CheckCircle, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Notifications | Admin",
};

async function getNotificationStats() {
  const [total, unread] = await Promise.all([
    prisma.notification.count(),
    prisma.notification.count({ where: { isRead: false } }),
  ]);
  return { total, unread };
}

async function getRecentNotifications() {
  return prisma.notification.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export default async function AdminNotificationsPage() {
  const [stats, notifications] = await Promise.all([getNotificationStats(), getRecentNotifications()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure and manage platform notifications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Settings className="h-4 w-4 mr-2" />Settings</Button>
          <Button><Send className="h-4 w-4 mr-2" />Send Notification</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Sent</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Unread</p>
            <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Send</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Bell className="h-6 w-6" />
              <span>Match Alert</span>
              <span className="text-xs text-gray-500">Notify about live match</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Send className="h-6 w-6" />
              <span>Breaking News</span>
              <span className="text-xs text-gray-500">Send breaking news alert</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Broadcast</span>
              <span className="text-xs text-gray-500">Send to all users</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Read</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No notifications sent yet
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell>
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{notif.message}</p>
                    </TableCell>
                    <TableCell><span className="text-sm">{notif.user?.displayName || notif.user?.email || "All Users"}</span></TableCell>
                    <TableCell><Badge variant="outline">{notif.type}</Badge></TableCell>
                    <TableCell>
                      {notif.isRead ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell><span className="text-sm">{new Date(notif.createdAt).toLocaleDateString()}</span></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
