const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    password: {
        type: String, 
        required: true
    },
    polls: [{
        type: mongoose.Types.ObjectId,
        ref: 'Poll'
    }]
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;