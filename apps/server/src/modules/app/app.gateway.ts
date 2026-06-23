import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AppService } from './app.service';
import { Server, Socket } from 'socket.io';
import { AppEvents } from '@rep/shared/events';
import { AuthService } from '../auth/auth.service';
import * as cookie from 'cookie';
import { UsersService } from '../users/users.service';
import { ConversationsService } from '../conversations/conversations.service';
import { OnEvent } from '@nestjs/event-emitter';
import { MessageCreatedEvent, MessageEvent } from '@/common/events';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    displayName?: string;
  };
  conversationId?: string;
}

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server;

  constructor(
    private readonly appService: AppService,
    private readonly conversationsService: ConversationsService,
    private readonly usersServer: UsersService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const accessToken = client.handshake.auth.accessToken;

      if (!accessToken) {
        client.disconnect(true);
        return;
      }

      const payload = await this.authService.verifyAccessToken(accessToken);

      const user = await this.usersServer.findOneById(payload.sub);

      if (!user) {
        client.disconnect(true);
        return;
      }

      client.user = {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
      };
    } catch (e) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage(AppEvents.ConversationJoin)
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    if (!client.user) return;

    const conversation = await this.conversationsService.getConversationForUser(
      client.user.id,
      conversationId,
    );

    if (client.conversationId) {
      client.leave(client.conversationId);
    }

    client.conversationId = conversation.id;
    client.join(conversation.id);
  }

  @SubscribeMessage(AppEvents.ConversationLeave)
  async handleLeaveRoom(@ConnectedSocket() client: AuthenticatedSocket) {
    if (!client.conversationId) return;

    client.leave(client.conversationId);
    client.conversationId = undefined;
  }

  @OnEvent(MessageEvent.Created)
  public handleMessageCreatedEvent(payload: MessageCreatedEvent) {
    this.server.to(payload.conversationId).emit(AppEvents.MessageNew, payload);
  }
}
