const mongoose = require("mongoose")
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")



const createBlog = async function (req, res) {
   try {
      let data = req.body
      if (Object.keys(data).length == 1) return res.status(404).send({ status: false, msg: "Provide data" })

      if (!data.title)
         return res.status(400).send({ status: false, msg: "title is mandatory" })
      if (typeof data.title != "string")
         return res.status(400).send({ status: false, msg: "Enter your valid Title" })
      let Title = data.title.trim()
      if (Title.length === 0)
         return res.status(400).send({ status: false, msg: "Enter your Title " })

      if (!data.body)
         return res.status(400).send({ status: false, msg: "body is mandatory" })
      if (typeof data.body != "string")
         return res.status(400).send({ status: false, msg: "give some inputs " })
      let Body = data.body.trim()
      if (Body.length === 0)
         return res.status(400).send({ status: false, msg: "Enter inputs at Body " })

      if (!data.authorId)
         return res.status(400).send({ status: false, msg: "authorId is mandatory" })
      if (typeof data.authorId != "string")
         return res.status(400).send({ status: false, msg: "give valid authorId " })
      if (!mongoose.isValidObjectId(data.authorId))
         return res.status(400).send({ status: false, msg: "invalid author Id" })
      let authId = await authorModel.findById(data.authorId)
      if (!authId)
         return res.status(401).send({ status: false, msg: " Author not found " })
      if (req.body.tokenId != data.authorId)
         return res.status(400).send({ status: false, msg: "you are not allow" })

      if (!data.category)
         return res.status(400).send({ status: false, msg: "category is mandatory" })
      if (typeof data.category != "string")
         return res.status(400).send({ status: false, msg: "Enter your valid Category" })
      let Category = data.category.trim()
      if (Category.length === 0)
         return res.status(400).send({ status: false, msg: "Enter Category " })

      let saveData = await blogModel.create(data)

      res.status(201).send({ status: true, data: saveData })
   } catch (err) {

      res.status(500).send({ status: false, msg: err.message })
   }
}



const getBlog = async function (req, res) {
   try {
      let query = req.query
      let allBlogs = await blogModel.find({ $and: [query, { isDeleted: false, isPublished: true }] })
      if (allBlogs.length == 0) return res.status(404).send({ msg: "no such blog" })
      res.status(200).send({ status: true, data: allBlogs })
   }
   catch (error) {
      res.status(500).send({ status: false, msg: error.message })
   }

}


const updateBlog = async function (req, res) {
   try {
      let data = req.body
      let tags = data.tags
      let subcategory = data.subcategory
      let blogId = req.params.blogId
      if(tags){
         let newTags = tags.trim()
         if(newTags.length==0) return res.status(400).send({status:false,msg:"give input properly"})
      }

      if(subcategory){
         let newSub = subcategory.trim()
         if(newSub.length==0) return res.status(400).send({status:false,msg:"give input properly"})
      }

      if(data.title){
         let newTitle = data.title.trim()
         if(newTitle.length==0) return res.status(400).send({status:false,msg:"give input properly"})
      }

      if(data.body){
         let newBody = data.body.trim()
         if(newBody.length==0) return res.status(400).send({status:false,msg:"give input properly"})
      }

      let validBlog = await blogModel.findOne({_id: blogId, isDeleted: false })
      if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "invalid blog Id" })
      if (!validBlog) return res.status(404).send({ status: false, msg: "no such Blog" })

      let updateBlog = await blogModel.findOneAndUpdate({
         _id: blogId
      }, {
         $set: {
            isPublished: true,
            publishedAt: Date.now(),
            body: data.body,
            title: data.title
         },
         $push: {
            tags, subcategory
         }
      }, {
         new: true
      })
      res.status(201).send({ status: true, data: updateBlog })
   }
   catch (err) {
      res.status(500).send({ status: false, msg: err.message })
   }
}


const deleteBlogById = async function (req, res) {
   try {
      let blogid = req.params.blogId
      let findId = await blogModel.findOne({ _id: blogid, isDeleted: false }).select({ _id: 1 })
      if (!findId) {
         res.status(404).send({ status: false, msg: "no such blog" })
      }
      else {
         let updateDelete = await blogModel.findOneAndUpdate({ _id: findId._id }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
         console.log(updateDelete)
         res.status(200).send({ status: true, msg: "blog is deleted" })
      }
   }
   catch (err) {
      res.status(500).send({ status: false, msg: err.message })
   }
}


const deleteBlogByParams = async function (req, res) {
   try {

      let getobject = req.query

      let updateData = await blogModel.updateMany(
         { $and: [{ authorId: req.body.tokenId }, { isDeleted: false }, getobject] }, { $set: { isDeleted: true, deletedAt: Date.now() } },
         { new: true })

      if (!updateData.modifiedCount)

         return res.staus(400).send({ status: false, msg: "no such blog" })

      res.status(200).send({ status: true, msg: "numbers of delated blog= " + updateData.modifiedCount })
   }
   catch (err) {
      res.status(500).send({ status: false, msg: err.message })
   }
}


module.exports = {
   createBlog,
   getBlog,
   updateBlog,
   deleteBlogById,
   deleteBlogByParams
}
