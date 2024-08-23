import { Document } from "mongoose";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IPythonApp {
  userId: string;
  code: string;
  createdAt: Date;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
}
