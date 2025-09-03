import mongoose from "mongoose";

//Funtion to connect database
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("DataBase Connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/mewchat`);
  } catch (error) {
    console.log(error);
  }
};
