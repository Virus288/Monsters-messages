import type { IMessageDetailsEntity } from '../modules/messagesDetails/entity';
import type mongoose from 'mongoose';

export interface IMessageDetails extends IMessageDetailsEntity, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}
