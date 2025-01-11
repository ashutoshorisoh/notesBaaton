import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";
import Notes from "@/app/models/notes.model";
import Room from "@/app/models/room.model";

export const POST = async (req) => {
  try {
    await connectDB(); // Ensure DB is connected
    const body = await req.json();

    console.log("Received body:", body);  // Log the request body for debugging

    const { note, room } = body;

    if (!note || !room) {
      return NextResponse.json(
        { error: "Both note and room are required" },
        { status: 400 }
      );
    }

    // Ensure room ID is a valid ObjectId
    const roomId = new mongoose.Types.ObjectId(room);

    const newNote = new Notes({ note, room: roomId });
    await newNote.save();

    console.log("Saved newNote:", newNote);  // Log the saved note for debugging

    return NextResponse.json(newNote, { status: 201 }); // Send only the `newNote`
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { error: true, message: "Error adding note", details: error.message },
      { status: 500 }
    );
  }
};
