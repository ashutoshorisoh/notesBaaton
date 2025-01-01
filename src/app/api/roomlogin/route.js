import connectDB from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Room from "@/app/models/room.model";

export const POST = async (req) => {
    try {
        const { roomname, password } = await req.json(); // Extracting body from the request

        // Check for missing fields
        if (!roomname || !password) {
            console.log("Username or password not provided");
            return NextResponse.json({ error: "Please provide username and password" }, { status: 400 });
        }

        await connectDB();

        // Check if user already exists
       
        // Create new user
        const newRoom = new Room({
            roomname,
            password,
        });

        // Save the new user
        await newRoom.save();
        console.log("User created successfully", newRoom);

        return NextResponse.json({ message: "room created successfully", userId: newRoom._id }, { status: 201 });
    } catch (error) {
        console.error("Error during signup:", error);  // Log the error to understand the issue
        return NextResponse.json({ message: "Connection failed or error during signup",  error: error.message }, { status: 500 });
    }
};
