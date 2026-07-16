export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { CreditCard, Plus, MoreHorizontal, CheckCircle, XCircle, Clock, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Subscriptions | Admin",
};

async function getSubscriptionStats() {
  const [total, active, cancelled] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.subscription.count({ where: { status: "cancelled" } }),
  ]);
  return { total, active, cancelled };
}

async function getRecentSubscriptions() {
  return prisma.subscription.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

const planPrices: Record<string, string> = {
  MONTHLY: "$9.99/mo",
  YEARLY: "$99.99/yr",
  LIFETIME: "$299.99",
};

export default async function AdminSubscriptionsPage() {
  const [stats, subscriptions] = await Promise.all([getSubscriptionStats(), getRecentSubscriptions()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscriptions</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage premium plans and billing.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Create Plan</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Subscriptions</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$0</p>
            <p className="text-sm text-gray-500 mt-2">Basic scores and news access</p>
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Premium Monthly
              <Badge>Popular</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$9.99<span className="text-sm font-normal">/mo</span></p>
            <p className="text-sm text-gray-500 mt-2">AI predictions, no ads, advanced analytics</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Premium Yearly</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$99.99<span className="text-sm font-normal">/yr</span></p>
            <p className="text-sm text-gray-500 mt-2">Save 17% — all premium features</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No subscriptions yet
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <p className="font-medium">{sub.user?.displayName || sub.user?.email || "Unknown"}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline">{sub.plan}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "active" ? "default" : sub.status === "cancelled" ? "destructive" : "secondary"}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell><span className="text-sm">{new Date(sub.startDate).toLocaleDateString()}</span></TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </TableCell>
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
