export default function CommentToast({
  show,
  success,
  message,
}) {
  return (
    <div
      className={`
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        gap-3
        px-5
        py-4
        bg-black
        text-white
        text-sm
        font-semibold
        shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]
        transition-all
        duration-300
        ${
          show
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }
      `}
    >
      <span className="material-symbols-outlined text-base">
        {success
          ? "check_circle"
          : "error"}
      </span>

      <span>{message}</span>
    </div>
  );
}