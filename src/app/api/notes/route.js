import Notes from "@/app/models/notes.model";
import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";

// Connect to DB
await connectDB();

// POST: Add a new note
export const POST = async (req) => {
  try {
    const { note, room } = await req.json();

    if (!note || !room) {
      return NextResponse.json(
        { error: "Both note and room are required" },
        { status: 400 }
      );
    }

    const newNotes = new Notes({
      note,
      room,
      updatedAt: new Date(),
    });

    await newNotes.save();
    return NextResponse.json(
      { message: "Note added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { message: "Error uploading note", error: error.message },
      { status: 500 }
    );
  }
};

// GET: Fetch all notes for a room
export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const room = url.searchParams.get("room");

    if (!room) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const notes = await Notes.find({ room }).sort({ updatedAt: -1 });
    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { message: "Error fetching notes", error: error.message },
      { status: 500 }
    );
  }
};

// PATCH: Update a note
export const PATCH = async (req) => {
  try {
    const { id, note } = await req.json();

    if (!id || !note) {
      return NextResponse.json(
        { error: "Note ID and updated content are required" },
        { status: 400 }
      );
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      { note, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found or could not be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Note updated successfully", updatedNote }, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { message: "Error updating note", error: error.message },
      { status: 500 }
    );
  }
};
