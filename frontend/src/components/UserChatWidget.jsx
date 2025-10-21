import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getSocket } from '../utils/socket';
import { useAuth } from '../context/AuthContext';

const UserChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (conversationId) {
      // Authentifier le socket avec le token
      const token = localStorage.getItem('token');
      if (token) {
        socket.emit('authenticate', token);
      }

      // Écouter les nouveaux messages
      socket.on('new-message', handleNewMessage);
      
      return () => {
        socket.off('new-message', handleNewMessage);
      };
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewMessage = (data) => {
    // Ajouter le message s'il vient de l'admin
    if (data.message && data.message.sender === 'admin') {
      setMessages(prev => {
        const exists = prev.some(m => m._id === data.message._id);
        return exists ? prev : [...prev, data.message];
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/conversations/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConversationId(response.data.conversation._id);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Erreur chargement conversation:', error);
      toast.error('Erreur lors du chargement du chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversationId) return;
    
    const messageText = newMessage.trim();
    
    // Ajouter le message localement (optimistic update)
    const tempMessage = {
      _id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      createdAt: new Date(),
      userId: { name: user?.name }
    };
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/conversations/${conversationId}/messages`, 
        { text: messageText },
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      // Retirer le message temporaire en cas d'erreur
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Chat"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in">
          {/* En-tête */}
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Chat Support</h3>
            <p className="text-sm text-blue-100">Nous sommes là pour vous aider</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle className="w-12 h-12 mb-2" />
                <p>Commencez une conversation</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    {msg.sender === 'admin' && (
                      <p className="text-xs font-semibold text-gray-500 mb-1">Support</p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Votre message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !conversationId}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserChatWidget;

