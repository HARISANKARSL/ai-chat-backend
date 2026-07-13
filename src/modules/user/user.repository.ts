import UserModel from "./user.modal.js";


export const findByEmail = async (
  email: string
) => {
  return UserModel.findOne({ email });
};