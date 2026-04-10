import { useNotifications } from "../../context/NotificationContext";
import { useChat } from "../../context/ChatContext";
import { formatDistanceToNow } from "date-fns";

export default function NotificationPanel({ onClose }) {
  const {
    notifications,
    loading,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();
  const { openChat, chats } = useChat();

  const handleClick = (notification) => {
    const chat = chats.find((c) => c._id === notification.chat?._id);
    if (chat) {
      openChat(chat);
      onClose();
    }
  };

  return (
<div className="absolute right-0 top-12 w-72 sm:w-80 max-h-[70vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">      {/* Header */}
      <div className="flex items-center justify-between px-1 py-3 border-b border-slate-800">
        <h3 className="font-semibold text-slate-100 text-sm">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
            Mark all read
          </button>
          <button
            onClick={clearAll}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors">
            Clear all
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-500">
            <span className="text-3xl">🔔</span>
            <p className="text-sm">No notifications yet</p>
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleClick(n)}
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-slate-800/50 hover:bg-slate-800 ${
              !n.isRead ? "bg-sky-500/5 border-l-2 border-l-sky-500" : ""
            }`}>
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={n.sender?.avatar}
                alt={n.sender?.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              {!n.isRead && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-slate-900" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200">
                <span className="font-semibold">{n.sender?.name}</span>
                {n.chat?.isGroupChat ? (
                  <span className="text-slate-400">
                    {" "}
                    in <span className="text-slate-300">{n.chat?.name}</span>
                  </span>
                ) : (
                  <span className="text-slate-400"> sent you a message</span>
                )}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {n.content}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNotification(n._id);
              }}
              className="shrink-0 text-slate-600 hover:text-red-400 transition-colors p-1">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
