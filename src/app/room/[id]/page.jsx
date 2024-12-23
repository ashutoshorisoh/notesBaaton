"use client";

import { useState } from "react";
import axios from "axios";

const Home = () => {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/notes", { note });

      if (res.status === 201) {
        setMessage("Note added successfully!");
        setNote(""); // Clear the input field after successful submission
      }
    } catch (error) {
      console.error("Error uploading note:", error);
      setMessage(error.response?.data?.error || "Error uploading note");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Add a Note</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <textarea
          className="w-80 p-2 border rounded-md"
          placeholder="Enter your note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default Home;
