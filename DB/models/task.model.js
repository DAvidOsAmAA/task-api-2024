import { Schema, Types, model } from "mongoose";



const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["todo", "doing", "done"],
    required: true
  },
  userId: { type: Types.ObjectId, ref: "User" },
  assignedTo: { type: String, required: true },
  deadLine: { type: Number, required: true }
})


export const Task = model("Task", taskSchema)