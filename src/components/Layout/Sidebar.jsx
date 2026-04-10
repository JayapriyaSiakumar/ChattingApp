import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import ChatList from "../Chat/ChatList";
import api from "../../utils/api";
import toast from "react-hot-toast";
import NotificationBell from "../Notifications/NotificationBell";

export default function Sidebar({ isOpen = true, setIsOpen = () => {} }) {
  const { user, logout } = useAuth();
  const { startChat, createGroup } = useChat();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showGroup, setShowGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);
  const [memberSearch, setMemberSearch] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const { data } = await api.get(`/users?search=${value}`);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selected.length < 2) {
      return toast.error("Need a name and at least 2 members");
    }

    try {
      await createGroup(
        groupName,
        selected.map((u) => u._id),
      );
      setShowGroup(false);
      setGroupName("");
      setSelected([]);
      toast.success("Group created!");
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 text-xs sm:text-sm outline-none focus:border-sky-500 transition-all";

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-40
          w-[85%] sm:w-[320px] md:w-80
          bg-slate-900 border-r border-slate-800
          flex flex-col overflow-hidden
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-emerald-400">Online</p>
          </div>

          <NotificationBell />

          {/* Mobile close */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400">
            ✕
          </button>

          <button
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-400">
            ⏻
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-800">
          <input
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            className={inputClass}
          />
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mx-3 mb-2 bg-slate-950 border border-slate-800 rounded-xl max-h-60 overflow-y-auto">
            {results.map((u) => (
              <button
                key={u._id}
                onClick={() => {
                  startChat(u._id);
                  setSearch("");
                  setResults([]);
                  setIsOpen(false); // mobile UX fix
                }}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-slate-800 text-left">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm text-slate-100">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Group Toggle */}
        <div className="px-3 py-2">
          <button
            onClick={() => setShowGroup(!showGroup)}
            className="w-full py-2 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:border-sky-500 hover:text-sky-400 text-sm">
            {showGroup ? "Cancel Group" : "New Group Chat"}
          </button>
        </div>

        {/* Group Create */}
        {showGroup && (
          <div className="mx-3 mb-3 p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2">
            <input
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={inputClass}
            />

            <input
              placeholder="Search members..."
              onChange={async (e) => {
                const value = e.target.value;
                if (value.length < 2) return setMemberSearch([]);

                try {
                  const { data } = await api.get(`/users?search=${value}`);
                  setMemberSearch(data);
                } catch (err) {
                  console.error(err);
                }
              }}
              className={inputClass}
            />

            {memberSearch.length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg max-h-40 overflow-y-auto">
                {memberSearch.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => {
                      if (!selected.find((s) => s._id === u._id)) {
                        setSelected([...selected, u]);
                      }
                      setMemberSearch([]);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-800 text-sm">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="text-slate-200">{u.name}</span>
                  </button>
                ))}
              </div>
            )}

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selected.map((u) => (
                  <span
                    key={u._id}
                    className="flex items-center gap-1 bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full text-xs">
                    {u.name}
                    <button
                      onClick={() =>
                        setSelected(selected.filter((s) => s._id !== u._id))
                      }>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleCreateGroup}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm rounded-lg">
              Create Group
            </button>
          </div>
        )}

        <ChatList />
      </aside>
    </>
  );
}
