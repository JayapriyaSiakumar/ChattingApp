import { format } from "date-fns";

export default function MessageItem({ message, isOwn, showAvatar }) {
  return (
    <div
      className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}>
      {!isOwn &&
        (showAvatar ? (
          <img
            src={message.sender?.avatar}
            alt={message.sender?.name}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
          />
        ) : (
          <div className="w-6 sm:w-7" />
        ))}

      <div className="flex flex-col gap-0.5">
        {!isOwn && showAvatar && (
          <span className="text-[10px] sm:text-xs text-slate-500 ml-1">
            {message.sender?.name}
          </span>
        )}

        <div
          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm ${
            isOwn
              ? "bg-sky-500 text-white rounded-br-sm"
              : "bg-slate-800 text-slate-100 rounded-bl-sm"
          }`}>
          {message.content}
          <span className="block text-right text-[9px] sm:text-[10px] mt-1 opacity-70">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}
