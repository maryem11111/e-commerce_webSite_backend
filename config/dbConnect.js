const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: false,
    });
    console.log("database connected successfully");
  } catch (error) {
    console.log("database error:", error);
  }
};

module.exports = dbConnect;
