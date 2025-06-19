import Note from "../models/note.model.js";

export const getAllNotesByUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request" });
    }

    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request" });
    }
    const note = new Note({ title, content, user: req.userId });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, content },
      { new: true }
    );
    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or you don't have permission" });
    }
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: No user found in request" });
    }

    const deletedNote = await Note.findOneAndDelete({_id: id, user: req.userId});
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found or you don't have permission" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request" });
    }
    const foundNote = await Note.findOne({ _id: id, user: req.userId });
    if (!foundNote) {
      return res
        .status(404)
        .json({ message: "Note not found or you don't have access" });
    }
    res.status(200).json(foundNote);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
