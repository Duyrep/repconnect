export default class MessageCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly sender: {
      id: string;
      username: string;
      displayName?: string;
    },
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
