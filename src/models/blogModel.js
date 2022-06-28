const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema( {
    title:{
        type:String,
        required:true,
        trim: true
    },
    body: {
        type:String,
        required:true,
        trim: true
    },
    authorId:{
        type: ObjectId,
        ref : 'Author',
        trim: true,
        required:true
    },
    tags:[String],
    category:{
        type:String,
        required:true,
        trim: true
    },
    subcategory:{
        type:[String],
        trim: true
    },
    isDeleted:{
        type: Boolean,
        default:false,
        trim: true
    },
    isPublished:{
        type:Boolean,
        default:false,
        trim: true
    },
    deletedAt: {
      type:Date
    },
    publishedAt: {
        type:Date
    }

  
}, { timestamps: true });



//<----------------------------------exporting------------------------------------------//


module.exports = mongoose.model('Blog', blogSchema)


