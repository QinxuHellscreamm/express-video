const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const videoLikeSchema = new mongoose.Schema({
    videoId:{
        type: mongoose.ObjectId,
        required: true,
        ref: 'Video'
    },
    user:{
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    like:{
        type: Number,
        required:true,
        enum: [1,-1]
    },
    ...baseModel
})
module.exports = videoLikeSchema