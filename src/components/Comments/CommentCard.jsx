import { useState } from "react";
import { supabase } from "../../lib/supabase";

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

export default function CommentCard({
  comment,
  index,
  visitorId,
  replies = [],
  onReply,
  onDelete,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteReplyId, setConfirmDeleteReplyId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const displayUsername = comment.is_anonymous
    ? "Anonymous"
    : comment.username || "Anonymous";

  // Hard-delete the parent comment. If it has replies, delete those first.
  async function handleDeleteParent() {
    try {
      setDeletingId(comment.id);

      if (replies.length > 0) {
        const replyIds = replies.map((r) => r.id);
        const { error: repliesError } = await supabase
          .from("memory_comments")
          .delete()
          .in("id", replyIds);

        if (repliesError) throw repliesError;
      }

      const { data, error } = await supabase
        .from("memory_comments")
        .delete()
        .eq("id", comment.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Delete blocked — no RLS DELETE policy on memory_comments.");
      onDelete?.(comment.id);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment: " + err.message);
    } finally {
      setDeletingId(null);
      setConfirmDelete(false);
    }
  }

  // Hard-delete a single reply.
  async function handleDeleteReply(replyId) {
    try {
      setDeletingId(replyId);

      const { data, error } = await supabase
        .from("memory_comments")
        .delete()
        .eq("id", replyId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Delete blocked — no RLS DELETE policy on memory_comments.");
      onDelete?.(replyId);
    } catch (err) {
      console.error("Error deleting reply:", err);
      alert("Failed to delete reply: " + err.message);
    } finally {
      setDeletingId(null);
      setConfirmDeleteReplyId(null);
    }
  }

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
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div
              className={`
                w-10
                h-10
                border-2
                border-black
                flex
                items-center
                justify-center
                font-bold
                text-sm
                shrink-0
                ${getAvatarColor(displayUsername)}
              `}
            >
              {getInitials(displayUsername)}
            </div>

            <div>
              <p className="text-sm font-semibold leading-tight text-black">
                {displayUsername}
              </p>
              <time className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {formatDate(comment.created_at)}
              </time>
            </div>
          </div>

          {/* Delete Action — Parent Comment */}
          {comment.visitor_id === visitorId && (
            <div className="relative shrink-0">
              {confirmDelete ? (
                <div className="flex items-center gap-2 border-2 border-black bg-[#FFD0CC] px-2 py-1 shadow-[2px_2px_0px_#000] text-xs font-bold">
                  <span>
                    {replies.length > 0 ? "Delete with replies?" : "Delete?"}
                  </span>
                  <button
                    onClick={handleDeleteParent}
                    disabled={deletingId === comment.id}
                    className="text-red-600 underline cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === comment.id ? "…" : "Yes"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-black underline cursor-pointer"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    font-black
                    text-red-500
                    hover:underline
                    cursor-pointer
                  "
                >
                  🗑 Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comment Body */}
        <p className="text-base leading-relaxed whitespace-pre-wrap wrap-break-word text-[#111111]">
          {comment.comment}
        </p>

        {/* Interactions Footer */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => onReply(comment)}
            className="
              text-xs
              uppercase
              tracking-[0.15em]
              font-bold
              hover:underline
              cursor-pointer
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
                cursor-pointer
              "
            >
              {showReplies
                ? "Hide replies"
                : `View ${replies.length} repl${replies.length > 1 ? "ies" : "y"
                }`}
            </button>
          )}
        </div>

        {/* Replies Section */}
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
            {replies.map((reply) => {
              const replyUsername = reply.is_anonymous
                ? "Anonymous"
                : reply.username || "Anonymous";

              return (
                <div
                  key={reply.id}
                  className="
                    bg-[#FFFDF8]
                    border-2
                    border-black
                    p-4
                  "
                >
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div>
                      <p className="font-semibold text-sm text-black">
                        {replyUsername}
                      </p>
                      <time className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                        {formatDate(reply.created_at)}
                      </time>
                    </div>

                    {/* Delete Action — Reply */}
                    {reply.visitor_id === visitorId && (
                      confirmDeleteReplyId === reply.id ? (
                        <div className="flex items-center gap-2 border-2 border-black bg-[#FFD0CC] px-2 py-1 shadow-[2px_2px_0px_#000] text-xs font-bold">
                          <span>Delete?</span>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            disabled={deletingId === reply.id}
                            className="text-red-600 underline cursor-pointer disabled:opacity-50"
                          >
                            {deletingId === reply.id ? "…" : "Yes"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteReplyId(null)}
                            className="text-black underline cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteReplyId(reply.id)}
                          disabled={deletingId === reply.id}
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.15em]
                            font-bold
                            text-red-500
                            hover:underline
                            cursor-pointer
                            disabled:opacity-50
                          "
                        >
                          🗑 Delete
                        </button>
                      )
                    )}
                  </div>

                  <p className="text-sm whitespace-pre-wrap text-black">
                    {reply.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}