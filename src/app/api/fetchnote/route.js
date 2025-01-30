import connectDB from "@/dbconfig/dbconfig";
import Notes from "@/app/models/notes.model";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // ✅ Connect to the database
    await connectDB();

    // ✅ Extract roomId from the query parameters
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { message: "Room ID not provided" },
        { status: 400 }
      );
    }

    console.log("Fetching notes for Room ID:", roomId);

    // ✅ Fetch notes based on roomId with debugging logs
    const notes = await Notes.find({ room: roomId }).populate("room");

    // Additional logging to ensure notes are found
    if (notes && notes.length > 0) {
      console.log(`Fetched ${notes.length} notes for Room ID: ${roomId}`);
    } else {
      console.log(`No notes found for Room ID: ${roomId}`);
    }

    // ✅ Return the notes (empty array if none found)
    return NextResponse.json(
      { notes: notes || [] }, // Always return an array (empty if no notes found)
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
