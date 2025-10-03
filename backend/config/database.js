import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const makeConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      "Db connection successfuly making at",
      makeConnection.connection.host
    );
  } catch (error) {
    console.log("Someting went wrong while making conneciotn ", error);
    process.exit(1);
  }
};

export default dbConnection;
