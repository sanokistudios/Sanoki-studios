import { useEffect, useState, useRef } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { messagesAPI } from '../../utils/api';
import { getSocket } from '../../utils/socket';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    loadMessages();

    // Écouter les nouveaux messages
    socket.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.sender === 'client') {
        toast('Nouveau message reçu', { icon: '💬' });
      }
    });

    return () => {
      socket.off('new-message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await messagesAPI.getAll();
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Émettre le message via Socket.io
      socket.emit('admin-message', {
        message: newMessage
      });
      setNewMessage('');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
      try {
        await messagesAPI.delete(id);
        toast.success('Message supprimé');
        setMessages(messages.filter((msg) => msg._id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
        toast.error('Erreur lors de la suppression du message');
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Messages */}
        <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">Aucun message</p>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${
                  message.sender === 'admin' ? 'justify-end' : 'justify-start'
                } group`}
              >
                <div className="flex items-start gap-2 max-w-[75%]">
                  <div
                    className={`p-4 rounded-lg ${
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
                        Admin
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
                  <button
                    onClick={() => handleDeleteMessage(message._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
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
      </div>
    </div>
  );
};

export default AdminMessages;

