import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import CommentToast from "./CommentToast";

export default function CommentForm({
  memoryId,
  visitorId,
  onCommentAdded,
  parentId = null,
}) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Visitor Name locking states
  const [registeredName, setRegisteredName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    success: true,
    message: "",
  });

  // Fetch locked device name if it exists
  useEffect(() => {
    if (!visitorId) return;

    async function checkVisitor() {
      const { data, error } = await supabase
        .from("comment_visitors")
        .select("name")
        .eq("visitor_id", visitorId)
        .maybeSingle();

      if (!error && data) {
        setRegisteredName(data.name);
        setName(data.name);
        setIsRegistered(true);
      }
    }

    checkVisitor();
  }, [visitorId]);

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
    const body = comment.trim();

    if (!body) {
      showToast("Please write a comment before posting.", false);
      return;
    }

    let finalName = "Anonymous";

    if (!isAnonymous) {
      if (isRegistered) {
        finalName = registeredName;
      } else {
        const trimmedName = name.trim();
        if (!trimmedName) {
          showToast("Please enter a name or choose 'Comment as Anonymous'.", false);
          return;
        }

        // Lock name to device in comment_visitors table first
        try {
          setLoading(true);
          const { error: regError } = await supabase
            .from("comment_visitors")
            .insert({ visitor_id: visitorId, name: trimmedName });

          if (regError) throw regError;

          setRegisteredName(trimmedName);
          setIsRegistered(true);
          finalName = trimmedName;
        } catch (regErr) {
          console.error("Failed to register name:", regErr);
          showToast("Unable to lock username to device: " + (regErr.message || "Error"), false);
          setLoading(false);
          return;
        }
      }
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("memory_comments")
        .insert({
          memory_id: memoryId,
          username: finalName,
          comment: body,
          parent_id: parentId,
          visitor_id: visitorId,
          is_anonymous: isAnonymous,
        })
        .select()
        .single();

      if (error) throw error;

      onCommentAdded?.(data);
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
          {/* Identity Section */}
          <div className="mb-4">
            <p
              className="
                    block
                    text-sm
                    uppercase
                    tracking-[0.2em]
                    font-semibold
                    mb-1
                  "
            >
              Name *
            </p>
            {isAnonymous ? (
              <div className="mb-5 p-3 border-2 border-dashed border-gray-400 bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                Comment as Anonymous (your name will not be shown)
              </div>
            ) : isRegistered ? (
              <div className="mb-5 p-3 border-2 border-black bg-[#DBE9FF] text-black font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                Comment as: <span className="underline">{registeredName}</span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  maxLength={60}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="
                    w-full
                    h-10
                    px-4
                    bg-transparent
                    border-2
                    border-black
                    outline-none
                    transition-all
                    mb-4
                    focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  "
                />
              </>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-2 mb-5">
            <input
              type="checkbox"
              id={`anon-check-${parentId || "main"}`}
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="
                w-5
                h-5
                accent-black
                border-2
                border-black
                cursor-pointer
              "
            />
            <label
              htmlFor={`anon-check-${parentId || "main"}`}
              className="
                text-xs
                font-black
                uppercase
                tracking-wider
                cursor-pointer
                select-none
              "
            >
              Comment as Anonymous
            </label>
          </div>

          {/* Comment input */}
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
