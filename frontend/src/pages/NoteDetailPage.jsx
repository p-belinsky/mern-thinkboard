/* eslint-disable no-unused-vars */
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import { Trash2Icon } from "lucide-react";
import RateLimitedUI from "../components/RateLimitedUI";
import { showToast } from "../lib/utils";

const NoteDetailPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const dialogRef = useRef(null);

  const navigate = useNavigate();
  const noteId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${noteId}`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (error) {
        console.error("Error fetching note", error);
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          showToast("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      if (!title || !content) {
      showToast("Please fill in all fields");
      return;
    }
    setSaving(true);



    try {
      await api.put(`/notes/${noteId}`, {
        title,
        content,
      });
      showToast("Note updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating note", error);
      showToast("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const openModal = (e, id) => {
    e.preventDefault();
    setNoteToDelete(id);
    dialogRef.current?.showModal();
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await api.delete(`/notes/${noteToDelete}`);
      showToast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note", error);
      showToast.error("Failed to delete note");
    } finally {
      dialogRef.current?.close();
      setNoteToDelete(null);
      navigate("/");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-base-200">
          {isRateLimited && <RateLimitedUI />}



        {!isRateLimited && (
                  <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mt-5">
            <div className="flex justify-between">
              <Link to={"/"} className="btn btn-ghost mb-6">
                <ArrowLeftIcon className="size-5" />
                Back to Notes
              </Link>

              <button
                onClick={(e) => openModal(e, noteId)}
                className="btn btn-outline btn-error"
              >
                <Trash2Icon className="size-4" />
                Delete Note
              </button>
            </div>

            <div className="card bg-base-100">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-control mb-4">
                    <div className="flex items-center gap-4">
                      <label className="w-24 text-left pb-2">
                        <span className="label-text">Title</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Note Title"
                      className="input input-bordered w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-control mb-4">
                    <div className="flex items-start gap-4">
                      <label className="w-24 text-left pt-2 pb-2">
                        <span className="label-text">Content</span>
                      </label>
                    </div>
                    <textarea
                      placeholder="Write your note here..."
                      className="textarea textarea-bordered w-full h-32 pt-4"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        )}


      </div>

      {/* DaisyUI Confirmation Modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this note?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                className="btn"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={confirmDelete}>
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default NoteDetailPage;
