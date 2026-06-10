import { useState } from "react";
import { supabase } from "../../lib/supabase";
import CommentToast from "./CommentToast";

export default function CommentForm({
  memoryId,
  onCommentAdded,
  parentId = null,
}) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: "",
  });

  function showToast(message, success = true) {
    setToast({
      show: true,
      success,
      message,
    });

    setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  }

  async function handleSubmit() {
    const username = name.trim() || "Anonymous";
    const body = comment.trim();

    if (!body) {
      showToast("Please write a comment before posting.", false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("memory_comments")
        .insert({
          memory_id: memoryId,
          username,
          comment: body,
          parent_id: parentId,
        })
        .select()
        .single();

      if (error) throw error;

      onCommentAdded?.(data);

      setName("");
      setComment("");

      showToast("Comment posted!", true);
    } catch (error) {
      console.error(error);

      showToast(error?.message || "Unable to post comment.", false);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <>
      <section className="relative">
        <div
          className="
            absolute
            -top-4
            -right-4
            z-10
            w-12
            h-12
            flex
            items-center
            justify-center
            bg-black
            text-white
            rounded-full
            shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
          "
        >
          <span className="material-symbols-outlined text-base">edit</span>
        </div>

        <div
          className="
            bg-white
            p-8
            border-2
            border-black
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
          "
        >
          <label
            className="
              block
              text-sm
              uppercase
              tracking-[0.2em]
              font-semibold
              mb-1
            "
          >
            Name
          </label>

          <input
            type="text"
            maxLength={60}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="
              w-full
              h-10
              px-4
              bg-transparent
              border-2
              border-black
              outline-none
              transition-all
              mb-5
              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            "
          />

          <label
            className="
              block
              text-sm
              uppercase
              tracking-[0.2em]
              font-semibold
              mb-1
            "
          >
            Add a thought to the archive
          </label>

          <textarea
            rows={4}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your comment here…"
            className="
              w-full
              px-4
              py-3
              bg-transparent
              border-2
              border-black
              outline-none
              transition-all
              resize-none
              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            "
          />

          <div className="flex items-center justify-between mt-1 mb-5">
            <span className="text-[11px] text-slate-400 tabular-nums">
              {comment.length} / 500
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              cursor-pointer
              px-8
              py-3
              bg-black
              text-white
              text-sm
              font-semibold
              shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]
              hover:translate-x-1
              hover:translate-y-1
              transition-transform
              disabled:opacity-50
              disabled:pointer-events-none
            "
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </section>

      <CommentToast
        show={toast.show}
        success={toast.success}
        message={toast.message}
      />
    </>
  );
}
