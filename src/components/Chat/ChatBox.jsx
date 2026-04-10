import { useRef, useEffect } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import MessageItem from "./Message";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatBox() {
  const { activeChat, messages, typingUsers } = useChat();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getChatName = () =>
    activeChat.isGroupChat
      ? activeChat.name
      : activeChat.participants.find((p) => p._id !== user._id)?.name || "Chat";

  const getChatAvatar = () =>
    activeChat.isGroupChat
      ? `https://api.dicebear.com/7.x/initials/svg?seed=${activeChat.name}`
      : activeChat.participants.find((p) => p._id !== user._id)?.avatar;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-end w-full gap-3 px-3 sm:px-5 py-3 bg-slate-900 border-b border-slate-800">
        <div className="min-w-0">
          <p className="font-semibold text-slate-100 text-sm truncate">
            {getChatName()}
          </p>
          {activeChat.isGroupChat && (
            <p className="text-xs text-slate-500">
              {activeChat.participants.length} members
            </p>
          )}
        </div>
        <img
          src={getChatAvatar()}
          alt={getChatName()}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 flex flex-col gap-1 bg-slate-950">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-600 text-sm">No messages yet</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageItem
            key={msg._id || i}
            message={msg}
            isOwn={msg.sender?._id === user._id}
            showAvatar={
              !activeChat.isGroupChat ||
              msg.sender?._id !== messages[i - 1]?.sender?._id
            }
          />
        ))}

        {typingUsers[activeChat._id] && (
          <TypingIndicator user={typingUsers[activeChat._id]} />
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
}
