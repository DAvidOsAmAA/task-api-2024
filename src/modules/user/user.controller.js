import { User } from "../../../DB/models/user.model.js";
import Jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs'
import { Token } from "../../../DB/models/token.model.js";

export const signUp = async (req, res, next) => {

  const { confirmPassword, userName, email, password, age, gender, phone } = req.body
  if (password !== confirmPassword) {
    return next(new Error("Password and rePassword must match", { cause: 401 }))
  }
  const isUser = await User.findOne({ email })
  if (isUser) {
    return next(new Error("email is already existed", { cause: 409 }))
  }
  const hashPassword = bcryptjs.hashSync(password, 8)
  const user = await User.create({ userName, email, password: hashPassword, age, gender, phone })
  return res.json({ success: true, message: "user added successfully", result: user })

}




export const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  const isUser = await User.findOne({ email })
  if (!isUser) return next(new Error("email not found", { cause: 404 }));
  const match = bcryptjs.compareSync(password, isUser.password)
  if (!match) return next(new Error("password doesn't match", { cause: 401 }))
  const token = Jwt.sign({ id: isUser._id, email: isUser.email }, "secretKey")
  await Token.create({ token, user: isUser._id, agent: req.header["user-agent"] })
  return res.json({ success: true, message: "login successfully", token: token })
}



export const changePassword = async (req, res, next) => {
  const { password, currentPassword } = req.body;
  const userEmail = req.payload.email
  const id = req.payload.id
  //check the user
  const isUser = await User.findOne({ email: userEmail })
  if (!isUser) return next(new Error("you are not the user", { cause: 401 }));
  const isPasswordCorrect = await bcryptjs.compare(currentPassword, isUser.password);
  if (!isPasswordCorrect) return next(new Error("your current password doesn't correct", { cause: 401 }))
  const hashedNewPassword = bcryptjs.hashSync(password, 8)
  await User.findByIdAndUpdate(id, { password: hashedNewPassword })
  res.status(200).json({ success: true, result: hashedNewPassword })
}


//update user
export const changeUser = async (req, res, next) => {
  const { userName, email, age, gender, phone } = req.body
  const userEmail = req.payload.email;
  const id = req.payload.id
  const isUser = await User.findOne({ email: userEmail })
  if (!isUser) return next(new Error("you are not the user", { cause: 401 }));
  const dataAfterUpdated = await User.findByIdAndUpdate(id, { userName, email, age, gender, phone })
  res.json({ success: true, message: "updated successfully", message: dataAfterUpdated })
}


//delete user
export const deleteUser = async (req, res, next) => {
  const userEmail = req.payload.email;
  const { token } = req.header;
  const id = req.payload.id;
  const isUserEmail = await User.findOne({ email: userEmail })
  console.log(isUserEmail)
  console.log(userEmail)
  if (!isUserEmail) return next(new Error("you are not the user", { cause: 401 }))
  const deleteUser = await User.findByIdAndDelete(id);
  await Token.findOneAndUpdate({ token }, { isValid: false })
  res.json({ success: true, message: "deleted successfully", result: deleteUser })
}
//soft delete
export const deleteUserSoft = async (req, res, next) => {
  const userEmail = req.payload.email;
  const id = req.payload.id;
  const isUser = await User.findOne({ email: userEmail, _id: id });
  if (!isUser) {
    return next(new Error("You are not the user", { cause: 401 }));
  }
  const updatedUser = await User.findByIdAndUpdate(id, { deleted: true }, { new: true });

  if (!updatedUser) {
    return res.json({ success: false, message: "User not found", result: null });
  }
  res.json({ success: true, message: "Soft delete successful", result: updatedUser });
};



//log out user 
export const logOut = async (req, res, next) => {
  const { token } = req.header;
  await Token.findOneAndUpdate({ token }, { isValid: false })
  return res.json({ success: true, message: "user logged out" })
}




