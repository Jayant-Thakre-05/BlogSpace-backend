const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "blog",
    });
    if (conn) {
      console.log("Mongodb connected");
    }
  } catch (error) {
    console.log("error in db", error);
  }
};
module.exports = connectDB;