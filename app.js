const fs = require("fs");
require("dotenv").config();
const express = require("express");
const connectDatabase = require("./database");
const Blog = require("./model/blogmodel");
const {storage, multer} = require("./middleware/multerConfig");
const upload = multer({storage : storage });
const app = express()
app.use(express.json());


connectDatabase()

app.get("/", (req, res) => { // call back function
    res.send("Welcome to our Home Page....");
});



app.post("/blog", upload.single("image"),async (req, res) => {
    console.log(req.body)
    
    const {faculty, course, mentor} = req.body

    const filename = req.file.filename


    if(!faculty || !course || !mentor){
        return res.status(400).json({
            msg : "Sorry..! Please enter complete data..."
        })
    }
    await Blog.create({
        faculty : faculty,
        course : course,
        mentor : mentor,
        image : filename,
    })
   res.status(200).json({
    msg: "POST API hit successfully",
   });
});

//get operation
app.get("/blog", async (req, res) => {
    const blogs = await Blog.find();
    res.status(200).json({
        msg : "I am creating a mernstack project",
        data: blogs,
    });
});

//single get API
app.get("/blog/:id", async (req,res) => {
    // console.log(req.params.id)
    // console.log("Single Blog API hitted successfully")
    const {id} = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(400).json({
            msg : "Please enter correct id....."
        })
    }
    res.status(200).json({
        msg : "Single Blog fetch successfully",
        data : blog,
     })
 });

 app.delete("/blog/:id",async(req,res) => {
    const {id} = req.params
    const blog = await Blog.findById(id)
    const imageName = blog.image;
    fs.unlink('storage/${imageName}', (err) => {
        if (err) {
            console.log(err)
        }else{
            console.log("File deleted successfully")
        }
    })
    await Blog.findByIdAndDelete(id)
    res.status(200).json({
        msg: "Blog Deleted Successfully",
    })
 })

app.use(express.static("./storage"));

app.listen(process.env.PORT, () => {
    console.log("Your node js project has been started....")
})