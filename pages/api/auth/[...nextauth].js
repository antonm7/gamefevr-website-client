import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
    session: {
        jwt: true,
    },
    callbacks: {
        async session(session, token) {
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        },
        async jwt(token, user, account, profile, isNewUser) {
            if (user) {
                token.accessToken = user.userId;
                token.user = user;
            }
            return token;
        },
      },
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                //Get all the users
                //get user with his email (credentials.email)
                //Not found - send error res
                if (!result) {
                    throw new Error('No user found with the email');
                }
                //Check hased password with DB password
                //check if password is valid with verifyPassword
                if (!isValid) {
                throw new Error('Could not log you in!');
                }
                //Else send success response
                return { 
                    email: result.email,
                    userName:result.username,
                    userId: result._id,
                }
            },
        }),
    ],
});