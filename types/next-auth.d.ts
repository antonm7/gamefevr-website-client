import { ObjectId } from "bson"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      userId:ObjectId,
      email:string,
      username:string
    }
  }
}