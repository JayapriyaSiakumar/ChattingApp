import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import ChatList from "../Chat/ChatList";
import api from "../../utils/api";
import toast from "react-hot-toast";
import NotificationBell from "../Notifications/NotificationBell";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { startChat, createGroup } = useChat();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showGroup, setShowGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);
  const [memberSearch, setMemberSearch] = useState([]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length < 2) return setResults([]);
    const { data } = await api.get(`/users?search=${e.target.value}`);
    setResults(data);
  };

  const handleCreateGroup = async () => {
    if (!groupName || selected.length < 2)
      return toast.error("Need a name and at least 2 members");
    await createGroup(
      groupName,
      selected.map((u) => u._id),
    );
    setShowGroup(false);
    setGroupName("");
    setSelected([]);
    toast.success("Group created!");
  };

  const inputClass =
    "w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 text-sm outline-none focus:border-sky-500 transition-all";

  return (
    <aside className="w-80 min-w-[280px] bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/30"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
            Online
          </p>
        </div>
        <NotificationBell /> {/* ← add here */}
        <button
          onClick={logout}
          title="Logout"
          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          ⏻
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-800">
        <input
          placeholder="🔍  Search users…"
          value={search}
          onChange={handleSearch}
          className={inputClass}
        />
      </div>

      {/* Search results */}
      {results.length > 0 && search && (
        <div className="mx-3 mb-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {results.map((u) => (
            <button
              key={u._id}
              onClick={() => {
                startChat(u._id);
                setSearch("");
                setResults([]);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-800 transition-colors text-left">
              <img
                src={u.avatar}
                alt={u.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-slate-100">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* New Group button */}
      <div className="px-3 py-2">
        <button
          onClick={() => setShowGroup(!showGroup)}
          className="w-full py-2 rounded-lg border border-dashed border-slate-700 text-slate-400 hover:border-sky-500 hover:text-sky-400 hover:bg-sky-500/5 text-sm font-medium transition-all">
          {showGroup ? "✕  Cancel Group" : "＋  New Group Chat"}
        </button>
      </div>

      {/* Group creator */}
      {showGroup && (
        <div className="mx-3 mb-3 p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2">
          <input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={inputClass}
          />
          <input
            placeholder="Search members…"
            onChange={async (e) => {
              if (e.target.value.length < 2) return setMemberSearch([]);
              const { data } = await api.get(`/users?search=${e.target.value}`);
              setMemberSearch(data);
            }}
            className={inputClass}
          />
          {memberSearch.length > 0 && (
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              {memberSearch.map((u) => (
                <button
                  key={u._id}
                  onClick={() => {
                    if (!selected.find((s) => s._id === u._id))
                      setSelected([...selected, u]);
                    setMemberSearch([]);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-800 text-left text-sm">
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
                  className="flex items-center gap-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full text-xs font-medium">
                  {u.name}
                  <button
                    onClick={() =>
                      setSelected(selected.filter((s) => s._id !== u._id))
                    }
                    className="hover:text-white ml-0.5">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <button
            onClick={handleCreateGroup}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg transition-colors">
            Create Group
          </button>
        </div>
      )}

      <ChatList />
    </aside>
  );
}
