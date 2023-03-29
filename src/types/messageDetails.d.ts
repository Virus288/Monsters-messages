import type mongoose from 'mongoose';
import type { IMessageDetailsEntity } from '../modules/messagesDetails/entity';

export interface IMessageDetails extends IMessageDetailsEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
