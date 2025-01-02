import connectDB from "@/dbconfig/dbconfig";
import Notes from "@/app/models/notes.model";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    await connectDB();
    
    // Get roomId from params (URL route parameter)
    const { roomId } = params;

    if (!roomId) {
      return NextResponse.json(
        { message: "Room ID not provided" },
        { status: 400 }
      );
    }

    // Fetch notes based on roomId
    const notes = await Notes.find({ room: roomId });

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
