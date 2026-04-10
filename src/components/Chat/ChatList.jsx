import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function ChatList() {
  const { chats, activeChat, openChat, onlineUsers } = useChat();
  const { user } = useAuth();

  const getChatName = (chat) =>
    chat.isGroupChat
      ? chat.name
      : chat.participants.find((p) => p._id !== user._id)?.name || "Unknown";

  const getChatAvatar = (chat) =>
    chat.isGroupChat
      ? `https://api.dicebear.com/7.x/initials/svg?seed=${chat.name}`
      : chat.participants.find((p) => p._id !== user._id)?.avatar || "";

  const getOther = (chat) => chat.participants.find((p) => p._id !== user._id);

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 && (
        <p className="text-center text-slate-600 text-sm px-4 py-8">
          No conversations yet. Search for a user to start chatting!
        </p>
      )}
      {chats.map((chat) => {
        const other = !chat.isGroupChat ? getOther(chat) : null;
        const isOnline = other ? onlineUsers.has(other._id) : false;
        const isActive = activeChat?._id === chat._id;
        return (
          <button key={chat._id} onClick={() => openChat(chat)}
            className={`flex items-center gap-3 w-full px-4 py-3 border-b border-slate-800/50 transition-colors text-left ${
              isActive ? "bg-sky-500/10 border-l-2 border-l-sky-500" : "hover:bg-slate-800/50"
            }`}>
            <div className="relative shrink-0">
              <img src={getChatAvatar(chat)} alt={getChatName(chat)}
                className="w-11 h-11 rounded-full object-cover" />
              {!chat.isGroupChat && isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              )}
              {chat.isGroupChat && (
                <span className="absolute -bottom-0.5 -right-0.5 text-xs">👥</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-sm font-semibold truncate ${isActive ? "text-sky-300" : "text-slate-100"}`}>
                  {getChatName(chat)}
                </span>
                {chat.lastMessage && (
                  <span className="text-xs text-slate-600 whitespace-nowrap shrink-0">
                    {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {chat.lastMessage
                  ? `${chat.lastMessage.sender?._id === user._id ? "You: " : ""}${chat.lastMessage.content}`
                  : "No messages yet"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}