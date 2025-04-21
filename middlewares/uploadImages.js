const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, `image-${uniqueSuffix}-${file.originalname}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported file format" }, false);
    }
};

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 },
});

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const outputPath = path.join(__dirname, "../public/images/products", file.filename);
      
            await sharp(file.path)
              .resize(300, 300)
              .toFormat("jpeg")
              .jpeg({ quality: 90 })
              .toFile(outputPath);
      
            // Supprimer l'image d'origine une fois redimensionnée
            try {
              await fs.unlink(file.path);
            } catch (err) {
              console.error("Error while deleting the original image :", err);
            }
          })
        );
      
        next();
      };
      
       

const BlogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
          const outputPath = path.join(__dirname, "../public/images/blogs", file.filename);
    
          await sharp(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(outputPath);
    
          try {
            await fs.unlink(file.path);
          } catch (err) {
            console.error("Error while deleting the original image :", err);
          }
        })
      );
    
      next();
    };

module.exports = { uploadPhoto, productImgResize, BlogImgResize };
