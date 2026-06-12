import { FriendShipStatus } from "@/enums";

export interface FriendShip {
  requester: {
    id: string;
    displayName: string;
    username: string;
  };
  recipient: {
    id: string;
    displayName: string;
    username: string;
  };
  status: FriendShipStatus;
  createdAt: string;
}
