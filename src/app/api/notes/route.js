import Notes from "@/app/models/notes.model";
import { NextResponse } from "next/server";
import connectDB from "@/dbconfig/dbconfig";

export const  POST = async(req)=>{
 
 try{
    const {note} = await req.json();
   
    if(!note){
        return NextResponse.json({ error: "please enter something tpo upload" }, { status: 400 })
    }
    else{
        await connectDB();

        const newNotes = new Notes({
          note,
        })
      
        await newNotes.save() 
        return NextResponse.json({ message: "notes added successfully"}, {status:201})
    }
    
    
 } catch(error){
    return NextResponse.json({message: "error uploading notes"},{status:400})
 }  

}