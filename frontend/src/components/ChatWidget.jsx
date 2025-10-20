import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getSocket } from '../utils/socket';
import { messagesAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [clientName, setClientName] = useState('');
  const [hasName, setHasName] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    // Charger les messages existants
    loadMessages();

    // Vérifier si le nom du client est déjà enregistré
    const savedName = localStorage.getItem('clientName');
    if (savedName) {
      setClientName(savedName);
      setHasName(true);
    }

    // Écouter les nouveaux messages
    socket.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
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
      const response = await messagesAPI.getAll({ limit: 50 });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSetName = (e) => {
    e.preventDefault();
    if (clientName.trim()) {
      localStorage.setItem('clientName', clientName);
      setHasName(true);
      toast.success('Bienvenue !');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && clientName) {
      // Émettre le message via Socket.io
      socket.emit('client-message', {
        clientName,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center z-50"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-accent text-white p-4 rounded-t-lg">
            <h3 className="font-semibold text-lg">Discuter avec nous</h3>
            <p className="text-sm text-gray-200">Nous sommes là pour vous aider</p>
          </div>

          {/* Demander le nom si pas encore défini */}
          {!hasName ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <form onSubmit={handleSetName} className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Entrez votre nom"
                    className="input-field"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Commencer le chat
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 text-sm">
                    Aucun message. Commencez la conversation !
                  </p>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === 'client' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg ${
                        message.sender === 'client'
                          ? 'bg-accent text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      {message.sender === 'client' && (
                        <p className="text-xs opacity-75 mb-1">
                          {message.clientName}
                        </p>
                      )}
                      {message.sender === 'admin' && (
                        <p className="text-xs text-gray-500 mb-1">
                          Admin
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
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
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t bg-white rounded-b-lg"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;

