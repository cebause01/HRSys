import { useEffect, useState } from 'react';
import api from '../services/api';
import { Send, MessageSquare, User } from 'lucide-react';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data.data);
      if (response.data.data.length > 0 && !selectedConversation) {
        setSelectedConversation(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const response = await api.get(`/messages/${roomId}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await api.post('/messages', {
        roomId: selectedConversation.id,
        content: newMessage,
        type: 'direct'
      });
      setNewMessage('');
      fetchMessages(selectedConversation.id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No conversations</div>
          ) : (
            conversations.map((conversation) => {
              const lastMsg = conversation.lastMessage;
              const otherUser = lastMsg?.senderId || lastMsg?.receiverId;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-semibold text-sm">
                        {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{otherUser?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-600 truncate">{lastMsg?.content || ''}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isSender = message.senderId?._id === JSON.parse(localStorage.getItem('user'))?._id;
                
                return (
                  <div
                    key={message._id}
                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isSender
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${isSender ? 'text-primary-100' : 'text-gray-500'}`}>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
