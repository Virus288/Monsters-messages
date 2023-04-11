import type { IGetMessageEntity, IUnreadMessageEntity } from './entity';
import type { IPreparedMessages, IPreparedMessagesBody, IUnreadMessage } from '../../types';

export const formUnreadMessages = (data: IUnreadMessageEntity[], user: string): IUnreadMessage[] => {
  const prepared: Record<string, IUnreadMessage> = {};

  data.forEach((d) => {
    if (d.receiver.toString() !== user) return;

    prepared[d.chatId] === undefined
      ? (prepared[d.chatId] = {
          chatId: d.chatId,
          lastMessage: Date.parse(d.createdAt).valueOf(),
          participants: [d.receiver.toString(), d.sender.toString()],
          unread: 0,
        })
      : null;

    prepared[d.chatId]!.unread++;
    prepared[d.chatId]!.lastMessage = Date.parse(d.createdAt).valueOf();
  });

  return Object.values(prepared);
};

export const formGetMessages = (data: IGetMessageEntity[]): Record<string, IPreparedMessagesBody> => {
  const prepared: IPreparedMessages = {
    type: data[0]!.type,
    messages: {},
  };

  data.forEach((d) => {
    prepared.messages[d.chatId] === undefined
      ? (prepared.messages[d.chatId] = { messages: 0, receiver: d.receiver, sender: d.sender })
      : null;

    prepared.messages[d.chatId]!.messages++;
  });

  return prepared.messages;
};
