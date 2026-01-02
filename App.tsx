
import React, { useState, useRef, useEffect } from 'react';
import { Message, SUPPORTED_LANGUAGES, Language, ActiveTab } from './types';
import { getSwasthResponse } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import Disclaimer from './components/Disclaimer';
import Login from './components/Login';
import HowItWorks from './components/HowItWorks';
import PrivacySafety from './components/PrivacySafety';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('swasth_auth') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('swasth_email');
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('swasth_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    return [{
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am Swasth AI. How can I assist you with your health awareness today? I can provide information about symptoms, causes, and prevention of various health conditions.\n\nनमस्ते! मैं स्वस्थ AI हूँ। आज मैं स्वास्थ्य जागरूकता के बारे में आपकी कैसे मदद कर सकता हूँ?",
      timestamp: new Date(),
    }];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('swasth_history', JSON.stringify(messages));
    }
  }, [messages, isAuthenticated]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem('swasth_auth', 'true');
    localStorage.setItem('swasth_email', email);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out? Your chat history will be cleared.")) {
      setIsAuthenticated(false);
      setUserEmail(null);
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am Swasth AI. How can I assist you with your health awareness today?",
        timestamp: new Date(),
      }]);
      localStorage.removeItem('swasth_auth');
      localStorage.removeItem('swasth_email');
      localStorage.removeItem('swasth_history');
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const base64Audio = await blobToBase64(audioBlob);
        handleSendVoice(base64Audio, mediaRecorder.mimeType);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendVoice = async (base64Audio: string, mimeType: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: "[Voice Input Received]",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setActiveTab('chat');

    try {
      const response = await getSwasthResponse(
        messages, 
        "", 
        selectedLang.name, 
        { data: base64Audio, mimeType }
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string = input, e?: React.FormEvent) => {
    e?.preventDefault();
    const query = text.trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setActiveTab('chat');

    try {
      const response = await getSwasthResponse([...messages, userMessage], query, selectedLang.name);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all messages?")) {
      setMessages([messages[0]]);
      localStorage.removeItem('swasth_history');
    }
  };

  const suggestedTopics = [
    { title: "Diabetes Symptoms", query: "What are common symptoms of diabetes?" },
    { title: "Hypertension Prevention", query: "How can I prevent high blood pressure?" },
    { title: "Common Cold vs Flu", query: "Difference between common cold and flu symptoms" },
    { title: "Healthy Diet", query: "Suggest some basic dietary habits for heart health" },
  ];

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg ring-2 ring-emerald-50 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <i className="fas fa-heartbeat text-white text-xl"></i>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-slate-800 leading-tight truncate">Swasth AI</h1>
            <p className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase truncate">Multilingual Awareness</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:block">
            <select 
              value={selectedLang.code}
              onChange={(e) => {
                const lang = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                if (lang) setSelectedLang(lang);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-full focus:ring-emerald-500 focus:border-emerald-500 block w-full px-3 py-1.5 cursor-pointer hover:bg-white transition-all shadow-sm"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Clear Chat"
          >
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className={`
          fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40
          w-72 bg-white border-r border-slate-200 p-6 flex flex-col shadow-2xl md:shadow-none
        `}>
          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Navigation</h3>
            <nav className="space-y-1">
              <button 
                onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-semibold transition-all group ${activeTab === 'chat' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className={`fas fa-comment-dots ${activeTab === 'chat' ? 'text-emerald-600' : 'group-hover:text-emerald-500'}`}></i>
                <span>Active Chat</span>
              </button>
              <button 
                onClick={() => { setActiveTab('how-it-works'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-semibold transition-all group ${activeTab === 'how-it-works' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className={`fas fa-info-circle ${activeTab === 'how-it-works' ? 'text-emerald-600' : 'group-hover:text-emerald-500'}`}></i>
                <span>How it Works</span>
              </button>
              <button 
                onClick={() => { setActiveTab('privacy'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-semibold transition-all group ${activeTab === 'privacy' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className={`fas fa-shield-alt ${activeTab === 'privacy' ? 'text-emerald-600' : 'group-hover:text-emerald-500'}`}></i>
                <span>Privacy & Safety</span>
              </button>
            </nav>
          </div>

          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">User Session</h3>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-100">
                {userEmail?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">{userEmail}</p>
                <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold hover:underline">Sign Out</button>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <i className="fas fa-hand-holding-medical text-4xl"></i>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold uppercase mb-2 relative z-10">AI Health Guide</p>
              <p className="text-sm text-slate-800 font-bold relative z-10">Swasth AI Platform</p>
              <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="mt-3 block text-[10px] text-emerald-600 font-bold hover:underline relative z-10">
                Powered by Gemini AI <i className="fas fa-external-link-alt ml-0.5"></i>
              </a>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden z-30" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <main className="flex-1 flex flex-col min-w-0 bg-white md:bg-slate-50 relative overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-28 scroll-smooth">
                <div className="max-w-3xl mx-auto">
                  <Disclaimer />
                  <div className="space-y-2">
                    {messages.map((msg) => (
                      <ChatBubble key={msg.id} message={msg} />
                    ))}
                  </div>
                  
                  {messages.length === 1 && (
                    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-6 flex items-center justify-center">
                        <span className="h-px w-8 bg-slate-200 mr-4"></span>
                        Quick Start
                        <span className="h-px w-8 bg-slate-200 ml-4"></span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
                        {suggestedTopics.map((topic, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(topic.query)}
                            className="p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-100 transition-all group flex items-start space-x-3"
                          >
                            <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                              <i className="fas fa-lightbulb text-xs"></i>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{topic.title}</p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{topic.query}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-6 mt-4 ml-10">
                      <div className="flex items-center space-x-2 bg-emerald-50/50 px-4 py-3 rounded-2xl rounded-tl-none border border-emerald-100/50 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                  <form onSubmit={(e) => handleSend(input, e)} className="relative flex items-center group">
                    <div className="relative flex-1 shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white border border-slate-200 group-focus-within:border-emerald-500 transition-all ring-0 group-focus-within:ring-4 group-focus-within:ring-emerald-500/10">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about symptoms or health tips..."
                        className="w-full bg-transparent border-none px-4 sm:px-6 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
                        disabled={isLoading || isRecording}
                        style={{ color: '#0f172a' }}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        <button 
                          type="button"
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`p-2.5 rounded-xl transition-all ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                          title="Voice Search"
                          disabled={isLoading}
                        >
                          <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || !input.trim() || isRecording}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isLoading || !input.trim() || isRecording ? 'bg-slate-100 text-slate-300' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95'}`}
                        >
                          {isLoading ? <i className="fas fa-circle-notch fa-spin text-xs"></i> : <i className="fas fa-arrow-up"></i>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : activeTab === 'how-it-works' ? (
            <div className="flex-1 overflow-y-auto bg-white">
              <HowItWorks />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-white">
              <PrivacySafety />
            </div>
          )}

          {isRecording && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-200">
              <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm w-full mx-4 ring-1 ring-emerald-50">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                  <div className="relative bg-emerald-600 w-24 h-24 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200">
                    <i className="fas fa-microphone text-white text-4xl"></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Listening...</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">Tell Swasth AI what you're feeling. Describe your symptoms or ask for health advice in your native language.</p>
                <div className="flex space-x-4">
                  <button 
                    onClick={stopRecording}
                    className="px-10 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all shadow-lg active:scale-95 flex items-center"
                  >
                    <i className="fas fa-stop mr-2"></i> Stop & Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
