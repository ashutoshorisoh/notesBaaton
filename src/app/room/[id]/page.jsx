"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const Home = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null); // Track the note being edited

  const router = useRouter();
  const params = useParams();
  const roomId = params?.id;

  // Fetch notes for the room
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`/api/notes?room=${roomId}`);
        setNotes(res.data.notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    if (roomId) {
      fetchNotes();
    }
  }, [roomId]);

  // Add or update a note
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update note
        const res = await axios.patch("/api/notes", { id: editingId, note });
        if (res.status === 200) {
          setMessage("Note updated successfully!");
        }
      } else {
        // Add new note
        const res = await axios.post("/api/notes", { note, room: roomId });
        if (res.status === 201) {
          setMessage("Note added successfully!");
        }
      }

      setNote("");
      setEditingId(null); // Reset editing state
      // Refresh notes
      const refreshedNotes = await axios.get(`/api/notes?room=${roomId}`);
      setNotes(refreshedNotes.data.notes);
    } catch (error) {
      console.error("Error submitting note:", error);
      setMessage(
        error.response?.data?.error || "Error submitting note"
      );
    }
  };

  const handleEdit = (id, currentNote) => {
    setEditingId(id);
    setNote(currentNote);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col w-screen items-center justify-center bg-gray-700">
      <h1 className="lg:text-7xl text-4xl font-bold mb-4 text-emerald-200">notesBaaton</h1>
      <form
        onSubmit={handleSubmit}
        className=" items-center  w-[76%] pt-2 pb-2 flex flex-row  justify-start"
      >
        <textarea
          className="w-[90%] h-16 p-2 ml-2 mr-2 border rounded-md"
          placeholder="Enter your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className=" pl-5 pr-5 h-16 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editingId ? "Update Note" : "Submit"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
      <div className=" w-3/4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="p-4 mb-4 bg-gray-900 text-white shadow-sm shadow-white rounded-md flex justify-between items-center"
          >
            <div>
              <p>{note.note}</p>
              <p className="text-xs text-gray-500">
               
              </p>
            </div>
            <button
              onClick={() => handleEdit(note._id, note.note)}
              className="px-2 py-1 text-sm text-white bg-yellow-500 rounded-md"
            >
              Edit
            </button>
          </div>
        ))}
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
