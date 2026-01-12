import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Calendar, ArrowLeft, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("other");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        const fetchedNote = response.data.note;
        setNote(fetchedNote);
        setTitle(fetchedNote.title);
        setContent(fetchedNote.content);
        setCategory(fetchedNote.category);
        setTagsInput((fetchedNote.tags || []).join(", "));
      } catch (error) {
        console.error("Error fetching note", error);
        toast.error("Failed to load note");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content are required");
      return;
    }

    setIsSaving(true);

    // Convert tags input to array
    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      const response = await api.put(`/notes/${id}`, {
        title,
        content,
        category,
        tags: tagsArray,
      });

      setNote(response.data.note);
      setIsEditing(false);
      toast.success("Note updated successfully");
    } catch (error) {
      console.error("Error updating note", error);
      toast.error("Failed to update note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note", error);
      toast.error("Failed to delete note");
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setTagsInput((note.tags || []).join(", "));
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center text-primary py-10">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center text-error py-10">Note not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button and actions */}
          <div className="flex items-center justify-between mb-6">
            <Link to={"/"} className="btn btn-ghost hover:bg-base-100">
              <ArrowLeft className="size-4 mr-2" />
              Back to Notes
            </Link>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Note
                  </button>
                  <button onClick={handleDelete} className="btn btn-error">
                    <Trash2Icon className="size-4 mr-2" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="btn btn-ghost"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {!isEditing ? (
                <>
                  {/* View Mode */}
                  <h1 className="card-title text-3xl font-bold mb-4">
                    {note.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="badge badge-accent badge-lg capitalize font-semibold">
                      {note.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm opacity-70">
                      <Calendar className="size-4" />
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="badge badge-info">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="divider"></div>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <form onSubmit={handleUpdate}>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Title</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Note Title"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Content</span>
                      </label>
                      <textarea
                        placeholder="Write your note here..."
                        className="textarea textarea-bordered w-full h-64"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Category</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="study">Study</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Tags</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        className="input input-bordered w-full"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                      />
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
