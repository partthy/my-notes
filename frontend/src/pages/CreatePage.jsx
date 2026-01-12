import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Calendar,
  MoveLeftIcon,
  PenSquareIcon,
  Pin,
  Trash2Icon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content field are required");
      return;
    }
    setLoading(true);

    // Convert tags string to array
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    try {
      await api.post("/notes", {
        title,
        content,
        category,
        tags: tagsArray,
      });

      toast.success("Note created successfully");
      navigate("/");
    } catch (error) {
      console.log("Error Creating Note", error);
      if (error.response.status === 429) {
        toast.error("Too many request!..Please slow down!", {
          duration: 4000,
          icon: "☠️",
        });
      } else {
        toast.error("Failed to create Note");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6 hover:bg-base-100">
            <MoveLeftIcon className="size-5" /> Back to Notes
          </Link>
        </div>
        <div className="card bg-100 max-w-2xl mx-auto">
          <div className="card-body bg-base-300">
            <h2 className="card-title text-2xl mb-4">Create New Note</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label mb-2">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note Title"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label mb-2">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  type="text"
                  placeholder="Write your text here..."
                  className="input input-bordered w-full h-30"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label mb-2">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="study">Study</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Tags</span>
                </label>
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  className="input input-bordered w-full mb-4"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-full mt-2 mx-auto"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Note"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
