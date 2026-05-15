import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Plus, MessageSquare, History, LayoutPanelLeft, MoreVertical, Trash2, Paperclip, X } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message, isAi }) => (
  <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
    <div className={`flex max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isAi ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-blue-600 text-white shadow-lg'} transition-transform hover:scale-110`}>
        {isAi ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className={`mx-3 p-4 rounded-2xl shadow-sm ${isAi ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none'}`}>
        <div className="prose prose-sm max-w-none leading-relaxed text-[14.5px]">
          {isAi ? (
            <ReactMarkdown 
              components={{
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="marker:text-blue-500" {...props} />,
                strong: ({node, ...props}) => <strong className="font-extrabold text-blue-900" {...props} />,
              }}
            >
              {message}
            </ReactMarkdown>
          ) : (
            <div className="whitespace-pre-wrap">{message}</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AiMentor = () => {
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSessionTitle, setActiveSessionTitle] = useState('Yeni Sohbet');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null); // Track which session's menu is open
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Click outside to close menu
  useEffect(() => {
    const handler = () => setMenuOpenId(null);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const token = localStorage.getItem('token');
  let userEmail = 'guest_user';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userEmail = payload.sub || 'guest_user';
    } catch (e) {
      console.error("Token parse hatası", e);
    }
  }

  const createNewSession = () => {
    const newId = crypto.randomUUID();
    setActiveSessionId(newId);
    setActiveSessionTitle("Yeni Sohbet");
    setMessages([
      { text: "Merhaba! Ben senin kariyer yolculuğunda sana rehberlik edecek AI Mentorun. Bugün senin için ne yapabilirim?", isAi: true }
    ]);
  };

  // Fetch Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/ai/sessions/${userEmail}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.data && res.data.length > 0) {
          setSessions(res.data);
          setActiveSessionId(res.data[0].id);
          setActiveSessionTitle(res.data[0].title);
        } else {
          createNewSession();
        }
      } catch (err) {
        console.error("Sohbetler yüklenemedi", err);
        createNewSession();
      }
    };
    fetchSessions();
  }, [userEmail]);

  // Fetch History for Active Session
  useEffect(() => {
    const fetchHistory = async () => {
      if (!activeSessionId || !token) return;
      
      if (!sessions.find(s => s.id === activeSessionId)) {
        // Yeni açılan ama veritabanında olmayan sohbet
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/ai/history/${activeSessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data && response.data.length > 0) {
          const loadedMessages = response.data.map(interaction => ({
            text: interaction.content,
            isAi: interaction.messageType === 'ASSISTANT' || interaction.messageType === 'SYSTEM'
          }));
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error("Geçmiş sohbetler yüklenemedi:", error);
      }
    };

    fetchHistory();
  }, [activeSessionId, sessions, token]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage || '📄 Dosya Yüklendi', isAi: false }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', userMessage);
      formData.append('chatId', activeSessionId);
      formData.append('userEmail', userEmail);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.post('http://localhost:8080/api/ai/ask', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessages(prev => [...prev, { text: response.data.answer, isAi: true }]);
      removeFile(); // Dosya gönderildikten sonra temizle
      
      // Yenile ki 'Yeni Sohbet' veritabanı başlığıyla güncellensin
      const res = await axios.get(`http://localhost:8080/api/ai/sessions/${userEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSessions(res.data);
      const updatedSession = res.data.find(s => s.id === activeSessionId);
      if (updatedSession) setActiveSessionTitle(updatedSession.title);

    } catch (error) {
      setMessages(prev => [...prev, { text: "Üzgünüm, şu an bağlantıda bir sorun yaşıyorum.", isAi: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8080/api/ai/history/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const remaining = sessions.filter(s => s.id !== sessionId);
      setSessions(remaining);
      setMenuOpenId(null);
      
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
          setActiveSessionTitle(remaining[0].title);
        } else {
          createNewSession();
        }
      }
    } catch (error) {
      console.error("Sohbet silinirken hata:", error);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-100 flex flex-col hidden lg:flex z-20">
        <div className="p-5">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-2xl text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95 group"
          >
            <Plus size={18} className="text-gray-400 group-hover:text-blue-500" />
            Yeni Sohbet Başlat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
             <History size={12} /> Yakın Zamandaki Sohbetler
          </div>
          {sessions.map(session => (
            <div 
              key={session.id}
              onClick={() => {
                setActiveSessionId(session.id);
                setActiveSessionTitle(session.title);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all relative group ${activeSessionId === session.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <MessageSquare size={16} className={activeSessionId === session.id ? 'text-blue-600' : 'text-gray-400'} />
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate pr-6">{session.title}</div>
                <div className="text-[10px] opacity-60 font-medium italic">{session.createdAt ? formatDate(session.createdAt) : 'Bugün'}</div>
              </div>
              
              {/* 3 Nokta Menüsü (Sol Kutucuğun Sağı) */}
              <div className={`absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity ${activeSessionId === session.id ? 'opacity-100' : ''}`}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === session.id ? null : session.id);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${activeSessionId === session.id ? 'hover:bg-blue-100 text-blue-500' : 'hover:bg-gray-200 text-gray-400'}`}
                >
                  <MoreVertical size={16} />
                </button>

                {menuOpenId === session.id && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={(e) => handleDeleteChat(e, session.id)}
                      className="w-full text-left px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 font-medium"
                    >
                      <Trash2 size={14} />
                      Sohbeti Sil
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-100/50 m-4 rounded-2xl border border-gray-200/50">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
              <LayoutPanelLeft size={14} /> Dinamik Kariyer Belleği
           </div>
           <div className="text-[11px] text-gray-400 leading-tight">
              AI, yeteneklerini ve profilini bu sohbete otomatik dahil etti.
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white lg:rounded-l-[40px] shadow-2xl shadow-gray-200">
        
        <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 lg:rounded-tl-[40px]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 animate-pulse">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-none mb-1">{activeSessionTitle}</h2>
              <div className="text-xs font-medium text-blue-500">Mentorship Platform Elite Assistant</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg.text} isAi={msg.isAi} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-4 rounded-2xl shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">Mentorun inceliyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 lg:rounded-bl-[40px]">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group flex flex-col gap-2">
            {/* Seçili Dosya Çipi (Chip) */}
            {selectedFile && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full w-max text-blue-700 animate-in slide-in-from-bottom-2">
                <Paperclip size={14} className="text-blue-500" />
                <span className="text-xs font-semibold max-w-[200px] truncate">{selectedFile.name}</span>
                <button type="button" onClick={removeFile} className="hover:bg-blue-200 p-0.5 rounded-full text-blue-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}
            
            <div className="relative flex items-center">
              {/* Gizli Dosya Input'u */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
              />
              
              {/* Dosya Seç Butonu */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-2 p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-full transition-all z-10"
              >
                <Paperclip size={20} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mentoruna kariyerin hakkında bir mesaj yaz (veya dosya ekle)..."
                className="w-full py-5 pl-14 pr-16 bg-gray-50/50 border border-transparent focus:border-blue-500 focus:bg-white rounded-[25px] outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-inner"
              />
              
              <button
                type="submit"
                disabled={(!input.trim() && !selectedFile) || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3.5 rounded-full transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-300 transform active:scale-90 flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;
