import UserModel from "./user.modal.js";

export const findByEmail = async (
  email: string
) => {
  return UserModel.findOne({ email }).select("+password");
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  return UserModel.create(userData);
};

export const findById = async (
  userId: string
) => {
  return UserModel.findById(userId).select("+password");
};

export const findAllUsers = async () => {
  return UserModel.find().select(
    "-password -__v"
  );
};


export const findUserById=async(userId:string)=>{
  return UserModel.findById(userId).select("-password -__v");
}

export const updateUser = async (
  userId: string,
  updateData: {
    name: string;
  }
) => {
  return UserModel.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
    }
  ).select("-password -__v");
};

export const updatePassword = async (
  userId: string,
  password: string
) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { password },
    { new: true }
  );
};

export const deleteUser = async (
  userId: string
) => {
  return UserModel.findByIdAndDelete(userId);
};