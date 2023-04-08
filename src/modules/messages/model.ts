import mongoose from 'mongoose';
import type * as type from '../../types';
import * as enums from '../../enums';
import { EMessageTargets } from '../../enums';

export const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Message sender not provided'],
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide message receiver'],
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Please provide message owner'],
    },
    body: {
      type: mongoose.Types.ObjectId,
      required: [true, 'Message body not provided'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: Object.values(EMessageTargets),
      default: EMessageTargets.Messages,
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'ChatId not provided'],
    },
  },
  { timestamps: true, collection: enums.EDbCollections.Messages },
);

const Message = mongoose.model<type.IMessage>('Message', messageSchema);
export default Message;
