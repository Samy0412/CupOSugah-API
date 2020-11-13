const cloudinary = require('cloudinary').v2
const formData = require('express-form-data')
const router = require("express").Router();


// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports = db => {

  
router.use(formData.parse())

// image upload API
router.post("/upload", (req, res) => {

  const path = Object.values(req.files)[0].path

  cloudinary.uploader.upload(path)
    .then(image => res.json([image]))

});

  return router;
};
