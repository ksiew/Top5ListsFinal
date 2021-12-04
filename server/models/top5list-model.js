const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: {type: String, required: false},
        published: {type: Boolean, default : false},
        views: {type: Number, default: 0},
        likes: {type: [String], default: []},
        dislikes: {type: [String], default: []},
        comments: {type: [String], default: []},
        publishDate: {type: Number, default: 0}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
