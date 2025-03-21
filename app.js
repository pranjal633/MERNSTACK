require("dotenv").config();
const express = require("express");
const connectDatabase = require("./database");
const Blog = require("./model/blogmodel");
const { storage , multer } = require("./middleware/multerConfig");
const upload = multer({storage : storage });
const app = express()
app.use(express.json());

storage:

connectDatabase()

app.get("/", (req, res) => { // call back function
    res.send("Welcome to our Home Page....");
});

app.get("/blog", (req, res) => {
    res.status(200).json({
        msg : "This is blog page...."
    });
});

app.post("/blog", upload.single("image"),async (req, res) => {
    console.log(req.body)
    
    const {faculty, course, mentor} = req.body

    const filename = req.file.filename; //multipart /form-data


    if(!faculty || !course || !mentor){
        return res.status(400).json({
            msg : "Sorry..! Please enter complete data..."
        })
    }
    await Blog.create({
        faculty : faculty,
        course : course,
        mentor : mentor,
        image : image,
    })
   res.status(200).json({
    msg: "POST API hit successfully",
   });
});


app.listen(process.env.PORT, () => {
    console.log("Your node js project has been started....")
})