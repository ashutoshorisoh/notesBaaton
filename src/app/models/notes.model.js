import mongoose from "mongoose";
import Room from "./room.model";

const notesSchema = new mongoose.Schema({
  note: {
    type: String,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});

// Check if the model already exists, and use it if so; otherwise, create a new model
const Notes = mongoose.models.Notes || mongoose.model("Notes", notesSchema);

export default Notes;
