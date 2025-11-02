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
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Connexion à MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/hero-images', require('./routes/heroImages'));
app.use('/api/paintings', require('./routes/paintings'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Gestion du chat en temps réel avec Socket.io (pour utilisateurs connectés uniquement)
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const jwt = require('jsonwebtoken');

// Rendre io accessible globalement pour les controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);

  // Authentifier le socket avec le token JWT
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      
      // Rejoindre la room de l'utilisateur
      socket.join(`user:${decoded.id}`);
      console.log(`User ${decoded.id} authenticated and joined room`);
      
      socket.emit('authenticated', { success: true });
    } catch (error) {
      console.error('Erreur authentification socket:', error);
      socket.emit('authenticated', { success: false, message: 'Token invalide' });
    }
  });

  // Admin rejoint la room admin
  socket.on('join-admin', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Vérifier que l'utilisateur est admin
      const User = require('./models/User');
      const user = await User.findById(decoded.id);
      
      if (user && user.role === 'admin') {
        socket.userId = decoded.id; // Définir userId si pas déjà fait
        socket.join('admin');
        console.log(`✅ Admin ${decoded.id} (${user.name}) joined admin room`);
        socket.emit('admin-joined', { success: true });
      } else {
        console.log(`❌ User ${decoded.id} tried to join admin room but is not admin`);
        socket.emit('admin-joined', { success: false, message: 'Not admin' });
      }
    } catch (error) {
      console.error('Erreur join admin:', error);
      socket.emit('admin-joined', { success: false, message: 'Token invalide' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Helper pour émettre des événements Socket.io depuis les controllers
app.emitToUser = (userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data);
};

app.emitToAdmin = (event, data) => {
  io.to('admin').emit(event, data);
};

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

