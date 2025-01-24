import mongoose from "mongoose"

const connectToDatabase = async()=>{
   try {
    await mongoose.connect('mongodb://localhost:27017/safe-task')
    console.log("database connected");
   } catch (error) {
    console.log(error);
   }
}

export default connectToDatabase
