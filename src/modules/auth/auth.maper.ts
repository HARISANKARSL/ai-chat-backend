import { IUser } from "../user/user.types.js";

export const toAuthResponse = (user: IUser) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});