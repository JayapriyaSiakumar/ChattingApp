import { useEffect } from "react";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Layout/Sidebar";
import ChatBox from "../components/Chat/ChatBox";
import { useNotifications } from "../context/NotificationContext";

export default function ChatPage() {
  const { fetchChats, activeChat } = useChat();
  const { requestBrowserPermission } = useNotifications();

  useEffect(() => {
    fetchChats();
    requestBrowserPermission();
  }, [fetchChats]);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeChat ? (
          <ChatBox />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700/50">
              <span className="text-4xl">💬</span>
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-semibold text-lg">
                No chat selected
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Pick a conversation or search for someone to message
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
