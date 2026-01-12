import Note from "../models/Note.js"; // importing the database model

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ isPinned: -1, createdAt: -1 }); // Pinned first, then newest

    res.status(200).json({
      message: "Notes retrieved successfully",
      count: notes.length,
      notes: notes,
    });
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      message: "Note retrieved successfully",
      note: note,
    });
  } catch (error) {
    console.error("Error in getNoteById controller", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createNote = async (req, res) => {
  try {
    const newNote = new Note(req.body);
    await newNote.save();

    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Error in createNote Controller", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res
      .status(200)
      .json({ message: "Note Updated Successfully", note: updatedNote });
  } catch (error) {
    console.error("Error in updateNote Controller", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note Deleted Successfully" });
  } catch (error) {
    console.error("Error in deleteNote Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
