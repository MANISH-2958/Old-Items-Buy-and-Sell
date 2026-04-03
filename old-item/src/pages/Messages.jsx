import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { toast } from 'react-hot-toast';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/messages');
      setConversations(data);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (userId, itemId) => {
    try {
      const { data } = await API.get(`/messages/thread/${userId}/${itemId || 'no-item'}`);
      setMessages(data);
      // Mark local unread as 0 for this conversation
      setConversations(prev => prev.map(conv => 
        (conv.otherUser._id === userId && (!conv.item || conv.item._id === itemId)) 
          ? { ...conv, unreadCount: 0 } 
          : conv
      ));
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const selectConversation = (conv) => {
    setActiveThread(conv);
    fetchThread(conv.otherUser._id, conv.item ? conv.item._id : 'no-item');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread) return;

    try {
      const { data } = await API.post('/messages', {
        receiverId: activeThread.otherUser._id,
        itemId: activeThread.item ? activeThread.item._id : null,
        content: newMessage
      });
      
      setMessages([...messages, data]);
      setNewMessage('');
      fetchConversations(); // Update side bar
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div className="page-container"><Loader /></div>;

  return (
    <div className="page-container messages-page">
      <div className="container">
        <h1 className="page-title text-center">Messages</h1>
        
        <div className="messages-layout glass-card">
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p className="no-messages-text">No conversations found.</p>
            ) : (
              conversations.map((conv, idx) => (
                <div 
                  key={idx} 
                  className={`conversation-item ${activeThread?.otherUser?._id === conv.otherUser._id && activeThread?.item?._id === conv.item?._id ? 'active' : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conversation-header">
                    <h4>{conv.otherUser.name}</h4>
                    {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
                  </div>
                  {conv.item && <p className="conversation-item-title">Item: {conv.item.title}</p>}
                  <p className="conversation-last-msg">
                    {conv.lastMessage.content.length > 30 ? conv.lastMessage.content.substring(0, 30) + '...' : conv.lastMessage.content}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="chat-area">
            {activeThread ? (
              <>
                <div className="chat-header">
                  <h3>Chat with {activeThread.otherUser.name}</h3>
                  {activeThread.item && <p className="chat-item">About: {activeThread.item.title}</p>}
                </div>
                
                <div className="chat-messages">
                  {messages.map((msg) => (
                    <div key={msg._id} className={`message-bubble-container ${msg.sender._id === user._id || msg.sender === user._id ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        {msg.content}
                      </div>
                      <div className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="form-input"
                  />
                  <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>Send</button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
