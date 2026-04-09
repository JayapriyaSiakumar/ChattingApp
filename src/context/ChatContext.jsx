/* eslint-disable react-hooks/refs */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const socket = io("https://chatingapp-backend-5iaz.onrender.com", {
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("user:online", (userId) =>
      setOnlineUsers((prev) => new Set([...prev, userId])),
    );
    socket.on("user:offline", ({ userId }) =>
      setOnlineUsers((prev) => {
        const s = new Set(prev);
        s.delete(userId);
        return s;
      }),
    );

    socket.on("message:receive", (message) => {
      setMessages((prev) => [...prev, message]);
      setChats((prev) =>
        prev
          .map((c) =>
            c._id === message.chat._id ? { ...c, lastMessage: message } : c,
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      );
    });

    socket.on("typing:start", ({ chatId, user: typingUser }) =>
      setTypingUsers((prev) => ({ ...prev, [chatId]: typingUser })),
    );
    socket.on("typing:stop", ({ chatId }) =>
      setTypingUsers((prev) => {
        const n = { ...prev };
        delete n[chatId];
        return n;
      }),
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const fetchChats = useCallback(async () => {
    const { data } = await api.get("/chats");
    setChats(data);
  }, []);

  const openChat = useCallback(
    async (chat) => {
      if (activeChat?._id === chat._id) return;
      if (activeChat) socketRef.current?.emit("chat:leave", activeChat._id);
      setActiveChat(chat);
      socketRef.current?.emit("chat:join", chat._id);
      const { data } = await api.get(`/messages/${chat._id}`);
      setMessages(data);
    },
    [activeChat],
  );

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || !activeChat) return;
      const { data } = await api.post("/messages", {
        chatId: activeChat._id,
        content,
      });
      setMessages((prev) => [...prev, data]);
      socketRef.current?.emit("message:send", data);
      setChats((prev) =>
        prev
          .map((c) =>
            c._id === activeChat._id
              ? { ...c, lastMessage: data, updatedAt: new Date() }
              : c,
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
      );
    },
    [activeChat],
  );

  const startChat = useCallback(
    async (userId) => {
      const { data } = await api.post("/chats", { userId });
      setChats((prev) => {
        const exists = prev.find((c) => c._id === data._id);
        return exists ? prev : [data, ...prev];
      });
      openChat(data);
      return data;
    },
    [openChat],
  );

  const createGroup = useCallback(
    async (name, participants) => {
      const { data } = await api.post("/chats/group", { name, participants });
      setChats((prev) => [data, ...prev]);
      openChat(data);
      return data;
    },
    [openChat],
  );

  const emitTyping = (chatId) =>
    socketRef.current?.emit("typing:start", { chatId, user });
  const emitStopTyping = (chatId) =>
    socketRef.current?.emit("typing:stop", { chatId, userId: user?._id });

  return (
    <ChatContext.Provider
      value={{
        socket: socketRef.current,
        chats,
        activeChat,
        messages,
        typingUsers,
        onlineUsers,
        socketConnected,
        fetchChats,
        openChat,
        sendMessage,
        startChat,
        createGroup,
        emitTyping,
        emitStopTyping,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);
