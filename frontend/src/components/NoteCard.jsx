import { PenSquareIcon, Trash2Icon } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import { showToast } from "../lib/utils";

const NoteCard = ({ note, setNotes }) => {
  const [noteToDelete, setNoteToDelete] = useState(null);
  const dialogRef = useRef(null);

  const openModal = (e, id) => {
    e.preventDefault();
    setNoteToDelete(id);
    dialogRef.current?.showModal();
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await api.delete(`/notes/${noteToDelete}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteToDelete));
      showToast("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note", error);
      showToast("Failed to delete note");
    } finally {
      dialogRef.current?.close();
      setNoteToDelete(null);
    }
  };

  return (
    <>
      <Link
        to={`/note/${note._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200
            border-t-4 border-solid border-[#00FF9D]"
      >
        <div className="card-body">
          <h3 className="card-title text-base-content">{note.title}</h3>
          <p className="text-base-content/70 line-clamp-3">{note.content}</p>
          <div className="card-actions justify-between items-center mt-4">
            <span className="text-sm text-base-content/60">
              {formatDate(new Date(note.createdAt))}
            </span>
            <div className="flex items-center gap-1">
              <PenSquareIcon className="size-4" />
              <button
                className="btn btn-ghost btn-xs text-error"
                onClick={(e) => openModal(e, note._id)}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* DaisyUI Confirmation Modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this note?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn" onClick={() => dialogRef.current?.close()}>Cancel</button>
              <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NoteCard;
