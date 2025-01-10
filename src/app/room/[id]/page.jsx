"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const Home = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const roomId = params?.id;

  // Fetch notes for the room
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/fetchnote", {
          params: { roomId },
        });
        setNotes(res.data.notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setMessage("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchNotes();
    }
  }, [roomId]);

  // Add a new note
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setMessage("Note cannot be empty");
      return;
    }

    try {
      const res = await axios.post("/api/notes", { note, room: roomId });
      if (res.status === 201) {
        setMessage("Note added successfully!");
        setNotes((prevNotes) => [res.data.actualNote, ...prevNotes]);
        setNote("");
      }
    } catch (error) {
      console.error("Error submitting note:", error);
      setMessage(error.response?.data?.error || "Error submitting note");
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col w-screen items-center justify-center bg-gray-700">
      <h1 className="lg:text-7xl text-4xl font-bold mb-4 text-emerald-200">
        notesBaaton
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl flex items-center p-4"
      >
        <textarea
          className="flex-grow h-16 p-2 border rounded-md mr-2"
          placeholder="Enter your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="h-16 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-emerald-200">{message}</p>
      )}

      {loading ? (
        <p className="mt-4 text-center text-sm text-gray-300">Loading notes...</p>
      ) : (
        <div className="notes-list w-full max-w-3xl mt-6">
          {notes.length > 0 ? (
            notes.map((noteItem, index) => (
              <div
                key={index}
                className="note-item bg-gray-800 text-white p-4 mb-3 rounded-md shadow-sm"
              >
                <p className="text-lg">{noteItem}</p>
                <p className="text-sm text-gray-400">
                  {new Date().toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-300">
              No notes available. Start by adding one!
            </p>
          )}
        </div>
      )}

      <button
        className="bg-red-600 text-white px-4 py-2 rounded-md mt-6 hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
