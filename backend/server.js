const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const httpServer = createServer(app);

// Configurer Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, ''),
  (process.env.FRONTEND_URL || 'http://localhost:5173') + '/',
  'http://localhost:5173',
  'https://ecommerce-vetements-production.up.railway.app',
  'https://ecommerce-vetements-production.up.railway.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Connexion à MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Gestion du chat en temps réel avec Socket.io
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);

  // Rejoindre une room spécifique (pour gérer plusieurs conversations)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Recevoir un message du client
  socket.on('client-message', async (data) => {
    try {
      const message = new Message({
        sender: 'client',
        clientName: data.clientName,
        content: data.message,
        timestamp: new Date()
      });
      await message.save();
      
      // Envoyer le message à l'admin
      io.emit('new-message', message);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
    }
  });

  // Recevoir un message de l'admin
  socket.on('admin-message', async (data) => {
    try {
      const message = new Message({
        sender: 'admin',
        content: data.message,
        timestamp: new Date()
      });
      await message.save();
      
      // Envoyer le message à tous les clients
      io.emit('new-message', message);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erreur serveur', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 Socket.io activé`);
});

