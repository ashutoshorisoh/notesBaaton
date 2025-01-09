"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const Home = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  const router = useRouter();
  const params = useParams();
  const roomId = params?.id;

  // Fetch notes for the room
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/api/fetchnote", {
          params: { roomId }, // Axios automatically converts this to a query string
        });
        if (res.status == 404) {
          console.log(res.message)
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        setMessage("Failed to fetch notes");
      }
    };

    if (roomId) {
      fetchNotes(); // Fetch notes only if roomId is available
    }
  }, [roomId]);

  // Add a new note
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/notes", { note, room: roomId });
      if (res.status === 201) {
        setMessage("Note added successfully!");
        // Refresh notes after adding a new note
        const newNotes = await axios.get("/api/fetchnote", {
          params: { roomId },
        });
        setNotes([newNotes.data.actualNote]); // Update notes with the new note
      }
      setNote(""); // Clear note input after submission
    } catch (error) {
      console.error("Error submitting note:", error);
      setMessage(error.response?.data?.error || "Error submitting note");
    }
  };

  const handleLogout = () => {
    router.push("/"); // Navigate to the home page on logout
  };

  return (
    <div className="min-h-screen flex flex-col w-screen items-center justify-center bg-gray-700">
      <h1 className="lg:text-7xl text-4xl font-bold mb-4 text-emerald-200">notesBaaton</h1>
      <form
        onSubmit={handleSubmit}
        className="items-center w-[76%] pt-2 pb-2 flex flex-row justify-start"
      >
        <textarea
          className="w-[90%] h-16 p-2 ml-2 mr-2 border rounded-md"
          placeholder="Enter your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="pl-5 pb-3 pt-3  pr-5 h-16 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}

      <div className="notes-list mt-4">
        {notes && notes.length > 0 ? (
          notes.map((noteItem, index) => (
            <div key={index} className="note-item bg-gray-800 text-white p-4 mb-2 rounded-md">
              <p>{noteItem}</p>
              <p className="text-sm text-gray-400">{new Date().toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-700">No notes available</p>
        )}
      </div>

      <button
        className="bg-red-800 text-white pl-2 pr-2 pt-1 pb-1 mt-4"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
