/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import { showToast } from "../lib/utils";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";
import { useAuthStore } from "../store/authStore";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const {user, isLoading} = useAuthStore();
  const [isFetchingNotes, setIsFetchingNotes] = useState(true);


  useEffect(() => {
    if(isLoading) return
    const fetchNotes = async () => {
      setIsFetchingNotes(true); // start fetching

      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes");
        if (error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          showToast("Failed to load notes");
        }
      } finally {
        setIsFetchingNotes(false); // stop fetching
      }
    };

    fetchNotes();
  }, [isLoading]);



  return (
    <div className="min-h-screen">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">


        {!isFetchingNotes && notes.length === 0 && !isRateLimited && !isLoading && <NotesNotFound />}

        {!isFetchingNotes && notes.length > 0 && !isRateLimited && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
