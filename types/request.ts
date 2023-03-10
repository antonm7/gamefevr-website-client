import { ObjectId } from "bson";

export type Simple_Query = {
  gameId: number;
  userId: ObjectId;
};

export type PromiseHandlerProps = {
  status: 'fulfilled' | 'rejected'
  reason?: string
  value: any
}
