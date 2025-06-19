/* eslint-disable no-unused-vars */
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import RateLimitedUI from "../components/RateLimitedUI";
import { useAuthStore } from "../store/authStore";
import { showToast } from "../lib/utils";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);

  const navigate = useNavigate();
  const {isLoading} = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/notes", {
        title,
        content,
      });
      showToast("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating note", error);
      if (error.response.status === 429) {
        setIsRateLimited(true);
      } else {
        showToast("Failed to create note");
      }
    } 
  };

  return (
    <div className="min-h-screen bg-base-200">
      {isRateLimited && <RateLimitedUI />}

      {!isRateLimited && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mt-5">
            <Link to={"/"} className="btn btn-ghost mb-6">
              <ArrowLeftIcon className="size-5" />
              Back to Notes
            </Link>

            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Create New Note</h2>
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
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreatePage;
