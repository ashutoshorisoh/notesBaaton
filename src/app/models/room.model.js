import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const roomSchema = new mongoose.Schema({
    roomname: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
    },
});

roomSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password during login
roomSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
