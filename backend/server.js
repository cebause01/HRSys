const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/invitations', require('./routes/invitations'));

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrsys')
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('Server will continue running but database operations will fail.');
  console.log('Please ensure MongoDB is running or update MONGODB_URI in .env file');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
