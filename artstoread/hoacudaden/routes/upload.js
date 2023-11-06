const express = require('express');
const router = express.Router();
var multer = require('multer');
require('dotenv').config();
const fileUpload = multer();
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

router.get('/',function(req,res){
    res.send('Hello');
})

router.post('/', fileUpload.single('file'), function (req, res, next) {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
    
           streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        res.send(result.url);
    }
    
    upload(req);
    });
module.exports = router;