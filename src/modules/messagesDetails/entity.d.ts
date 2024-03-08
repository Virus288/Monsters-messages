import type mongoose from 'mongoose';

export interface IMessageDetailsEntity {
  _id: string;
  message: string;
}

export interface IMessageDetails extends IMessageDetailsEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
