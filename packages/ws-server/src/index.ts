import { Server } from 'socket.io';
import { createServer } from 'http';

const PORT = parseInt(process.env.WS_PORT || '3001');
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const matchRooms = new Map<string, Set<string>>();
const userSockets = new Map<string, string>();

// HTTP API for admin score broadcasting
httpServer.on('request', (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // Health check
  if (url.pathname === '/health' && req.method === 'GET') {
    const stats = {
      status: 'ok',
      connectedClients: io.engine.clientsCount,
      matchRooms: Array.from(matchRooms.entries()).map(([matchId, sockets]) => ({
        matchId,
        viewers: sockets.size,
      })),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  // Broadcast score update
  if (url.pathname === '/broadcast/score' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { matchId, homeScore, awayScore, status, currentInning, battingTeam, bowlingTeam } = data;

        if (!matchId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'matchId is required' }));
          return;
        }

        const scoreData = {
          matchId,
          homeScore,
          awayScore,
          status,
          currentInning,
          battingTeam,
          bowlingTeam,
          timestamp: new Date().toISOString(),
        };

        io.to(`match:${matchId}`).emit('score:update', scoreData);
        console.log(`[HTTP] Broadcast score for match ${matchId}:`, scoreData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Score broadcast to ${matchRooms.get(matchId)?.size || 0} viewers`,
          viewers: matchRooms.get(matchId)?.size || 0,
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Broadcast match event
  if (url.pathname === '/broadcast/event' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { matchId, event, details } = data;

        if (!matchId || !event) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'matchId and event are required' }));
          return;
        }

        io.to(`match:${matchId}`).emit('match:event', { matchId, event, details });
        console.log(`[HTTP] Broadcast event for match ${matchId}:`, event);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Event broadcast to ${matchRooms.get(matchId)?.size || 0} viewers`,
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Send notification to user
  if (url.pathname === '/broadcast/notification' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { userId, title, message, type } = data;

        if (!userId || !title) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'userId and title are required' }));
          return;
        }

        io.to(`user:${userId}`).emit('notification:receive', { userId, title, message, type });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Notification sent' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join:match', (matchId: string) => {
    socket.join(`match:${matchId}`);
    if (!matchRooms.has(matchId)) matchRooms.set(matchId, new Set());
    matchRooms.get(matchId)!.add(socket.id);
    console.log(`Socket ${socket.id} joined match:${matchId} (${matchRooms.get(matchId)?.size} viewers)`);
  });

  socket.on('leave:match', (matchId: string) => {
    socket.leave(`match:${matchId}`);
    matchRooms.get(matchId)?.delete(socket.id);
    if (matchRooms.get(matchId)?.size === 0) matchRooms.delete(matchId);
    console.log(`Socket ${socket.id} left match:${matchId}`);
  });

  socket.on('join:user', (userId: string) => {
    socket.join(`user:${userId}`);
    userSockets.set(userId, socket.id);
    console.log(`Socket ${socket.id} joined user:${userId}`);
  });

  socket.on('score:update', (data: { matchId: string; homeScore: any; awayScore: any; status: string }) => {
    io.to(`match:${data.matchId}`).emit('score:update', data);
    console.log(`Score update for match ${data.matchId}:`, data);
  });

  socket.on('match:event', (data: { matchId: string; event: string; details: any }) => {
    io.to(`match:${data.matchId}`).emit('match:event', data);
    console.log(`Match event for ${data.matchId}:`, data.event);
  });

  socket.on('notification:send', (data: { userId: string; title: string; message: string; type: string }) => {
    io.to(`user:${data.userId}`).emit('notification:receive', data);
    console.log(`Notification to user ${data.userId}:`, data.title);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id} (${reason})`);
    matchRooms.forEach((sockets, matchId) => {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) matchRooms.delete(matchId);
      }
    });
    userSockets.forEach((socketId, userId) => {
      if (socketId === socket.id) userSockets.delete(userId);
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`HTTP API available at http://localhost:${PORT}`);
  console.log(`  GET  /health                    - Server stats`);
  console.log(`  POST /broadcast/score           - Broadcast score update`);
  console.log(`  POST /broadcast/event           - Broadcast match event`);
  console.log(`  POST /broadcast/notification    - Send notification to user`);
});

export { io };
