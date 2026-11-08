'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Send, ArrowLeft, Building2, 
  CheckCheck, RefreshCw, Phone, Clock
} from 'lucide-react';
import { useToast } from '@/components/ToastContext';

export default function VendorMessagesPage() {
  const toast = useToast();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/vendor/messages');
      const data = await res.json();
      if (data.threads) {
        setThreads(data.threads);
        if (!activeThreadId && data.threads.length > 0) {
          setActiveThreadId(data.threads[0].thread_id);
        }
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, activeThreadId]);

  const activeThread = threads.find((t) => t.thread_id === activeThreadId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeThreadId) return;

    setSending(true);
    const textToSend = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await fetch('/api/vendor/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: activeThreadId,
          message: textToSend,
        }),
      });

      if (res.ok) {
        fetchThreads();
      } else {
        toast.error('Gagal mengirim pesan.', 'Error');
      }
    } catch (err) {
      toast.error('Terjadi gangguan jaringan.', 'Error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4" data-ui="vendor-messages">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/vendor" className="text-[#8d8d8d] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-white">
              Messages
            </h1>
            <p className="font-inter text-xs text-[#8d8d8d]">
              Saluran koordinasi langsung antara Vendor dengan Admin Event Organizer (EO).
            </p>
          </div>
        </div>

        <button
          onClick={fetchThreads}
          className="p-2 rounded-[8px] bg-[#1a1a1a] border border-[#2e2e2e] text-[#bdbdbd] hover:text-white transition-colors"
          title="Segarkan Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main 2-Pane Chat Box */}
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-[12px] overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100dvh-220px)] min-h-[500px]">
        {/* Left Pane: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-[#2e2e2e] flex flex-col bg-[#161616]">
          <div className="p-3.5 border-b border-[#2e2e2e] text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider flex items-center justify-between">
            <span>Daftar EO & Event</span>
            <span className="text-[10px] bg-[#242424] px-2 py-0.5 rounded-full text-white">{threads.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#222222]">
            {loading ? (
              <div className="p-6 text-center text-xs text-[#8d8d8d]">
                Memuat percakapan...
              </div>
            ) : threads.map((thread) => {
              const isActive = thread.thread_id === activeThreadId;
              return (
                <button
                  key={thread.thread_id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.thread_id)}
                  className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-[#242424] border-l-4 border-l-[#ff6b35]' : 'hover:bg-[#1f1f1f]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center shrink-0 font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-white truncate">
                        {thread.eo_name}
                      </span>
                      <span className="text-[10px] text-[#666666] shrink-0">
                        {thread.last_time}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#ff6b35] font-medium block truncate">
                      {thread.event_name}
                    </span>
                    <p className="text-[11px] text-[#8d8d8d] truncate mt-0.5">
                      {thread.last_message}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat Window (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-[#121212]">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="h-14 px-5 border-b border-[#2e2e2e] bg-[#171717] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#242424] text-[#ff6b35] flex items-center justify-center font-bold text-xs border border-[#333333]">
                    EO
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-white">
                      {activeThread.eo_name}
                    </h3>
                    <span className="text-[10px] text-[#8cd6b0] block">
                      Event: {activeThread.event_name} • Terhubung Langsung
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toast.success('Fitur panggilan suara langsung dihubungkan ke WhatsApp EO.', 'Panggilan Terhubung')}
                    className="p-2 rounded bg-[#242424] hover:bg-[#2e2e2e] text-[#bdbdbd] hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                    title="Hubungi via WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8cd6b0]" />
                    <span className="hidden sm:inline">Hubungi PIC</span>
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="text-center my-2">
                  <span className="text-[10px] text-[#666666] bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#262626]">
                    Saluran koordinasi resmi SPK & logistik panggung
                  </span>
                </div>

                {activeThread.messages.map((msg) => {
                  const isVendor = msg.sender === 'vendor';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isVendor ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-[#666666] mb-1 px-1">
                        {msg.sender_name}
                      </span>
                      <div
                        className={`max-w-[80%] rounded-[12px] p-3.5 text-xs leading-relaxed ${
                          isVendor
                            ? 'bg-[#ff6b35] text-[#171717] font-medium rounded-br-none shadow-md shadow-[#ff6b35]/20'
                            : 'bg-[#242424] text-white border border-[#333333] rounded-bl-none'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div
                          className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${
                            isVendor ? 'text-[#171717]/80' : 'text-[#8d8d8d]'
                          }`}
                        >
                          <span>{msg.time}</span>
                          {isVendor && <CheckCheck className="w-3 h-3 text-[#171717]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2e2e2e] bg-[#171717] flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Kirim pesan balasan ke ${activeThread.eo_name}...`}
                  className="flex-1 bg-[#121212] border border-[#333333] rounded-[8px] px-3.5 py-2 text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#ff6b35]"
                />
                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="px-4 py-2 rounded-[8px] bg-[#ff6b35] text-[#171717] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#e5531e] disabled:opacity-50 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8d8d8d]">
              <MessageSquare className="w-10 h-10 mb-2 text-[#444444]" />
              <p className="text-xs">Pilih percakapan dari daftar di sebelah kiri untuk mulai berkirim pesan dengan EO.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
