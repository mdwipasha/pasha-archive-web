import { useState } from "react";

const avatarColors = [
  "bg-[#FFD6A5]",
  "bg-[#FDFFB6]",
  "bg-[#CAFFBF]",
  "bg-[#9BF6FF]",
  "bg-[#A0C4FF]",
  "bg-[#BDB2FF]",
  "bg-[#FFC6FF]",
  "bg-[#FFADAD]",
];

function getAvatarColor(name = "Anonymous") {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return avatarColors[hash % avatarColors.length];
}

function formatDate(value) {
  if (!value) return "Just now";

  const now = new Date();
  const date = new Date(value);
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CommentCard({ comment, index, replies = [], onReply }) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <article className="group relative">
      <div
        className={`
          bg-white
          p-6
          border-2
          border-black
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          transition-all
          ${index % 2 === 0 ? "rotate-[0.4deg]" : "rotate-[-0.3deg]"}
        `}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`
              w-10
              h-10
              bg-[#F6D1D8]
              border-2
              border-black
              flex
              items-center
              justify-center
              font-bold
              text-sm
              shrink-0
             ${getAvatarColor(comment.username)}
            `}
          >
            {getInitials(comment.username || "Anonymous")}
          </div>

          <div>
            <p className="text-sm font-semibold leading-tight">
              {comment.username || "Anonymous"}
            </p>

            <time className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {formatDate(comment.created_at)}
            </time>
          </div>
        </div>

        <p className="text-base leading-relaxed text-[#111111] whitespace-pre-wrap wrap-break-word">
          {comment.comment}
        </p>

        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => onReply(comment)}
            className="
            text-xs
            uppercase
            tracking-[0.15em]
            font-bold
            hover:underline
          "
          >
            ↩ Reply
          </button>

          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="
              text-xs
              uppercase
              tracking-[0.15em]
              text-slate-500
              hover:underline
            "
            >
              {showReplies
                ? "Hide replies"
                : `View ${replies.length} repl${
                    replies.length > 1 ? "ies" : "y"
                  }`}
            </button>
          )}
        </div>
        {showReplies && replies.length > 0 && (
          <div
            className="
            mt-5
            ml-6
            pl-5
            border-l-2
          border-black/20
            space-y-4
          "
          >
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="
              bg-[#FFFDF8]
                border-2
              border-black
                p-4
              "
              >
                <div className="mb-2">
                  <p className="font-semibold text-sm">{reply.username}</p>

                  <time className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    {formatDate(reply.created_at)}
                  </time>
                </div>

                <p className="text-sm whitespace-pre-wrap">{reply.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
