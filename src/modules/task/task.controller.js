import { Task } from "../../../DB/models/task.model.js";
import { User } from "../../../DB/models/user.model.js";


export const createTask = async (req, res, next) => {

  const { title, description, status, userId, assignedTo, deadLine } = req.body
  const userEmail = req.payload.email;
  const isUser = await User.findOne({ email: userEmail });
  if (!isUser) return next(new Error("user not found", { cause: 404 }));
  const createTask = await Task.create({ title, description, status, userId, assignedTo, deadLine })
  res.json({ success: true, message: "task created successfully", result: createTask })

}

export const updateTask = async (req, res, next) => {
  const { id } = req.params
  const { title, description, status, assignedTo } = req.body;
  const userEmail = req.payload.email;
  const userID = req.payload.id;
  const findCreator = await Task.findOne({ userId: userID })
  if (!findCreator) return next(new Error("you are not the creator", { cause: 403 }))
  const findUser = await User.findOne({ email: userEmail });
  if (!findUser) return next(new Error("user not found", { cause: 404 }))
  const updateTask = await Task.findByIdAndUpdate(id, { title, description, status, assignedTo })
  res.json({ success: true, message: "updated the task successfully", result: updateTask })
}


export const getallTasksWithUserInfo = async (req, res, next) => {
  const userEmail = req.payload.email;
  const findUser = await User.findOne({ email: userEmail });
  if (!findUser) return next(new Error("user not found", { cause: 404 }))
  const getAllTasksWithUsr = await Task.find().populate("userId")
  res.json({ success: true, message: getAllTasksWithUsr })
}




export const taskWithUser = async (req, res, next) => {
  const userEmail = req.payload.email;
  const userID = req.payload.id
  const findUser = await User.findOne({ email: userEmail });
  if (!findUser) return next(new Error("user not found", { cause: 404 }));
  const taskUser = await Task.find({ userId: userID }).populate("userId")
  res.json({ success: true, result: taskUser })
}



export const deleteTask = async (req, res, next) => {
  const { title } = req.body;
  const userID = req.payload.id;
  const findCreator = await Task.findOneAndDelete({ userId: userID })
  if (!findCreator) return next(new Error("you are not the creator", { cause: 403 }))
  const deleteTask = await Task.find({ title })
  if (!deleteTask) {
    return next(new Error("Task not found", { cause: 404 }))
  }
  res.json({ success: true, message: "delete successfully", result: deleteTask })
}


export const TaskAfterDeadline = async (req, res, next) => {
  const { deadLine, timeNow } = req.body;
  const userID = req.payload.id;
  const findCreator = await Task.findOneAndDelete({ userId: userID })
  if (!findCreator) return next(new Error("you are not the creator",{ cause: 403 }))
  const taskAfterDelete = await Task.findOne({ deadLine: deadLine })
  if (deadLine < timeNow) {
    return res.json({ success: true, message: "task does't finished yet after dead line", result: taskAfterDelete })
  }
  res.json({ success: true, message: "you finished all tasks in the time " })
}


