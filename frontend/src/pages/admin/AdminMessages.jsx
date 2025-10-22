import { useEffect, useState, useRef } from 'react';
import { Send, MessageCircle, User, Check } from 'lucide-react';
import api from '../../utils/api';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    loadConversations();

    // Authentifier le socket avec le token admin
    const token = localStorage.getItem('token');
    if (token) {
      socket.emit('join-admin', token);
    }

    // Écouter les nouveaux messages des utilisateurs
    socket.on('new-user-message', handleNewUserMessage);

    return () => {
      socket.off('new-user-message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewUserMessage = (data) => {
    // Recharger les conversations pour mettre à jour la liste
    loadConversations();
    
    // Si c'est la conversation ouverte, ajouter le message
    if (selectedConversation && data.conversation._id === selectedConversation._id) {
      setMessages(prev => {
        const exists = prev.some(m => m._id === data.message._id);
        return exists ? prev : [...prev, data.message];
      });
    }

    toast.success(`Nouveau message de ${data.conversation.userId?.name || 'Utilisateur'}`, {
      icon: '💬'
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/messages/conversations/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/messages/conversations/${conversation._id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
      setSelectedConversation(conversation);

      // Marquer comme lu
      await api.put(`/messages/conversations/${conversation._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Recharger les conversations pour mettre à jour le badge
      loadConversations();
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();

    // Ajouter le message localement
    const tempMessage = {
      _id: Date.now().toString(),
      text: messageText,
      sender: 'admin',
      createdAt: new Date(),
      userId: { name: 'Support' }
    };
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const token = localStorage.getItem('token');
      await api.post(
        `/messages/conversations/${selectedConversation._id}/messages`,
        { text: messageText },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Liste des conversations */}
      <div className="md:col-span-1 bg-white rounded-lg shadow overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-lg">Conversations ({conversations.length})</h2>
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MessageCircle className="h-16 w-16 mb-3" />
            <p>Aucune conversation</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => loadMessages(conv)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedConversation?._id === conv._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <p className="font-semibold text-primary">
                        {conv.userId?.name || 'Utilisateur inconnu'}
                      </p>
                    </div>
                    {conv.userId?.email && (
                      <p className="text-xs text-gray-500 mt-1">{conv.userId.email}</p>
                    )}
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-2">
                        {conv.lastMessage}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessageAt).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zone de messages */}
      <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
        {selectedConversation ? (
          <>
            {/* En-tête */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="font-semibold">{selectedConversation.userId?.name}</p>
                  <p className="text-sm text-gray-500">{selectedConversation.userId?.email}</p>
                </div>
              </div>
              {selectedConversation.isResolved && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Résolu
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Aucun message dans cette conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-lg ${
                        msg.sender === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      {msg.sender === 'user' && (
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          {msg.userId?.name || 'Utilisateur'}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Votre réponse..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Envoyer</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="h-20 w-20 mb-4" />
            <p className="text-lg">Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
