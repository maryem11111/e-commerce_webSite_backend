const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY
});

const cloudinaryUploadImg = async (fileToUpload) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUpload,{resource_type: "auto"}, (error,result) => {
          if (error) {
            console.error("Error uploading cloudinary :", error);
            reject(error);
        } else {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id
            });
        }
        });
    });
};
const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(fileToDelete,{resource_type: "auto"}, (error,result) => {
        if (error) {
          console.error("Error uploading cloudinary :", error);
          reject(error);
      } else {
          resolve({
              url: result.secure_url,
              asset_id: result.asset_id,
              public_id: result.public_id
          });
      }
      });
  });
};


module.exports = {cloudinaryUploadImg,cloudinaryDeleteImg };
