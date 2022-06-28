const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

//<----------------------------------createAuthor---------------------------------------------------------------------------->//
const createAuthor = async function (req, res) {
    try {
       let data = req.body
       if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "Provide data" })
      //<----------------------------validation----------------------------------------------------->//
       if (!data.fname)
          return res.status(400).send({ status: false, msg: "fname is mandatory" })
       if (typeof data.fname != "string")
          return res.status(400).send({ status: false, msg: "Enter your valid fname" })
       let firstName = data.fname.trim()
       if (firstName.length === 0)
          return res.status(400).send({ status: false, msg: "Enter your firstName " })
 
       if (!data.lname)
          return res.status(400).send({ status: false, msg: "lname is mandatory" })
       if (typeof data.lname != "string")
          return res.status(400).send({ status: false, msg: "Enter your valid lname" })
       let lastName = data.lname.trim()
       if (lastName.length === 0)
          return res.status(400).send({ status: false, msg: "Enter your lastName " })
 
       if (!data.title)
          return res.status(400).send({ status: false, msg: "title is mandatory" })
       const enums = ["Mr", "Mrs", "Miss"]
       let includes = data.title
       let Enum = enums.includes(includes)
       if (!Enum) return res.status(400).send({ status: false, msg: "Enter the valid title Mr,Mrs,Miss" })
 
       if (!data.email)
          return res.status(400).send({ status: false, msg: "email is mandatory" })
       let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
       let mailtest = data.email
       let emailValidate = regex.test(mailtest)
       if (!emailValidate) return res.status(400).send({ status: false, msg: "Enter Your Valid mail" })
       let emailCheck = await authorModel.findOne({ email: data.email })
       if (emailCheck) return res.status(400).send({ status: false, msg: "email already used" })
 
       if (!data.password)
          return res.status(400).send({ status: false, msg: "password is mandatory" })
       let pass = data.password.trim()
       if (pass.length === 0)
          return res.status(400).send({ status: false, msg: "Enter your Password " })
      //<---------------------------create------------------------------------------------------>//
       let saveData = await authorModel.create(data)
 
       res.status(201).send({ status: true, msg:"Author created",data: saveData })
 
    } catch (err) {
 
       res.status(500).send({ status: false, msg: err.message })
    }
 }

 //<-------------------------------------loginAuthor------------------------------------------------------------------------>//
 const loginAuthor = async function (req, res) {
    try {
       let data = req.body
       //<------------------------------validation---------------------------------------------------------------->//
       if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "Provide data" })
       if (!data.email)
          return res.status(400).send({ status: false, msg: "email is mandatory" })
       let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
       let mailtest = data.email
       let emailValidate = regex.test(mailtest)
       if (!emailValidate) return res.status(400).send({ status: false, msg: "Enter Your Valid mail" })
 
 
       if (!data.password)
          return res.status(400).send({ status: false, msg: "password is mandatory" })
       let pass = data.password.trim()
       if (pass.length === 0)
          return res.status(400).send({ status: false, msg: "Enter your Password " })
 
 
       let author = await authorModel.findOne({ email: data.email, password: data.password });
       if (!author)
          return res.status(400).send({ status: false, msg: "username or the password is not correct", });
       //creating token
       //<---------------------------createtoken-------------------------------------------------------------------->//
       let token = jwt.sign(
          {
             authorId: author._id.toString(),
             projectName: "blogging-site"
          },
          "project1-group10"
       );
       res.setHeader("x-api-key", token);
       res.status(200).send({ status: true, data: token });
    } catch (err) {
       console.log("This is the error :", err.message)
       res.status(500).send({ status: false, msg: err.message })
    }
 }

 module.exports={createAuthor,loginAuthor}