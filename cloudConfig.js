// 3rd party service for storing uploaded file
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//config means conbining backend with cloudinary Acccount
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({//uploading file in wanderlust_dev with follwoing format
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_dev',
    allowedFormat: ["png", "jpg", "jpeg"], // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports = {
    cloudinary,
    storage
};