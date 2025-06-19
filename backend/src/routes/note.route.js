import express from 'express';
import { createNote, getAllNotesByUser, updateNote, deleteNote, getNoteById } from '../controllers/note.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get("/", verifyToken, getAllNotesByUser);
router.get("/:id",verifyToken, getNoteById);
router.post("/", verifyToken, createNote);
router.put("/:id", verifyToken, updateNote);
router.delete("/:id",verifyToken, deleteNote);

export default router;