const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    subject: {
        type: String, 
        required: true
    },
    multichoice: {
        type: Boolean,
        default: false
    },
    choiceOptions: {
        type: Number,
        default: 1
    },
    options: [{
        type: String,
        required: true
    }],
    votes: [{   
        type: Number 
    }],
    voters: [[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }]],
    tags: [{
        type: String,
        required: false,
        default: null
    }]
}, {
    timestamps: true
});

const PollModel = mongoose.model("Poll", pollSchema);

module.exports = PollModel;