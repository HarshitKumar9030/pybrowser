import mongoose, { Schema, model, models, Model } from "mongoose";
import { UserDocument } from "@/types/types";

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
      select: false, 
    },
  },
  {
    timestamps: true, 
  }
);

const User = (models.User || model<UserDocument>("User", UserSchema)) as Model<UserDocument>;
export default User;
