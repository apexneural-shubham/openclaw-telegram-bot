import { useState, useRef, useEffect } from 'react';
import './ChatView.css';

/**
 * Full-screen conversational interface.
 * AI agents explain reasoning, ask questions, and notify when actions need approval.
 * They never force decisions inline—approvals are handled in the Approvals tab.
 */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  /** When set, indicates an action was suggested; user decides in Approvals tab */
  pendingApprovalId?: string;
}

const PLACEHOLDER_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "I've analysed the request. I can schedule the meeting and notify the team—this will need your approval before I run it.",
    timestamp: new Date(),
    pendingApprovalId: 'action-1',
  },
  {
    id: '2',
    role: 'user',
    content: 'Sounds good, I’ll check Approvals.',
    timestamp: new Date(),
  },
];

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>(PLACEHOLDER_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="chat-view">
      <header className="chat-header">
        <h1 className="chat-title">Chat</h1>
        <p className="chat-subtitle">Ask questions. Approvals happen in the Approvals tab.</p>
      </header>
      <div className="chat-messages" ref={listRef} role="log" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`chat-message chat-message--${m.role}`}>
            <div className="chat-message-bubble">
              <p className="chat-message-text">{m.content}</p>
              {m.pendingApprovalId && (
                <p className="chat-message-hint">→ Open Approvals to decide</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-wrap">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          aria-label="Message"
        />
        <button type="button" className="chat-send" onClick={send} aria-label="Send">
          Send
        </button>
      </div>
    </div>
  );
}
