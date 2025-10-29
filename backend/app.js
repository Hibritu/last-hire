require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./src/config/db');
require('./src/models');
const setupSwagger = require('./src/swagger');
const chapaRoutes = require('./src/routes/chapa');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
app.use(express.json());

// CORS setup
const allowedOrigins = [
  'http://localhost:8080', 'http://localhost:3000', 'http://localhost:4000',
  'http://localhost:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000',
  'http://127.0.0.1:4000', 'http://127.0.0.1:5173', 'http://localhost:8081',
  'http://127.0.0.1:8081', 'http://localhost:8000', 'http://127.0.0.1:8000',
  'http://localhost:3001', 'http://127.0.0.1:3001', // Admin Panel
  'http://localhost:3002', 'http://127.0.0.1:3002' ,
  'https://last-hire-eft1-1hj3s1cld-hibritus-projects.vercel.app', // Your Vercel URL
  'https://hirehub-auth.vercel.app', // Your Auth Hub (if different)
  'https://hirehub-jobseeker.vercel.app', // Job Seeker Portal
  'https://hirehub-employer.vercel.app', // Employer Portal
  'https://hirehub-admin.vercel.app' // Auth Hub
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy does not allow access from this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  exposedHeaders: ['Content-Range','X-Content-Range']
}));

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Swagger
setupSwagger(app);

// Health routes
app.get('/', (req, res) => {
  res.json({
    name: 'HireHub API',
    status: 'ok',
    endpoints: ['/health', '/auth/*', '/users/*', '/employers/*', '/api/admin/*'],
  });
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/auth', require('./src/routes/auth'));
app.use('/users', require('./src/routes/users'));
app.use('/employers', require('./src/routes/employers'));
app.use('/api/jobs', require('./src/routes/jobs'));
app.use('/api/freelancers', require('./src/routes/freelancers'));
app.use('/api', require('./src/routes/applications'));
app.use('/api', require('./src/routes/reports'));
app.use('/api', require('./src/routes/notifications'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/chapa', chapaRoutes);
app.use('/api', require('./src/routes/chat'));

// WebSocket info endpoint
app.get('/websocket-info', (req, res) => {
  res.json({
    websocket_url: `ws://localhost:${process.env.PORT || 4000}`,
    connection_info: 'WebSocket server is running on the same port as HTTP server',
    available_events: ['join_chat', 'send_message', 'upload_file', 'new_message', 'file_uploaded'],
    authentication: 'Send JWT token after connection or include in connection headers',
    example_usage: {
      connect: `const socket = io('http://localhost:${process.env.PORT || 4000}');`,
      join_chat: "socket.emit('join_chat', 'room123');",
      send_message: "socket.emit('send_message', {chat_id: 'room123', content: 'Hello!'});"
    }
  });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // for dev
    const port = process.env.PORT || 4000;

    // Create HTTP + Socket.io
    const server = http.createServer(app);
    const io = socketio(server, {
      maxHttpBufferSize: 10 * 1024 * 1024 // 10MB
    });

    // ✅ SOCKET.IO EVENT HANDLERS
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join chat room
      socket.on('join_chat', (chat_id) => {
        socket.join(chat_id);
        console.log(`User joined chat: ${chat_id}`);
      });

      // Handle sending a message
      socket.on('send_message', async (data) => {
        try {
          const Message = require('./src/models/message');
          const newMessage = await Message.create({
            chat_id: data.chat_id,
            sender_id: data.sender_id,
            content: data.content,
            file_url: data.file_url || null
          });
          io.to(data.chat_id).emit('new_message', newMessage);
        } catch (err) {
          console.error('Error saving message:', err);
        }
      });

      // ✅ File upload (inside connection handler)
      socket.on('upload_file', async (data, callback) => {
        try {
          const fileBuffer = Buffer.from(data.file, 'base64');
          const uploadDir = path.join(process.cwd(), 'uploads', 'chat-attachments');
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, data.name);
          fs.writeFileSync(filePath, fileBuffer);

          const fileUrl = `/uploads/chat-attachments/${data.name}`;

          const Message = require('./src/models/message');
          await Message.create({
            chat_id: data.chat_id,
            sender_id: data.sender_id,
            file_url: fileUrl
          });

          io.to(data.chat_id).emit('file_uploaded', { url: fileUrl, name: data.name });
          callback({ status: 'success', url: fileUrl });
        } catch (err) {
          console.error('File upload error:', err);
          callback({ status: 'fail', error: err.message });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    server.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = { app, start };
