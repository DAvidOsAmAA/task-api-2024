import mongoose from "mongoose";

export const connectionDb = async ()=>{
  return await mongoose.connect("mongodb://127.0.0.1:27017/Assignment7")
  .then(()=>console.log("DB connected"))
  .catch((error)=>console.log(error))
}