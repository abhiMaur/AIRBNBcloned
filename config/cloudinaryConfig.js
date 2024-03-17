const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    api_key: process.env.CLOUDINARY_API_KEY
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust',
      allowedFormats: ['png', 'jpeg', 'jpg']
    },
  });

  module.exports = {
    cloudinary,
    storage
  }