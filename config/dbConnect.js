const mongoose = require("mongoose");

const mongoURI = `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}@cluster0.zhctftr.mongodb.net/fastschedular?retryWrites=true&w=majority`;

// connect mongodb database
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}@cluster0.zhctftr.mongodb.net/fastschedular?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB database connected!!");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
