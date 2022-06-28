const jwt = require("jsonwebtoken") //require jsonwebtoken
const mongoose = require("mongoose") //require mongoose
const blogModel = require("../models/blogModel") //import blogModel
var dToken

//<-------------------------------Authentication------------------------------------------------------//
const authentication = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

    dToken = jwt.verify(token, "project1-group10");

    if (!dToken) {
      return res.status(400).send({ status: false, msg: "token is invalid" })
    }
    req.body.tokenId = dToken.authorId
    next();
  }
  catch (error) {
    res.status(500).send({ status:false, msg: error.message })
  }
}

//<-----------------------------Authorisation-----------------------------------------------------------//

const Authorisation = async function (req, res, next) {
  try {
    let presentPrams = req.params
    if (Object.keys(presentPrams).length == 0) presentPrams = req.query
    if (Object.keys(presentPrams).length == 0) return res.status(400).send({ status: false, msg: "no input found" })

    if (presentPrams.blogId)
      if (!mongoose.isValidObjectId(presentPrams.blogId))
        return res.status(400).send({ status: false, msg: "invalid blogId" })

    if (presentPrams.authorId)
      if (!mongoose.isValidObjectId(presentPrams.authorId))
        return res.status(400).send({ status: false, msg: "invalid authorId" })

    let auth
    if (!presentPrams.blogId) {
      auth = await blogModel.find({$and:[{authorId:dToken.authorId},presentPrams]}).select({ _id: 0, authorId: 1 })
      if(auth.keys()==-1)
      return res.status(404).send({status:false,msg:"unautorised"})
    } else {
      auth = await blogModel.findById({_id: presentPrams.blogId }).select({_id: 0, authorId: 1 })
      if (!auth) return res.status(404).send({ status: false, msg: "NoT found" })
      if(dToken.authorId!=auth.authorId)
      return res.status(404).send({status:false,msg:"unautorised"})
    }
    next()
  } catch (err) {
    res.status(500).send({ status:false, msg: err.message })

  }
}


//<----------------------------------exporting------------------------------------------//

module.exports = { Authorisation, authentication }


