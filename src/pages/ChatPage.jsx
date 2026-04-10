import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Layout/Sidebar";
import ChatBox from "../components/Chat/ChatBox";
import { useNotifications } from "../context/NotificationContext";

export default function ChatPage() {
  const { fetchChats, activeChat } = useChat();
  const { requestBrowserPermission } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchChats();
    requestBrowserPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChats]);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile menu */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden absolute top-3 left-4 z-20 bg-slate-300 p-2 rounded-lg text-xl">
          ☰
        </button>

        {activeChat ? (
          <ChatBox />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            No chat selected
          </div>
        )}
      </main>
    </div>
  );
}
