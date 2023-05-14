export class MessageEvent {
  constructor(
    public readonly messageId: string,
    public readonly senderUserId: string,
    public readonly receiverUserId: string,
    public readonly messageBody: string,
    public readonly users: Array<{ id: string; socketId: string }>,
  ) {}
}
