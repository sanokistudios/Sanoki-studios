import { useEffect, useState, useRef } from 'react';
import { Send, Trash2, MessageCircle, User } from 'lucide-react';
import axios from 'axios';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    loadConversations();

    // Rejoindre la room admin pour recevoir les notifications
    socket.emit('join-admin');

    // Écouter les nouveaux messages clients
    socket.on('new-client-message', (data) => {
      toast('Nouveau message reçu de ' + data.conversation.clientName, { icon: '💬' });
      loadConversations();
      
      // Si c'est la conversation actuellement ouverte, ajouter le message
      if (selectedConversation?.conversationId === data.conversationId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    // Écouter les nouveaux messages (réponses admin ou messages clients)
    socket.on('new-message', (message) => {
      if (selectedConversation?.conversationId === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('new-client-message');
      socket.off('new-message');
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/admin/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      console.error('Détails:', error.response?.data);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/messages/${conversationId}`);
      setMessages(response.data.messages);
      
      // Rejoindre la conversation
      socket.emit('join-conversation', conversationId);
      
      // Marquer comme lu
      const token = localStorage.getItem('token');
      await axios.put(`/api/messages/${conversationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Recharger les conversations pour mettre à jour le badge
      loadConversations();
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.conversationId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      // Émettre le message via Socket.io
      socket.emit('admin-message', {
        conversationId: selectedConversation.conversationId,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette conversation ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/messages/conversation/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Conversation supprimée');
        setConversations(conversations.filter((c) => c.conversationId !== conversationId));
        if (selectedConversation?.conversationId === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Chat avec les clients</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-accent text-white font-semibold">
            Conversations ({conversations.length})
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune conversation</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.conversationId === conv.conversationId
                      ? 'bg-blue-50 border-l-4 border-accent'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{conv.clientName}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {conv.lastMessage || 'Nouvelle conversation'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(conv.lastMessageAt).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {conv.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.conversationId);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fenêtre de chat */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de la conversation */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{selectedConversation.clientName}</p>
                      <p className="text-xs text-gray-500">
                        ID: {selectedConversation.conversationId.slice(0, 15)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 h-[500px]">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500">Aucun message dans cette conversation</p>
                )}
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.sender === 'admin' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-accent text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      {message.sender === 'client' && (
                        <p className="text-xs font-semibold mb-1 text-gray-600">
                          {message.clientName}
                        </p>
                      )}
                      {message.sender === 'admin' && (
                        <p className="text-xs mb-1 opacity-75">
                          Vous
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === 'admin' ? 'opacity-75' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Envoyer</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
