import mongoose from 'mongoose';
import * as enums from '../../enums';
import { messageSchema } from '../messages/model';
import type * as type from '../../types';

const Chat = mongoose.model<type.IMessage>('Chat', messageSchema, enums.EDbCollections.Chats);
export default Chat;
