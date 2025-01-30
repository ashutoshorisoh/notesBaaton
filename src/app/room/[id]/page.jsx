"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const Home = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const roomId = params?.id || "fallback-id";

  const textareaRef = useRef(null); // Reference to textarea for auto-resizing

  // Fetch notes for the room
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/fetchnote", {
          params: { roomId },
        });
        console.log("Fetched notes:", response.data); // Log the fetched notes for debugging
        setNotes(response.data.notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setMessage("Failed to fetch notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      console.log("Fetching notes for roomId:", roomId);
      fetchNotes();
    }
  }, [roomId]);

  // Auto-resize the textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the height to the scrollHeight
    }
  }, [note]); // Trigger whenever the note changes

  // Add a new note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setMessage("Note cannot be empty");
      return;
    }

    try {
      const response = await axios.post("/api/notes", { note, room: roomId });
      console.log("Response from backend:", response.data); // Log the response for debugging

      if (response.status === 201) {
        const newNote = response.data; // Use response.data directly
        console.log("New note added:", newNote); // Log the newly added note

        if (newNote?.note && newNote?.createdAt) {
          setNotes((prevNotes) => [newNote, ...prevNotes]);
          setMessage("Note added successfully!");
          setNote(""); // Clear the textarea after submit
        } else {
          setMessage("Invalid note format received from the backend");
        }
      }
    } catch (error) {
      console.error("Error submitting note:", error);
      setMessage(
        error.response?.data?.error || "An error occurred while adding the note."
      );
    }
  };

  // Logout functionality
  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-400">
      {/* Sticky Navbar */}
      <header className="sticky top-0 w-full p-4 flex justify-between items-center text-white bg-slate-900 shadow-md">
        <h1 className="lg:text-4xl text-2xl font-semibold text-emerald-200">notesBaaton</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl flex flex-col items-center mt-8 px-4 py-6 bg-opacity-90 rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-row items-center p-4 gap-5 border-b"
        >
          <textarea
            ref={textareaRef} // Set the reference to the textarea
            className="flex-grow p-3 border-none rounded-md bg-slate-600 text-white border-white placeholder-gray-400 resize-none"
            placeholder="Enter your note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            type="submit"
            className="h-16 px-6 bg-blue-200 text-black rounded-md hover:bg-green-100 bg-green-500"
          >
            Add Note
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-emerald-900">{message}</p>
        )}

        {loading ? (
          <p className="mt-4 text-center text-sm text-gray-300">Loading notes...</p>
        ) : (
          <div className="notes-list w-full mt-6">
            {notes?.length > 0 ? (
              notes.map((noteItem) => {
                if (!noteItem?.note) return null; // Skip invalid notes
                return (
                  <div
                    key={noteItem._id}
                    className="note-item bg-gray-700 text-white p-4 mb-3 w-full rounded-md shadow-sm"
                  >
                    <p className="text-lg whitespace-pre-wrap">{noteItem.note}</p>
                    <p className="text-sm text-gray-200">
                      {noteItem.createdAt
                        ? new Date(noteItem.createdAt).toLocaleString()
                        : "No timestamp"}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm text-gray-300">
                No notes available in this room yet. Add one...
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
