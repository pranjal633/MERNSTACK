const multer = require("multer")

multer.diskStorage({
    destination : function(req, file, cb){ //post gareko file lai destination define gareko
        cb(null, './storage') //callbak(error, success)
    },
    filename : function(req, file,cb){
        cb(null, "pranjal-" + file.originalname); // file ko naming gareko
    },
})

module.exports = {
    storage,
    multer,
}