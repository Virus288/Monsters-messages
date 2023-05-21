import mongoose from 'mongoose';
import * as enums from '../../enums';
import { EMessageTargets } from '../../enums';
import type * as type from '../../types';

export const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, 'sender not provided'],
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: [true, 'receiver not provided'],
    },
    body: {
      type: mongoose.Types.ObjectId,
      required: [true, 'body not provided'],
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
      required: [true, 'chatId not provided'],
    },
  },
  { timestamps: true },
);

const Message = mongoose.model<type.IMessage>('Message', messageSchema, enums.EDbCollections.Messages);
export default Message;
