import { Schema, model } from "mongoose";



const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: Number, required: true },
  deleted: { type: Boolean, default: false }
},{
  timestamps:true
})

export const User = model("User",userSchema)