import type * as type from '../../types';
import { messageSchema } from '../messages/model';
import mongoose from 'mongoose';
import * as enums from '../../enums';

const Chat = mongoose.model<type.IMessage>('Chat', messageSchema, enums.EDbCollections.Chats);
export default Chat;
