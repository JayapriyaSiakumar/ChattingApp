export default function TypingIndicator({ user }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <img
        src={user?.avatar}
        alt={user?.name}
        className="w-6 h-6 rounded-full object-cover"
      />
      <div className="flex items-center gap-1 bg-slate-800 px-3 py-2.5 rounded-2xl rounded-bl-sm">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-dot" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-dot-2" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce-dot-3" />
      </div>
    </div>
  );
}
