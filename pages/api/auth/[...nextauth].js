import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/functions/mongodb";

export default NextAuth({
  session: {
    jwt: true,
  },
  callbacks: {
    //thats the object we can access on the client
    //so we set the user data inside object on session instance
    //we get the user information from the token(jwt).
    //we returning the session and can access it on the clinet(includes our user data)
    async session({ session, token }) {
      session.user = {
        email: token.email,
        username: token.username,
        userId: token.userId,
      };
      return session;
    },
    async jwt({ token, user }) {
      //after login we get the user data from 'credentials authorize' below.
      //the user is available one time after login and wil be lost after refresh.
      //so we store the user data inside jwt and returning it
      if (user) {
        token.email = user.email;
        token.username = user.username;
        token.userId = user.userId;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          //Get all the users
          const client = await clientPromise;
          const db = client.db();
          const users = await db.collection("users");

          const result = await users.findOne({
            email: credentials.email,
          });

          if (!result) {
            throw new Error("Email Or Password Are Invalid");
          }

          const isValid = compare(credentials.password, result.password);
          if (!isValid) {
            throw new Error("Email Or Password Are Invalid");
          }

          return {
            email: result.email,
            username: result.username,
            userId: result._id,
          };
        } catch (e) {
          throw new Error(e)

          // console.log("errororor", e);
        }
      },
    }),
  ],
});
