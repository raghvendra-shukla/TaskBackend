const mongoose=require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    priority: {
        type: Number,
        required: true,
        enum: [0, 1, 2]
    }
});

const user = mongoose.model('usernumber', userSchema);
module.exports=user;