import connectDB from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Room from "@/app/models/room.model";

export const POST = async (req) => {
    try {
        const { roomname, password } = await req.json(); // Extracting body from the request

        // Check for missing fields
        if (!roomname || !password) {
            console.log("Room name or password not provided");
            return NextResponse.json({ error: "Please provide room name and password" }, { status: 400 });
        }

        await connectDB();

        // Check if the room already exists
        const existingRoom = await Room.findOne({ roomname });
        if (existingRoom) {
            console.log("Room already exists");
            return NextResponse.json({ message: "Room already exists", userId: existingRoom._id }, { status: 200 });
        }

        // Create new room if it doesn't exist
        const newRoom = new Room({
            roomname,
            password,
        });

        // Save the new room
        await newRoom.save();
        console.log("Room created successfully", newRoom);

        return NextResponse.json({ message: "Room created successfully", userId: newRoom._id }, { status: 201 });
    } catch (error) {
        console.error("Error during room creation:", error);  // Log the error to understand the issue
        return NextResponse.json({ message: "Connection failed or error during room creation", error: error.message }, { status: 500 });
    }
};
