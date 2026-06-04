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

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
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

export default function CommentCard({ comment, index }) {
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
      </div>
    </article>
  );
}
