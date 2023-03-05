import mongoose from 'mongoose';

export interface IMessageDetails extends IMessageDetailsLean, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IMessageDetailsLean {
  _id: string;
  message: string;
}
