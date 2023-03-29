export interface ISendMessageDto {
  body: string;
  receiver: string;
  sender: string;
}

export interface IGetMessageDto {
  page: number;
  message?: string;
}

export interface IReadMessageDto extends IGetMessageDto {
  message: string;
}
