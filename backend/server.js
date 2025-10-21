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
const Conversation = require('./models/Conversation');

io.on('connection', (socket) => {
  console.log('Nouveau client connecté:', socket.id);

  // Rejoindre une conversation spécifique
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Rejoindre la room admin (pour recevoir tous les messages)
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log(`Admin joined room`);
  });

  // Recevoir un message du client
  socket.on('client-message', async (data) => {
    try {
      const { conversationId, clientName, message } = data;

      // Créer ou mettre à jour la conversation
      let conversation = await Conversation.findOne({ conversationId });
      if (!conversation) {
        conversation = await Conversation.create({
          conversationId,
          clientName,
          lastMessage: message,
          lastMessageAt: new Date(),
          unreadCount: 1
        });
      } else {
        conversation.lastMessage = message;
        conversation.lastMessageAt = new Date();
        conversation.unreadCount += 1;
        await conversation.save();
      }

      // Créer le message
      const newMessage = await Message.create({
        conversationId,
        sender: 'client',
        clientName,
        content: message,
        timestamp: new Date()
      });
      
      // Envoyer le message à cette conversation spécifique
      io.to(conversationId).emit('new-message', newMessage);
      
      // Notifier l'admin d'un nouveau message
      io.to('admin-room').emit('new-client-message', {
        conversationId,
        message: newMessage,
        conversation
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
    }
  });

  // Recevoir un message de l'admin
  socket.on('admin-message', async (data) => {
    try {
      const { conversationId, message } = data;

      // Créer le message
      const newMessage = await Message.create({
        conversationId,
        sender: 'admin',
        content: message,
        timestamp: new Date()
      });

      // Mettre à jour la conversation
      await Conversation.findOneAndUpdate(
        { conversationId },
        {
          lastMessage: message,
          lastMessageAt: new Date()
        }
      );
      
      // Envoyer le message à cette conversation spécifique
      io.to(conversationId).emit('new-message', newMessage);
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

