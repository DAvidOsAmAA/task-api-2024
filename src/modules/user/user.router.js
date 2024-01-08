import { Router } from "express";
import { logIn, signUp, changePassword,  changeUser, deleteUser, logOut, deleteUserSoft} from "./user.controller.js";
import { asyncHandler } from "../../../utilies/asyncHandler.js";
import { authentication } from "../../midleware/auth.midleware.js";
const router = Router()


router.post("/signUp", asyncHandler(signUp))

router.post("/login", asyncHandler(logIn))



router.patch("/changePassword", authentication, asyncHandler(changePassword))


router.patch("/changeUser",authentication,asyncHandler(changeUser))


router.delete("/deleteUser",authentication,asyncHandler(deleteUser))


router.patch("/softDelete",authentication,asyncHandler(deleteUserSoft))


router.post("/logOut",authentication,asyncHandler(logOut))


export default router;