import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Plus, MessageSquare, History, ChevronRight, LayoutPanelLeft } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [activeSession, setActiveSession] = useState('Genel Kariyer Rehberliği');
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Genel Kariyer Rehberliği', date: 'Bugün' },
    { id: 2, title: 'CV İnceleme ve Tavsiyeler', date: 'Dün' },
    { id: 3, title: 'Mülakat Teknikleri', date: '15 Nisan' }
  ]);
  const [messages, setMessages] = useState([
    { text: "Merhaba! Ben senin kariyer yolculuğunda sana rehberlik edecek AI Mentorun. Bugün senin için ne yapabilirim?", isAi: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isAi: false }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/ai/ask', {
        question: userMessage,
        chatId: user?.email || 'guest_user'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { text: response.data.answer, isAi: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Üzgünüm, şu an bağlantıda bir sorun yaşıyorum. Lütfen biraz sonra tekrar dene.", isAi: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-100 flex flex-col hidden lg:flex">
        <div className="p-5">
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 p-3 rounded-2xl text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95 group">
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
              onClick={() => setActiveSession(session.title)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeSession === session.title ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <MessageSquare size={16} className={activeSession === session.title ? 'text-blue-600' : 'text-gray-400'} />
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">{session.title}</div>
                <div className="text-[10px] opacity-60 font-medium italic">{session.date}</div>
              </div>
              <ChevronRight size={14} className={activeSession === session.title ? 'text-blue-400' : 'opacity-0'} />
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-100/50 m-4 rounded-2xl border border-gray-200/50">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
              <LayoutPanelLeft size={14} /> Kariyer Durumun
           </div>
           <div className="text-[11px] text-gray-400 leading-tight">
              Mentorunuz son dökümanları inceledi ve size özel tavsiyelerini hazırladı.
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
              <h2 className="font-bold text-gray-900 text-lg leading-none mb-1">{activeSession}</h2>
              <div className="text-xs font-medium text-blue-500">Elite Career Assistant Engaged</div>
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
                  <span className="text-xs font-semibold text-gray-500">Mentorun yanıtlıyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-50 lg:rounded-bl-[40px]">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mentoruna kariyer hedeflerin hakkında bir mesaj yaz..."
              className="w-full p-5 bg-gray-50/50 border border-transparent focus:border-blue-500 focus:bg-white rounded-[25px] outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-inner pr-16"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3.5 rounded-full transition-all duration-300 shadow-lg shadow-blue-100 hover:shadow-blue-300 transform active:scale-90 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;
