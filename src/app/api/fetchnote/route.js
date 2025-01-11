import connectDB from "@/dbconfig/dbconfig";
import Notes from "@/app/models/notes.model";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // Connect to the database
    await connectDB();

    // Extract roomId from the query parameters
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { message: "Room ID not provided" },
        { status: 400 }
      );
    }

    // Fetch notes based on roomId
    const fetchNotesByRoomId = async (roomId) => {
      try {
        const notes = await Notes.find({ room: roomId })
        .sort({ createdAt: -1 })
      .lean();
        return notes;
      } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }
    };

    const notes = await fetchNotesByRoomId(roomId);

    // If no notes are found, return a 404 response
    if (!notes || notes.length === 0) {
      return NextResponse.json(
        { notes: [] }, // Return empty array instead of a 404
        { status: 200 }
      );
    }

    console.log("Received Room ID:", roomId);
console.log("Found Notes:", notes);

    

    // Return the fetched notes
    return NextResponse.json(
      { notes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Error fetching notes", error: error.message },
      { status: 500 }
    );
  }
};
