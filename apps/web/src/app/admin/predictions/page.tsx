'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  TrendingUp,
} from 'lucide-react';

interface Prediction {
  id: string;
  title: string;
  description: string | null;
  prediction: string;
  confidence: number | null;
  isActive: boolean;
  createdAt: string;
  sport: { name: string } | null;
  match: {
    homeTeam: { name: string } | null;
    awayTeam: { name: string } | null;
  } | null;
  userPredictions: any[];
}

export default function AdminPredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalVotes: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/v1/predictions?limit=50');
      const data = await res.json();
      if (data.success) {
        setPredictions(data.data);
        const total = data.data.length;
        const active = data.data.filter((p: Prediction) => p.isActive).length;
        const totalVotes = data.data.reduce((sum: number, p: Prediction) => sum + p.userPredictions.length, 0);
        const withConf = data.data.filter((p: Prediction) => p.confidence !== null);
        const avgConfidence = withConf.length > 0
          ? withConf.reduce((sum: number, p: Prediction) => sum + (p.confidence || 0), 0) / withConf.length
          : 0;
        setStats({ total, active, totalVotes, avgConfidence });
      }
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Predictions</h1>
        <p className="text-muted-foreground mt-1">Monitor AI-powered match predictions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalVotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.avgConfidence > 0 ? `${(stats.avgConfidence * 100).toFixed(0)}%` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <PredictionsList predictions={predictions} loading={loading} />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <PredictionsList predictions={predictions.filter((p) => p.isActive)} loading={loading} />
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          <PredictionsList predictions={predictions.filter((p) => !p.isActive)} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PredictionsList({ predictions, loading }: { predictions: Prediction[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No predictions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {predictions.map((pred) => (
        <Card key={pred.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pred.title}</span>
                  {pred.sport && <Badge variant="outline">{pred.sport.name}</Badge>}
                  {pred.match?.homeTeam && pred.match?.awayTeam && (
                    <Badge variant="secondary">
                      {pred.match.homeTeam.name} vs {pred.match.awayTeam.name}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{pred.prediction}</p>
                {pred.description && (
                  <p className="text-sm italic text-muted-foreground">&ldquo;{pred.description}&rdquo;</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {pred.confidence !== null && (
                  <div className="text-right">
                    <p className="text-sm font-medium">{(pred.confidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                )}
                <div className="text-right">
                  <p className="text-sm font-medium">{pred.userPredictions.length}</p>
                  <p className="text-xs text-muted-foreground">Votes</p>
                </div>
                {pred.isActive ? (
                  <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
