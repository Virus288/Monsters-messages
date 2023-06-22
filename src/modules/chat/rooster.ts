import mongoose from 'mongoose';
import Chat from './model';
import { EDbCollections, EMessageTargets } from '../../enums';
import type {
  IChatMessageEntity,
  IFullChatMessageEntity,
  IGetChatMessageEntity,
  IGetOneChatMessageEntity,
  IUnreadChatMessageEntity,
} from './entity';
import type * as types from '../../types';

export default class Rooster {
  async add(data: types.INewMessage): Promise<void> {
    const NewMessage = new Chat(data);
    await NewMessage.save();
  }

  async get(owner: string, page: number): Promise<IGetChatMessageEntity[]> {
    return Chat.find({ $or: [{ sender: owner }, { receiver: owner }] })
      .select({
        _id: false,
        sender: true,
        receiver: true,
        type: true,
        chatId: true,
      })
      .limit(100)
      .skip((page - 1) * 100)
      .sort({ _id: -1 })
      .lean();
  }

  async getWithDetails(chatId: string, page: number): Promise<IFullChatMessageEntity[]> {
    const data = (await Chat.aggregate([
      {
        $match: { chatId: new mongoose.Types.ObjectId(chatId) },
      },
      {
        $lookup: {
          from: EDbCollections.MessageDetails,
          localField: 'body',
          foreignField: '_id',
          as: 'details',
        },
      },
      {
        $project: {
          _id: 0,
          chatId: 1,
          sender: 1,
          receiver: 1,
          read: 1,
          message: { $arrayElemAt: ['$details.message', 0] },
        },
      },
    ])
      .limit(100)
      .sort({ _id: -1 })
      .skip((page - 1) * 100)) as IFullChatMessageEntity[];

    return !data || data.length === 0 ? [] : data;
  }

  /**
   * Get one message with selected sender and receiver. Currently used to validate if user ever had conversation
   */
  async getOne(sender: string, receiver: string): Promise<{ chatId: string } | null> {
    return Chat.findOne({
      $or: [
        { sender, receiver },
        { receiver: sender, sender: receiver },
      ],
    })
      .select({ chatId: true })
      .lean();
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneChatMessageEntity | null> {
    return Chat.findOne({ chatId, receiver })
      .select({
        read: true,
        chatId: true,
        sender: true,
      })
      .lean();
  }

  async getUnread(owner: string, page: number): Promise<IUnreadChatMessageEntity[]> {
    return Chat.find({ $or: [{ sender: owner }, { receiver: owner }], read: false, type: EMessageTargets.Chat })
      .select({ chatId: true, sender: true, receiver: true, createdAt: true })
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page - 1) * 100)
      .lean();
  }

  async update(
    chatId: string,
    sender: string,
    data: types.IObjectUpdate<IChatMessageEntity, keyof IChatMessageEntity>,
  ): Promise<void> {
    await Chat.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
