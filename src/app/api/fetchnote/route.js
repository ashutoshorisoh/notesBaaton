import connectDB from "@/dbconfig/dbconfig";
import Notes from "@/app/models/notes.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId"); // Extract roomId from query params

    if (!roomId) {
      return NextResponse.json(
        { message: "Room ID not provided" },
        { status: 400 }
      );
    }

    // Convert roomId to ObjectId
    const notes = await Notes.findOne({ room: roomId }).populate('room');
    const actualNote = notes.note

    console.log("Fetched notes:", actualNote);

    return NextResponse.json(
      { actualNote },
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