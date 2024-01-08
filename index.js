import express from "express";
import { connectionDb } from "./DB/connection.js";
import taskRouter from './src/modules/task/task.router.js'
import userRouter from './src/modules/user/user.router.js'
const app = express()
const port = 3000
app.use(express.json())
connectionDb();

app.use("/task", taskRouter)
app.use("/user", userRouter)



app.use((error, req, res, next) => {
  const statusCode = error.cause
  return res.status(statusCode).json({ success: false, message: error.message, stack: error.stack })
})



app.listen(port, () => {
  console.log(`server running success in port ${port}`)
})