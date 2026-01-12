import { Link } from "react-router";
import { Calendar, PenSquareIcon, Pin, Trash2Icon } from "lucide-react";

const NoteCard = ({
  _id,
  title,
  content,
  category,
  isPinned,
  tags,
  createdAt,
  onTogglePin,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePinToggle = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(_id, !isPinned);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Link
      to={`note/${_id}`}
      className="card bg-primary text-secondary hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300"
    >
      <div className="card-body">
        {/* Header with title and pin button */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title text-lg font-bold flex-1">{title}</h3>
          <button
            onClick={handlePinToggle}
            className={`btn btn-circle btn-sm shrink-0 ${
              isPinned ? "btn-accent" : "btn-ghost"
            }`}
            aria-label={isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin className={`size-4 ${isPinned ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Content */}
        <p className="text-secondary line-clamp-3 text-sm mt-2">{content}</p>

        {/* Category Badge */}
        <div className="mt-3">
          <span className="badge badge-accent badge-sm capitalize font-semibold">
            {category}
          </span>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="badge badge-info badge-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs opacity-70 mt-3">
            <Calendar className="size-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/note/${_id}`}
              className="btn btn-xs btn-ghost p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <PenSquareIcon className="size-4" />
            </Link>
            <button
              className="btn btn-xs text-error p-1"
              onClick={(e) => handleDelete(e, _id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
