import { useState, useRef } from "react";
import { useChat } from "../../context/ChatContext";

export default function MessageInput() {
  const { sendMessage, emitTyping, emitStopTyping, activeChat } = useChat();
  const [text, setText] = useState("");
  const typingTimer = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    emitTyping(activeChat._id);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitStopTyping(activeChat._id), 1500);
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
    emitStopTyping(activeChat._id);
  };

  return (
    <div className="flex items-end gap-3 px-4 py-3 bg-slate-900 border-t border-slate-800">
      <textarea
        placeholder="Type a message…"
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
        rows={1}
        className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none transition-all max-h-32"
      />
      <button onClick={handleSend} disabled={!text.trim()}
        className="p-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-sky-500/25 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
}