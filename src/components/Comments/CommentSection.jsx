import { useState } from "react";

import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";

export default function CommentSection(props) {
  const { memoryId, initialComments = [] } = props;
  const [comments, setComments] = useState(initialComments);
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const parentComments = comments.filter(
    (comment) => comment.parent_id === null || comment.parent_id === undefined,
  );

  function handleCommentAdded(newComment) {
    setComments((prev) => [newComment, ...prev]);
  }

  const displayedComments = showAllComments
    ? parentComments
    : parentComments.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* FORM */}

      <CommentForm memoryId={memoryId} onCommentAdded={handleCommentAdded} />

      {/* COMMENTS */}
      {replyingTo && (
        <div
          className="
          bg-[#FFFDF8]
          border-2
          border-black
          p-4
          mb-8
          shadow-[4px_4px_0_rgba(0,0,0,1)]
        "
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm">
              Replying to <strong>{replyingTo.username}</strong>
            </p>

            <button
              onClick={() => setReplyingTo(null)}
              className="text-xs uppercase"
            >
              Cancel
            </button>
          </div>

          <CommentForm
            memoryId={memoryId}
            parentId={replyingTo.id}
            onCommentAdded={(newComment) => {
              handleCommentAdded(newComment);

              setReplyingTo(null);
            }}
          />
        </div>
      )}
      <section aria-label="Reflections">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-sm uppercase tracking-[0.2em] font-semibold">
            Comments
          </h2>

          <span
            className="
              text-xs
              bg-black
              text-white
              px-2
              py-0.5
              font-bold
              tabular-nums
            "
          >
            {parentComments.length}
          </span>
        </div>

        <div className="space-y-6 relative">
          <div
            className="
              absolute
              left-5
              top-0
              bottom-0
              w-[3px]
              bg-black/20
              -z-10
            "
            aria-hidden="true"
          />

          {parentComments.length === 0 ? (
            <div
              className="
                bg-white
                p-8
                border-2
                border-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              "
            >
              <p className="text-base text-[#111111]">
                No Comments yet. Be the first to leave one.
              </p>
            </div>
          ) : (
            <>
              {displayedComments.map((comment, index) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  index={index}
                  replies={comments.filter(
                    (reply) => reply.parent_id === comment.id,
                  )}
                  onReply={setReplyingTo}
                />
              ))}
              {parentComments.length > 3 && !showAllComments && (
                <button
                  onClick={() => setShowAllComments(true)}
                  className="
                    mt-6
                    w-full
                    px-4
                    py-2
                    cursor-pointer
                    border-2 
                    border-black 
                    bg-[#FFFDF8] 
                    uppercase 
                    tracking-[0.18em] 
                    text-sm 
                    font-black 
                    shadow-[4px_4px_0_rgba(0,0,0,1)] 
                    transition-all duration-200 
                    hover:translate-x-[2px] 
                    hover:translate-y-[2px] 
                    hover:shadow-none
                  "
                >
                  View More ({parentComments.length - 3} more)
                </button>
              )}
              {showAllComments && parentComments.length > 3 && (
                <button
                  onClick={() => setShowAllComments(false)}
                  className="
                   mt-6
                    w-full
                    px-4
                    py-2
                    cursor-pointer
                    border-2 
                    border-black 
                    bg-[#FFFDF8] 
                    uppercase 
                    tracking-[0.18em] 
                    text-sm 
                    font-black 
                    shadow-[4px_4px_0_rgba(0,0,0,1)] 
                    transition-all duration-200 
                    hover:translate-x-[2px] 
                    hover:translate-y-[2px] 
                    hover:shadow-none
                  "
                >
                  Show Less
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
