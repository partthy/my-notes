import React from "react";
import NavBar from "../components/NavBar";
import { useState } from "react";
import RateLimit from "../components/RateLimitUI";
import RateLimitUI from "../components/RateLimitUI";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../../lib/axios";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAllNotes = async () => {
      try {
        const response = await api.get("/notes");
        setNotes(response.data.notes);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching data", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load data");
        }
      } finally {
        setIsLoading(false);
      }
    };
    getAllNotes();
  }, []);

  const handleTogglePin = async (noteId, newPinnedState) => {
    try {
      await api.put(`/notes/${noteId}`, {
        isPinned: newPinnedState,
      });

      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, isPinned: newPinnedState } : note
        )
      );

      toast.success(newPinnedState ? "Note pinned" : "Note unpinned");
    } catch (error) {
      console.error("Error toggling pin", error);
      toast.error("Failed to update pin status");
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await api.delete(`/notes/${noteId}`);

      // Update local state
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));

      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      {isRateLimited && <RateLimitUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {isLoading && (
          <div className="text-center text-primary py-10">Loading...</div>
        )}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes
              .sort((a, b) => {
                // Pinned notes first
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // Then by creation date (newest first)
                return new Date(b.createdAt) - new Date(a.createdAt);
              })
              .map((note) => (
                <NoteCard
                  key={note._id}
                  _id={note._id}
                  title={note.title}
                  content={note.content}
                  category={note.category}
                  isPinned={note.isPinned}
                  tags={note.tags}
                  color={note.color}
                  createdAt={note.createdAt}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
