import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  uid: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
