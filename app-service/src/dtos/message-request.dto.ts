import { IsNotEmpty } from 'class-validator';

export class MesssageRequest {
  @IsNotEmpty()
  messageId: string;

  @IsNotEmpty()
  senderUserId: string;

  @IsNotEmpty()
  receiverUserId: string;

  @IsNotEmpty()
  messageBody: string;
}
