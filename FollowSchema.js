const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {ObjectId} = mongoose.Schema.Types;

const FollowSchema = new mongoose.Schema({
    To:{
        type:ObjectId,
        ref:"User"
    },
    From:{
        type:ObjectId,
        ref:"User"
    }
}, { timestamps: true });


module.exports = mongoose.model('Follow', FollowSchema);