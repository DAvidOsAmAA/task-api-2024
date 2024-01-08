import { Router } from "express";
import { authentication } from "../../midleware/auth.midleware.js";
import { asyncHandler } from "../../../utilies/asyncHandler.js";
import { createTask, updateTask, getallTasksWithUserInfo, taskWithUser, deleteTask, TaskAfterDeadline } from "./task.controller.js"
const router = Router()



router.post("/createTask", authentication, asyncHandler(createTask))


router.patch("/updateTask/:id", authentication, asyncHandler(updateTask))



router.get("/allTasksWithUser", authentication, asyncHandler(getallTasksWithUserInfo))



router.get("/taskWithUser", authentication, asyncHandler(taskWithUser))



router.get("/deleteTask", authentication, asyncHandler(deleteTask))


router.get("/TaskAfterDeadline", authentication, asyncHandler(TaskAfterDeadline))







export default router