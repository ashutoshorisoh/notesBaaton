import Notes from "@/app/models/notes.model";
import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";

// POST: Add a new note
export const POST = async (req) => {
  try {
    await connectDB(); // Ensure DB is connected
    const body = await req.json();

    const { note, room } = body;

    if (!note || !room) {
      return NextResponse.json(
        { error: "Both note and room are required" },
        { status: 400 }
      );
    }

    const newNote = new Notes({ note, room });
    await newNote.save();

    return NextResponse.json(
      { message: "Note added successfully", newNote },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { error: true, message: "Error adding note", details: error.message },
      { status: 500 }
    );
  }
};
