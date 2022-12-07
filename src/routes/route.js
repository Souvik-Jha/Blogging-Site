const express = require('express');
const router = express.Router();
const blogController=require("../controllers/blogController") 
const middleware=require("../middleware/auth")
const authorController=require("../controllers/authorController")


//-------------------------------- author controller--------------------------------------------
router.post("/authors",authorController.createAuthor)

router.post("/login",authorController.loginAuthor)


//---------------------------------blog controller----------------------------------------------
 
router.post("/blogs",middleware.authentication, blogController.createBlog)

router.get("/blogs",middleware.authentication, blogController.getBlog)

router.put("/blogs/:blogId",middleware.authentication, blogController.updateBlog)

router.delete("/blogs/:blogId",middleware.authentication, blogController.deleteBlogById)

router.delete("/blogs",middleware.authentication, blogController.deleteBlogByParams)




module.exports = router;