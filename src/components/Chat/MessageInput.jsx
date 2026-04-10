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
    typingTimer.current = setTimeout(
      () => emitStopTyping(activeChat._id),
      1500,
    );
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
    emitStopTyping(activeChat._id);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 bg-slate-900 border-t border-slate-800">
      <textarea
        placeholder="Type..."
        value={text}
        onChange={handleChange}
        rows={1}
        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs sm:text-sm outline-none resize-none max-h-28"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="p-2 sm:p-3 bg-sky-500 text-white rounded-xl disabled:opacity-40">
        ➤
      </button>
    </div>
  );
}
