import { format } from "date-fns";

export default function MessageItem({ message, isOwn, showAvatar }) {
  return (
    <div
      className={`flex items-end gap-2 max-w-[75%] ${isOwn ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
      {!isOwn &&
        (showAvatar ? (
          <img
            src={message.sender?.avatar}
            alt={message.sender?.name}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-7 flex-shrink-0" />
        ))}
      <div className="flex flex-col gap-0.5">
        {!isOwn && showAvatar && (
          <span className="text-xs text-slate-500 ml-1">
            {message.sender?.name}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-sky-500 text-white rounded-br-sm shadow-lg shadow-sky-500/20"
              : "bg-slate-800 text-slate-100 rounded-bl-sm"
          }`}>
          {message.content}
          <span
            className={`block text-right text-[10px] mt-1 ${isOwn ? "text-sky-100/70" : "text-slate-500"}`}>
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}
