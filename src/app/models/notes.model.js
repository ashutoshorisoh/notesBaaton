import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    note:{
        type: String
    }
})

const Notes = mongoose.model("Notes", notesSchema)

export default Notes