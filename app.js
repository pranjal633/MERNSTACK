require("dotenv").config();
const express = require("express");
const connectDatabase = require("./database");
const Blog = require("./model/blogModel");

const { storage, multer } = require("./middleware/multerConfig");
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
const fs = require("fs");

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

connectDatabase();
// Read (R)
app.get("/", (req, res) => {
  // call back function
  res.send("Welcome to Home Page....");
});

// create (C)
app.post("/blog", upload.single("image"), async (req, res) => {
  const { faculty, course, mentor } = req.body; // text for data

  let filename;
  if(req.file) {
    filename = "http://localhost:3000/" + req.file.filename; // multipart / form-data
  } else {
    filename = "https://st2.depositphotos.com/1000792/10644/v/450/depositphotos_106447850-stock-illustration-cute-baby-penguin-is-laughing.jpg"
  }

  console.log(req.body);
  console.log(filename);
  console.log(req.file);

  if (!faculty || !course || !mentor) {
    return res.status(400).json({
      msg: "Sorry..!! Please enter complete datas....",
    });
  }
  await Blog.create({
    faculty: faculty,
    course: course,
    mentor: mentor,
    image: filename,
  });

  res.status(200).json({
    msg: "Post API hit successfully....",
  });
});

// GET Operation
app.get("/blog", async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({
    msg: "Blog fetch successfully",
    data: blogs,
  });
});

// single get api
app.get("/blog/:id", async (req, res) => {
  // const id = req.params.id
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({
      msg: "please enter correct id",
    });
  }

  res.status(200).json({
    msg: "Single Blog fetch successfully",
    data: blog,
  });
});

// Update (partial update : patch method)

app.patch("/blog/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { faculty, course, mentor } = req.body;
  let imageName;
  if (req.file) {
    imageName = "http://localhost:3000/" + req.file.filename;
    const blog = await Blog.findById(id);
    const oldImageName = blog.image;
    fs.unlink(`storage/${oldImageName}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File deleted successfully...");
      }
    });
  }
  await Blog.findByIdAndUpdate(id, {
    faculty: faculty,
    course: course,
    mentor: mentor,
    image: imageName,
  });
  res.status(200).json({
    msg: "Blog updated successfully....!",
  });
});

// Delete Operation

app.delete("/blog/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  const imageName = blog.image;

  fs.unlink(`storage/${imageName}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted successfully...");
    }
  });
  await Blog.findByIdAndDelete(id);
  res.status(200).json({
    msg: "Blog deleted successfully..",
  });
});

app.use(express.static("./storage"));

app.listen(process.env.PORT, () => {
  console.log("Your nodejs project has been started....");
});