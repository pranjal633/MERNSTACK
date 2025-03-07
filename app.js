const express = require("express")
const app = express()
app.use(express.json());

app.get("/", (req, res) => { // call back function
    res.send("Welcome to our Home Page....")
})

app.get("/blog", (req, res) => {
    res.status(200).json({
        msg : "This is blog page...."
    })
})
app.listen(3000, () => {
    console.log("Your node js project has been started....")
})