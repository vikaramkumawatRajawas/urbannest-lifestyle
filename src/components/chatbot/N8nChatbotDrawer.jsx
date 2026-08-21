import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Settings,
  CheckCircle2,
  Link,
  Save,
  RotateCcw
} from "lucide-react";
import {
  sendChatbotMessage,
  getActiveN8nChatbotUrl,
  setCustomN8nChatbotUrl
} from "../../services/n8nChatbotService";

import aiAvatarImg from "../../assets/ai-assistant-avatar.png";

export const N8nChatbotDrawer = ({ isOpen, onClose, setActivePage }) => {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello 👋\nI’m your UrbanNest AI Assistant. Ask me anything about our home décor, soy candles, gift hampers, pricing in ₹, or store details!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [customUrlInput, setCustomUrlInput] = useState(getActiveN8nChatbotUrl());
  const [urlSaveStatus, setUrlSaveStatus] = useState(null);

  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What do you sell?",
    "Show me gift ideas",
    "Do you offer delivery?",
    "Where is the store?"
  ];

  const activeUrl = getActiveN8nChatbotUrl();
  const isCustomUrlActive = activeUrl && !activeUrl.includes("example.com") && !activeUrl.includes("your-n8n");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isSettingsOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isSettingsOpen]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setCustomN8nChatbotUrl(customUrlInput);
    setUrlSaveStatus("saved");
    setTimeout(() => {
      setUrlSaveStatus(null);
      setIsSettingsOpen(false);
    }, 1200);

    const updatedUrl = getActiveN8nChatbotUrl();
    const systemNotice = {
      id: `system-${Date.now()}`,
      sender: "bot",
      text: updatedUrl
        ? `N8N Chatbot URL updated to: "${updatedUrl}". Product questions will now route through this endpoint!`
        : "N8N Chatbot URL reset. Now using official UrbanNest Cloud Webhook.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, systemNotice]);
  };

  const handleResetUrl = () => {
    setCustomN8nChatbotUrl("");
    setCustomUrlInput("");
    setUrlSaveStatus("reset");
    setTimeout(() => {
      setUrlSaveStatus(null);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const handleSend = async (messageText) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatbotMessage(textToSend, messages);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        simulated: response.simulated,
        source: response.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "Apologies, connection to N8N timed out. You can also submit your question via our Customer Query Form!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-[#151918] text-[#F4EFE6] border border-[#D6B77A]/40 rounded-3xl shadow-[0_35px_80px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col h-[600px] animate-fadeIn">
      {/* Header */}
      <div className="p-4 bg-[#0B0D0E] text-[#F4EFE6] flex items-center justify-between border-b border-[#222926]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-[#151918] border border-[#7FFFD4]/40 flex items-center justify-center p-1 shadow-md">
            <img
              src={aiAvatarImg}
              alt="UrbanNest AI Assistant"
              className="w-full h-full object-contain"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#7FFFD4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif-luxury font-bold text-base text-[#F4EFE6] uppercase tracking-wider">
                UrbanNest <span className="text-[#D6B77A]">AI</span>
              </h3>
            </div>
            <p className="text-[10px] text-[#9E988F] flex items-center gap-1 uppercase tracking-widest">
              N8N Live Webhook Connected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Settings Toggle Button */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-xl transition-all ${
              isSettingsOpen
                ? "bg-[#D6B77A] text-[#0B0D0E]"
                : "hover:bg-[#222926] text-[#9E988F] hover:text-[#F4EFE6]"
            }`}
            title="N8N Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-rose-500/20 text-[#9E988F] hover:text-rose-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel Overlay */}
      {isSettingsOpen ? (
        <div className="flex-1 p-5 overflow-y-auto bg-[#0B0D0E] space-y-5 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#D6B77A] font-bold text-xs uppercase tracking-widest">
              <Link className="w-4 h-4" />
              <h4>N8N Integration Endpoint</h4>
            </div>
            <p className="text-xs text-[#9E988F] leading-relaxed font-light">
              Enter your live N8N.io AI Webhook URL below. Product questions will automatically route to your custom N8N workflow!
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#F4EFE6] uppercase tracking-widest mb-1.5">
                N8N Chatbot Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://uttamjangid.app.n8n.cloud/webhook/urbannest/chat"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-2xl bg-[#151918] text-[#F4EFE6] border border-[#D6B77A]/40 focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
              />
              <span className="text-[10px] text-[#9E988F] block mt-1">
                Payload format: <code>{"{ chatInput, message, sessionId }"}</code>
              </span>
            </div>

            {urlSaveStatus === "saved" && (
              <div className="p-3 rounded-2xl bg-emerald-950/80 text-[#7FFFD4] text-xs flex items-center gap-2 font-medium border border-[#7FFFD4]/40">
                <CheckCircle2 className="w-4 h-4 text-[#7FFFD4] shrink-0" />
                <span>N8N Webhook URL saved & activated!</span>
              </div>
            )}

            {urlSaveStatus === "reset" && (
              <div className="p-3 rounded-2xl bg-[#151918] text-[#D6B77A] text-xs flex items-center gap-2 font-medium border border-[#D6B77A]/40">
                <RotateCcw className="w-4 h-4 text-[#D6B77A] shrink-0" />
                <span>Reset to official N8N cloud webhook.</span>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-[#D6B77A] hover:bg-[#c4a466] text-[#0B0D0E] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save N8N URL</span>
              </button>

              <button
                type="button"
                onClick={handleResetUrl}
                className="px-4 py-3 rounded-2xl bg-[#151918] text-[#F4EFE6] border border-[#222926] hover:bg-[#222926] font-semibold text-xs uppercase tracking-widest cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </form>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full py-2 text-xs text-center font-bold text-[#9E988F] hover:text-[#F4EFE6] underline uppercase tracking-widest"
          >
            ← Back to AI Chat
          </button>
        </div>
      ) : (
        /* Messages Scroll Area */
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0B0D0E]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-[#151918] border border-[#7FFFD4]/40 flex items-center justify-center p-1 shrink-0 mt-0.5">
                  <img
                    src={aiAvatarImg}
                    alt="UrbanNest AI Assistant"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div
                className={`max-w-[84%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#D6B77A] text-[#0B0D0E] font-medium rounded-br-none shadow-md"
                    : "bg-[#151918] text-[#F4EFE6] border border-[#222926] rounded-bl-none shadow-xs"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-white/5 text-[9px] text-[#9E988F]">
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <span className="italic font-mono text-[9px] text-[#7FFFD4]">
                      {msg.source}
                    </span>
                  )}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-[#222926] text-[#F4EFE6] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#9E988F] py-2.5 px-4 bg-[#151918] rounded-2xl max-w-xs border border-[#222926]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#7FFFD4]" />
              <span>Contacting N8N AI Agent...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggested Quick Question Chips */}
      {!isSettingsOpen && (
        <div className="px-3 py-2 bg-[#151918] border-t border-[#222926] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {suggestedQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(question)}
              disabled={isLoading}
              className="inline-block px-3 py-1.5 rounded-full text-[10px] font-semibold bg-[#0B0D0E] text-[#D6B77A] hover:bg-[#D6B77A] hover:text-[#0B0D0E] border border-[#D6B77A]/30 transition-all shrink-0 uppercase tracking-wider cursor-pointer"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      {!isSettingsOpen && (
        <div className="p-3 bg-[#0B0D0E] border-t border-[#222926]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI about products, gift ideas, prices..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-[#151918] text-[#F4EFE6] border border-[#222926] focus:outline-none focus:ring-2 focus:ring-[#7FFFD4]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-2xl bg-[#D6B77A] text-[#0B0D0E] hover:bg-[#c4a466] disabled:opacity-40 transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
