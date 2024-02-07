import mongoose from 'mongoose';
import Message from './model';
import { EDbCollections, EMessageTargets } from '../../enums';
import type {
  IFullMessageEntity,
  IGetMessageEntity,
  IGetOneMessageEntity,
  IMessageEntity,
  IUnreadMessageEntity,
} from './entity';
import type * as types from '../../types';

export default class Rooster {
  async add(data: types.INewMessage): Promise<void> {
    const NewMessage = new Message(data);
    await NewMessage.save();
  }

  async get(owner: string, page: number): Promise<IGetMessageEntity[]> {
    return Message.find({ $or: [{ sender: owner }, { receiver: owner }] })
      .select({
        sender: true,
        receiver: true,
        type: true,
        chatId: true,
      })
      .limit(100)
      .sort({ _id: -1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }

  async getWithDetails(chatId: string, page: number): Promise<IFullMessageEntity[]> {
    const data = (await Message.aggregate([
      {
        $match: { chatId: new mongoose.Types.ObjectId(chatId) },
      },
      {
        $addFields: { date: '$createdAt' },
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
          _id: 1,
          chatId: 1,
          sender: 1,
          receiver: 1,
          read: 1,
          date: true,
          message: { $arrayElemAt: ['$details.message', 0] },
        },
      },
    ])
      .limit(100)
      .sort({ _id: 1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)) as IFullMessageEntity[];

    return !data || data.length === 0 ? [] : data;
  }

  /**
   * Get one message with selected sender and receiver. Currently used to validate if user ever had conversation
   */
  async getOne(sender: string, receiver: string): Promise<{ chatId: string } | null> {
    return Message.findOne({
      $or: [
        { sender, receiver },
        { receiver: sender, sender: receiver },
      ],
    })
      .select({ chatId: true })
      .lean();
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneMessageEntity | null> {
    return Message.findOne({ chatId, receiver })
      .select({
        read: true,
        chatId: true,
        sender: true,
      })
      .lean();
  }

  async getUnread(owner: string, page: number): Promise<IUnreadMessageEntity[]> {
    return Message.find({ $or: [{ sender: owner }, { receiver: owner }], read: false, type: EMessageTargets.Messages })
      .select({ chatId: true, sender: true, receiver: true, createdAt: true })
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
  }

  async update(
    chatId: string,
    sender: string,
    data: types.IObjectUpdate<IMessageEntity, keyof IMessageEntity>,
  ): Promise<void> {
    await Message.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
