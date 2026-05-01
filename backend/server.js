const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const http      = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app    = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

// Make io available in routes
app.set('io', io);

app.use(cors());
app.use(express.json());

// Socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Each user joins their own room using their userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/reports',     require('./routes/reports'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

app.get('/', (req, res) => res.send('Waste Management API Running'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));