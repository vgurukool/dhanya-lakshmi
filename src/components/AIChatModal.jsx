import React, { useState } from 'react';
import { X, Bot, Send, Sparkles } from 'lucide-react';

export function AIChatModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Namaste! I am your Dhanya Lakshmi Ayurvedic Nutrition Advisor. Ask me anything about Vedic nutrition, grain selection, dosha-balancing foods, Agni (digestive fire) optimization, or healing recipes.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response || 'Nourishment guidance provided.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to Ayurvedic knowledge engine. Please check backend connection on port 3003.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0F172A',
        border: '1px solid #334155',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '640px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
                Ayurvedic Nutrition & Food AI Advisor
              </h3>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Dhanya Lakshmi Intelligence Engine</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Message History */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '14px',
                backgroundColor: m.role === 'user' ? '#F59E0B' : '#1E293B',
                color: m.role === 'user' ? '#0B0F19' : '#F8FAFC',
                fontWeight: m.role === 'user' ? 700 : 500,
                fontSize: '13px',
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#1E293B', color: '#94A3B8', fontSize: '12px' }}>
              Consulting Ayurvedic scriptures & food science...
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ padding: '14px 20px', borderTop: '1px solid #1E293B', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ask about Kitchari, millets, water intake, or Sattvic foods..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px', color: '#F8FAFC', fontSize: '13px' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0 16px', backgroundColor: '#F59E0B', border: 'none', borderRadius: '8px', color: '#0B0F19', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
